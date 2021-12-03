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
import { Entities } from '../Utils/Entities';
import { Media } from '../Utils/Media';
import { MessageContext } from '../Context/MessageContext';
export class UpdateShortSentMessage extends Update {
  message!: MessageContext;
  constructor() {
    super();
    this['_'] = 'updateShortSentMessage';
  }
  async init(update: Api.UpdateShortSentMessage, SnakeClient: Snake) {
    let mode = ['debug', 'info'];
    if (mode.includes(SnakeClient.logger)) {
      SnakeClient.log(
        `[${SnakeClient.connectTime}] - [${new Date().toLocaleString()}] - Creating update ${
          this['_']
        }`
      );
    }
    this.message = new MessageContext();
    this.telegram = SnakeClient.telegram;
    this.message.out = update.out;
    this.message.id = update.id;
    this.message.date = update.date;
    this.message.ttlPeriod = update.ttlPeriod;
    if (update.media) {
      let media = new Media();
      await media.encode(await media.parseMedia(update.media));
      this.message.media = media;
    }
    if (update.entities) {
      let temp: Entities[] = [];
      update.entities.forEach((item) => {
        temp.push(new Entities(item!));
      });
      this.message.entities = temp;
    }
    this.message.telegram = this.telegram;
    this.message.SnakeClient = SnakeClient;
    return this;
  }
}
