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

export class UpdateDeleteMessages extends Update {
  id!: number[];
  constructor() {
    super();
    this['_'] = 'updateDeleteMessages';
  }
  async init(update: Api.UpdateDeleteMessages, SnakeClient: Snake) {
    let mode = ['debug', 'info'];
    if (mode.includes(SnakeClient.logger)) {
      console.log(
        '\x1b[31m',
        `[${SnakeClient.connectTime}] - [${new Date().toLocaleString()}] - Creating update ${
          this['_']
        }`,
        '\x1b[0m'
      );
    }
    this.telegram = SnakeClient.telegram;
    this.id = update.messages;
    return this;
  }
}
