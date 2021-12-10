// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
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
class Views {
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
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.getMessagesViews';
    botError.functionArgs = `${chatId},${JSON.stringify(messageId)},${increment}`;
    throw botError;
  }
}
