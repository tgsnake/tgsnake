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
import { BigInteger } from 'big-integer';
export class UpdateMessageID extends Update {
  id!: number;
  randomId!: BigInteger;
  constructor() {
    super();
    this['_'] = 'updateMessageID';
  }
  async init(update: Api.UpdateMessageID, SnakeClient: Snake) {
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
    this.id = update.id;
    this.randomId = update.randomId;
    return this;
  }
}
