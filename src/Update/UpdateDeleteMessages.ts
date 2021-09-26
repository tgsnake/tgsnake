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

export class UpdateDeleteMessages extends Update {
  messages!: number[];
  constructor() {
    super();
    this['_'] = 'UpdateDeleteMessages';
  }
  async init(update: Api.UpdateDeleteMessages, SnakeClient: Snake) {
    this.telegram = SnakeClient.telegram;
    this.messages = update.messages;
    return this;
  }
}
