// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
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
    this['_'] = 'UpdateMessageID';
  }
  async init(update: Api.UpdateMessageID, SnakeClient: Snake) {
    this.telegram = SnakeClient.telegram;
    this.id = update.id;
    this.randomId = update.randomId;
    return this;
  }
}
