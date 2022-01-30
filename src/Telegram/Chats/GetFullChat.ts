// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published..

import { Api } from 'telegram';
import { Snake } from '../../Client';
import BotError from '../../Context/Error';
import { toBigInt } from '../../Utils/ToBigInt';
import { BigInteger } from 'big-integer';
/**
 * Returns full chat/channel info according to its ID.
 * @param snakeClient - Client
 * @param {number|string|bigint} chatId - Chat/Groups/Channel id.
 * ```ts
 * bot.command("getFullChat",async (ctx) => {
 *     let results = await ctx.telegram.getFullChat(ctx.chat.id)
 * })
 * ```
 */
export async function GetFullChat(snakeClient: Snake, chatId: number | string | bigint) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.getFullChat`
      );
    }
    let [id, type] = await toBigInt(chatId, snakeClient);
    if (type == 'channel' || type == 'supergroup') {
      return snakeClient.client.invoke(
        new Api.channels.GetFullChannel({
          channel: id as BigInteger,
        })
      );
    } else {
      return snakeClient.client.invoke(
        new Api.messages.GetFullChat({
          chatId: id as BigInteger,
        })
      );
    }
  } catch (error: any) {
    throw new BotError(error.message, 'telegram.getFullChat', `${chatId}`);
  }
}
