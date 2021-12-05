// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import { ResultAffectedMessages } from './DeleteMessages';
import { toBigInt, toNumber } from '../../Utils/ToBigInt';
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
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.deleteHistory`
      );
    }
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    if (type == 'channel') {
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
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.deleteHistory';
    botError.functionArgs = `${chatId}${more ? ',' + JSON.stringify(more) : ''}`;
    throw botError;
  }
}
