// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Snake } from '../../client';
import { Api } from 'telegram';
import { toBigInt, toNumber } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
export class ResultAffectedMessages {
  pts?: number = 0;
  ptsCount?: number = 0;
  offset?: number;
  date: Date | number = Math.floor(Date.now() / 1000);
  constructor(results: Api.messages.AffectedMessages | Api.messages.AffectedHistory | boolean) {
    if (results instanceof Api.messages.AffectedMessages) {
      if (results.pts) this.pts = results.pts;
      if (results.ptsCount) this.ptsCount = results.ptsCount;
    }
    if (results instanceof Api.messages.AffectedHistory) {
      if (results.pts) this.pts = results.pts;
      if (results.ptsCount) this.ptsCount = results.ptsCount;
      if (results.offset) this.offset = results.offset;
    }
  }
}
/**
 * This method allow you to deletes messages by their identifiers
 * @param snakeClient - Client
 * @param {number|string|bigint} chatId - User or chat, where is the message located.
 * @param {Array} messageId - Message ID list which will be deleted.
 * ```ts
 * bot.command("delete", async (ctx) => {
 *     let results = await ctx.telegram.deleteMessages(ctx.chat.id,[ctx.id])
 *     return console.log(results)
 * })
 * ```
 */
export async function DeleteMessages(
  snakeClient: Snake,
  chatId: number | string | bigint,
  messageId: number[]
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.deleteMessages`
      );
    }
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    if (type == 'channel') {
      return new ResultAffectedMessages(
        await snakeClient.client.invoke(
          new Api.channels.DeleteMessages({
            channel: peer,
            id: messageId,
          })
        )
      );
    } else {
      return new ResultAffectedMessages(
        await snakeClient.client.invoke(
          new Api.messages.DeleteMessages({
            revoke: true,
            id: messageId,
          })
        )
      );
    }
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.deleteMessages';
    botError.functionArgs = `${chatId},${JSON.stringify(messageId)}`;
    throw botError;
  }
}
