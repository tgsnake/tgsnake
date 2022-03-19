// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { ReplyToMessage } from '../Utils/ReplyToMessage';
import { replyMoreParams } from '../Interface/reply';
import { betterConsoleLog } from '../Utils/CleanObject';
import { inspect } from 'util';
export class ReplyToMessageContext extends ReplyToMessage {
  constructor() {
    super();
  }
  [inspect.custom]() {
    return betterConsoleLog(this);
  }
  toJSON() {
    let obj = betterConsoleLog(this);
    for (let [key, value] of Object.entries(obj)) {
      if (typeof value == 'bigint') obj[key] = String(value);
    }
    return obj;
  }
  async reply(text: string, more?: replyMoreParams) {
    if (this.chat) {
      let client = this.SnakeClient;
      return await client.telegram.sendMessage(this.chat.id, text, {
        replyToMsgId: this.id,
        ...more,
      });
    }
  }
  async replyWithHTML(text: string, more?: replyMoreParams) {
    return await this.reply(text, {
      parseMode: 'html',
      ...more,
    });
  }
  async replyWithMarkdown(text: string, more?: replyMoreParams) {
    return await this.reply(text, {
      parseMode: 'markdown',
      ...more,
    });
  }
}
