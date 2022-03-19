// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Update } from './Update';
import { Api } from 'telegram';
import { Snake } from '../Client';
import { Telegram } from '../Telegram';
import Parser, { Entities } from '@tgsnake/parser';
import { TypeMessageMedia, GenerateMedia } from '../Utils/Medias';
import { MessageContext } from '../Context/MessageContext';
const parser = new Parser(Api);
export class UpdateShortSentMessage extends Update {
  message!: MessageContext;
  constructor() {
    super();
    this['_'] = 'updateShortSentMessage';
  }
  async init(update: Api.UpdateShortSentMessage, SnakeClient: Snake) {
    SnakeClient.log.debug(`Creating ${this['_']}`);
    this.message = new MessageContext();
    this.telegram = SnakeClient.telegram;
    this.message.out = update.out;
    this.message.id = update.id;
    this.message.date = update.date;
    this.message.ttlPeriod = update.ttlPeriod;
    if (update.media) {
      this.message.media = await GenerateMedia(update.media!, SnakeClient);
    }
    if (update.entities) {
      this.message.entities = parser.fromRaw(update.entities);
    }
    this.message.SnakeClient = SnakeClient;
    return this;
  }
}
