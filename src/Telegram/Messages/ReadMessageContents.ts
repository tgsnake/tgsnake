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
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.readMessageContents`
      );
    }
    return new ResultAffectedMessages(
      await snakeClient.client.invoke(
        new Api.messages.ReadMessageContents({
          id: messageId,
        })
      )
    );
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.readMessageContents';
    botError.functionArgs = `${JSON.stringify(messageId)}`;
    throw botError;
  }
}
