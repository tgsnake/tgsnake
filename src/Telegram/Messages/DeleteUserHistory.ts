// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Snake } from '../../Client';
import { Api } from 'telegram';
import { ResultAffectedMessages } from './DeleteMessages';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';

/**
 * Delete all messages sent by a certain user in a supergroup
 * @param snakeClient - client.
 * @param {number|string|bigint} chatId - supergroup id.
 * @param {number|string|bigint} userId - User whose messages should be deleted.
 * ```ts
 * bot.command("deleteMe", async (ctx) => {
 *     let results = await ctx.telegram.deleteUserHistory(ctx.chat.id,ctx.from.id)
 *     return console.log(results)
 * })
 * ```
 */
export async function DeleteUserHistory(
  snakeClient: Snake,
  chatId: number | string | bigint,
  userId: number | string | bigint
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.deleteUserHistory`
      );
    }
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    let [uId, uType, uPeer] = await toBigInt(userId, snakeClient);
    return new ResultAffectedMessages(
      await snakeClient.client.invoke(
        new Api.channels.DeleteParticipantHistory({
          channel: peer,
          participant: uPeer,
        })
      )
    );
  } catch (error: any) {
    throw new BotError(error.message, 'telegram.deleteUserHistory', `${chatId}${userId}`);
  }
}
