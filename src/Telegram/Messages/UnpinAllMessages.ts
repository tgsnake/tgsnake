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
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
/**
 * Unpin all message in chats.
 * @param snakeClient - Client
 * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
 * ```ts
 * bot.command("unpinAll",async (ctx)=>{
 *     let results = await ctx.telegram.unpinAllMessages(ctx.chat.id)
 *     console.log(results)
 * })
 * ```
 */
export async function UnpinAllMessages(snakeClient: Snake, chatId: number | string | bigint) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.unpinAllMessages`
      );
    }
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    return new ResultAffectedMessages(
      await snakeClient.client.invoke(
        new Api.messages.UnpinAllMessages({
          peer: peer,
        })
      )
    );
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.unpinAllMessages';
    botError.functionArgs = `${chatId}`;
    throw botError;
  }
}
