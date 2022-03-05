// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../Client';
import { ResultAffectedMessages } from './DeleteMessages';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
export interface deleteHistoryMoreParams {
  maxId?: number;
  revoke?: boolean;
  justClear?: boolean;
}
/**
 * This method allow you to deletes communication history.
 * @param snakeClient - Client
 * @param {string|number|bigint} chatId - User or chat, communication history of which will be deleted.
 * @param {Object} more - more parameters to use.
 * ```ts
 * bot.command("clear", async (ctx) => {
 *     let results = await ctx.telegram.deleteHistory(ctx.chat.id)
 *     return console.log(results)
 * })
 * ```
 */
export async function DeleteHistory(
  snakeClient: Snake,
  chatId: number | string | bigint,
  more?: deleteHistoryMoreParams
) {
  try {
    snakeClient.log.debug('Running telegram.deleteHistory');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    if (type == 'channel' || type == 'supergroup') {
      return snakeClient.client.invoke(
        new Api.channels.DeleteHistory({
          channel: peer,
          ...more,
        })
      );
    } else {
      return new ResultAffectedMessages(
        await snakeClient.client.invoke(
          new Api.messages.DeleteHistory({
            peer: peer,
            ...more,
          })
        )
      );
    }
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.deleteHistory');
    throw new BotError(
      error.message,
      'telegram.deleteHistory',
      `${chatId}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
