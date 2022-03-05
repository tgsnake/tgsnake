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
 * Notifies the sender about the recipient having listened a voice message or watched a video.
 * @param snakeClient - Client
 * @param {Array} messageId - message ids
 * ```ts
 * bot.on("message",async (ctx)=>{
 *     if(ctx.media){
 *         let results = await ctx.telegram.readMessageContents([ctx.id])
 *         console.log(results)
 *     }
 * })
 * ```
 */
export async function ReadMessageContents(snakeClient: Snake, messageId: number[]) {
  try {
    snakeClient.log.debug('Running telegram.readMessageContents');
    return new ResultAffectedMessages(
      await snakeClient.client.invoke(
        new Api.messages.ReadMessageContents({
          id: messageId,
        })
      )
    );
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.readMessageContents');
    throw new BotError(
      error.message,
      'telegram.readMessageContents',
      `${JSON.stringify(messageId)}`
    );
  }
}
