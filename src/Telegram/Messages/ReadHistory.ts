// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { ResultAffectedMessages } from './DeleteMessages';
import { Api } from 'telegram';
import { Snake } from '../../Client';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
export interface readHistoryMoreParams {
  maxId?: number;
}
/**
 * Marks message history as read.
 * @param snakeClient - Client
 * @param {bigint|number|string} chatId - Target user or group.
 * @param {Object} more - more parameter for ReadHistory.
 * ```ts
 * bot.command("readHistory",async (ctx)=>{
 *     let results = await ctx.telegram.readHistory(ctx.chat.id,ctx.id)
 *     console.log(results)
 * })
 * ```
 */
export async function ReadHistory(
  snakeClient: Snake,
  chatId: number | string | bigint,
  more?: readHistoryMoreParams
) {
  try {
    snakeClient.log.debug('Running telegram.readHistory');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    if (type == 'channel') {
      let results = await snakeClient.client.invoke(
        new Api.channels.ReadHistory({
          channel: peer,
          ...more,
        })
      );
      return new ResultAffectedMessages(results);
    } else {
      let results = await snakeClient.client.invoke(
        new Api.messages.ReadHistory({
          peer: peer,
          ...more,
        })
      );
      return new ResultAffectedMessages(results);
    }
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.readHistory');
    throw new BotError(
      error.message,
      'telegram.readHistory',
      `${chatId}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
