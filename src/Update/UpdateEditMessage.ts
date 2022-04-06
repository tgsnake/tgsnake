// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { From } from '../Utils/From';
import { Update } from './Update';
import { Telegram } from '../Telegram';
import { Snake } from '../Client';
import { BigInteger } from 'big-integer';
import { MessageContext } from '../Context/MessageContext';
import Util from 'tg-file-id/dist/Util';
import { toString } from '../Utils/ToBigInt';

export class UpdateEditMessage extends Update {
  message!: MessageContext;
  constructor() {
    super();
    this['_'] = 'updateEditMessage';
  }
  async init(update: Api.UpdateEditMessage, SnakeClient: Snake) {
    SnakeClient.log.debug(`Creating ${this['_']}`);
    this.telegram = SnakeClient.telegram;
    let message = new MessageContext();
    if (update.message instanceof Api.Message) {
      await message.init(update.message as Api.Message, SnakeClient);
    }
    if (update.message instanceof Api.MessageService) {
      await message.init(update.message as Api.MessageService, SnakeClient);
    }
    this.message = message;
    return this;
  }
}
