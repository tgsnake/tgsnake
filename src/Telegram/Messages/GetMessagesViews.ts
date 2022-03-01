// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../Client';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
export class ResultsMessagesViews {
  views?: Views[];
  date: Date | number = Math.floor(Date.now() / 1000);
  constructor(results: Api.messages.MessageViews) {
    if (results?.views.length > 0) {
      let tempViews: Views[] = new Array();
      for (let i = 0; i < results.views.length; i++) {
        let msg = results.views[i] as Api.MessageViews;
        tempViews.push(new Views(msg));
      }
      this.views = tempViews;
    }
  }
}
export class Views {
  views?: number;
  forwards?: number;
  replies?: Api.MessageReplies;
  constructor(getMessagesViews: Api.MessageViews) {
    if (getMessagesViews.views) {
      this.views = getMessagesViews.views;
    }
    if (getMessagesViews.forwards) {
      this.forwards = getMessagesViews.forwards;
    }
    if (getMessagesViews.replies) {
      this.replies = getMessagesViews.replies;
    }
  }
}
/**
 * Get and increase the view counter of a message sent or forwarded from a channel.
 * @param snakeClient - Client
 * @param {number|string|bigint} chatId - Where the message was found.
 * @param {Array} messageId - IDs of message.
 * @param {boolean} increment - Whether to mark the message as viewed and increment the view counter
 * ```ts
 * bot.command("getMessagesViews",async (ctx)=>{
 *     let results = await ctx.telegram.getMessagesViews(ctx.chat.id,[ctx.id])
 *     console.log(results)
 * })
 * ```
 */
export async function GetMessagesViews(
  snakeClient: Snake,
  chatId: number | string | bigint,
  messageId: number[],
  increment: boolean = false
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.getMessagesViews`
      );
    }
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    return new ResultsMessagesViews(
      await snakeClient.client.invoke(
        new Api.messages.GetMessagesViews({
          peer: peer,
          id: messageId,
          increment: increment,
        })
      )
    );
  } catch (error: any) {
    throw new BotError(
      error.message,
      'telegram.getMessagesViews',
      `${chatId},${JSON.stringify(messageId)},${increment}`
    );
  }
}
