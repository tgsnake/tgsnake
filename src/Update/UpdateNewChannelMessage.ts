// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Update } from './Update';
import { Api } from 'telegram';
import { Snake } from '../client';
import { Telegram } from '../Telegram';
import { MessageContext } from '../Context/MessageContext';
import { toString } from '../Utils/ToBigInt';

export class UpdateNewChannelMessage extends Update {
  message!: MessageContext;
  constructor() {
    super();
    this['_'] = 'updateNewChannelMessage';
  }
  async init(update: Api.UpdateNewChannelMessage, SnakeClient: Snake) {
    let mode = ['debug', 'info'];
    if (mode.includes(SnakeClient.logger)) {
      SnakeClient.log(
        `[${SnakeClient.connectTime}] - [${new Date().toLocaleString()}] - Creating update ${
          this['_']
        }`
      );
    }
    this.telegram = SnakeClient.telegram;
    this.message = new MessageContext();
    if (update.message instanceof Api.Message) {
      await this.message.init(update.message as Api.Message, SnakeClient);
      return this;
    }
    if (update.message instanceof Api.MessageService) {
      await this.message.init(update.message as Api.MessageService, SnakeClient);
      return this;
    }
    return this;
  }
}
