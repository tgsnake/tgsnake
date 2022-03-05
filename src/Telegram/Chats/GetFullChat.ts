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
    snakeClient.log.debug('Running telegram.getFullChat');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
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
    snakeClient.log.error('Failed to running telegram.getFullChat');
    throw new BotError(error.message, 'telegram.getFullChat', `${chatId}`);
  }
}
