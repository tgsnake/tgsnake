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
import { toNumber } from '../Utils/ToBigInt';
export class UpdateMessageID extends Update {
  id!: number;
  randomId!: bigint;
  constructor() {
    super();
    this['_'] = 'updateMessageID';
  }
  async init(update: Api.UpdateMessageID, SnakeClient: Snake) {
    let mode = ['debug', 'info'];
    if (mode.includes(SnakeClient.logger)) {
      SnakeClient.log(
        `[${SnakeClient.connectTime}] - [${new Date().toLocaleString()}] - Creating update ${
          this['_']
        }`
      );
    }
    this.telegram = SnakeClient.telegram;
    this.id = update.id;
    this.randomId = BigInt(toNumber(update.randomId!) as number);
    return this;
  }
}
