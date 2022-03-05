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
    snakeClient.log.debug('Running telegram.GetChannels');
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
        snakeClient.log.warning(
          'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
        );
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
    snakeClient.log.error('Failed to running telegram.getChannels');
    throw new BotError(error.message, 'telegram.getChannels', `${chatId}`);
  }
}
