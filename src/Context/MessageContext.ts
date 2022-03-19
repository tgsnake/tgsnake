// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Message } from '../Utils/Message';
import { Snake } from '../Client';
import { replyMoreParams } from '../Interface/reply';
import { forwardMessageMoreParams } from '../Telegram/Messages/ForwardMessages';
import { pinMessageMoreParams } from '../Telegram/Messages/PinMessage';
import { betterConsoleLog } from '../Utils/CleanObject';
import { inspect } from 'util';
export class MessageContext extends Message {
  match!: Array<RegExpExecArray>;
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
    if (this.id && this.chat.id) {
      let client: Snake = this.SnakeClient;
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
  async delete() {
    let client = this.SnakeClient;
    return await client.telegram.deleteMessage(this.chat.id, this.id);
  }
  async forward(chatId: string | number | bigint, more?: forwardMessageMoreParams) {
    let client = this.SnakeClient;
    return await client.telegram.forwardMessage(chatId, this.chat.id, this.id, more);
  }
  async pin(more?: pinMessageMoreParams) {
    let client = this.SnakeClient;
    return await client.telegram.pinMessage(this.chat.id, this.id, more);
  }
  async unpin() {
    let client = this.SnakeClient;
    return await client.telegram.unpinMessage(this.chat.id, this.id);
  }
  async link() {
    let client = this.SnakeClient;
    return await client.telegram.exportMessageLink(this.chat.id, this.id);
  }
}
