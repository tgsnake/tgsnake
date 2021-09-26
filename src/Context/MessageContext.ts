// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Message } from '../Utils/Message';
import { Snake } from '../client';
import { replyMoreParams } from '../Interface/reply';
export class MessageContext extends Message {
  constructor() {
    super();
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
}
// should be update.message.reply("text")
