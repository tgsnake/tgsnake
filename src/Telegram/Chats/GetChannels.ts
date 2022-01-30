// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../Client';
import BotError from '../../Context/Error';
import bigInt, { BigInteger } from 'big-integer';
/**
 * Get info about channels/supergroups.
 * @param snakeClient - Client
 * @param {Array} chatId - List of channel ids.
 * ```ts
 * bot.command("getChannels",async (ctx) => {
 *     let results = await ctx.telegram.getChannels([ctx.chat.id])
 *     console.log(results)
 * })
 * ```
 */
export async function GetChannels(snakeClient: Snake, chatId: number[] | string[] | bigint[]) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.getChannels`
      );
    }
    let id: BigInteger[] | string[] = [];
    for (let ids of chatId) {
      if (typeof ids == 'string') {
        //@ts-ignore
        id.push(ids as string);
      }
      if (typeof ids == 'bigint') {
        //@ts-ignore
        id.push(bigInt(ids as bigint) as BigInteger);
      }
      if (typeof ids == 'number') {
        //@ts-ignore
        id.push(bigInt(ids as number) as BigInteger);
      }
    }
    let results: Api.messages.TypeChats = await snakeClient.client.invoke(
      new Api.channels.GetChannels({
        id: id,
      })
    );
    //todo
    //change the json results.
    return results;
  } catch (error: any) {
    throw new BotError(error.message, 'telegram.getChannels', `${chatId}`);
  }
}
