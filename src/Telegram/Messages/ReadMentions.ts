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
/**
 * Mark mentions as read.
 * @param snakeClient - client
 * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
 * ```ts
 * bot.command("readMentions",async (ctx)=>{
 *     let results = await ctx.telegram.readMentions(ctx.chat.id)
 *     console.log(results)
 * })
 * ```
 */
export async function ReadMentions(snakeClient: Snake, chatId: number | string | bigint) {
  try {
    snakeClient.log.debug('Running telegram.readMentions');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    return new ResultAffectedMessages(
      await snakeClient.client.invoke(
        new Api.messages.ReadMentions({
          peer: peer,
        })
      )
    );
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.readMentions');
    throw new BotError(error.message, 'telegram.readMentions', '');
  }
}
