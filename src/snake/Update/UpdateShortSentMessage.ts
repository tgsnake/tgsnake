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
import { Entities } from '../Utils/Entities';
import { Media } from '../Utils/Media';
export class UpdateShortSentMessage extends Update {
  out?: boolean;
  id!: number;
  date!: number;
  media?: Media;
  entities?: Entities[];
  ttlPeriod?: number;
  constructor() {
    super();
    this['_'] = 'UpdateShortSentMessage';
  }
  async init(update: Api.UpdateShortSentMessage, SnakeClient: Snake) {
    this.telegram = SnakeClient.telegram;
    this.out = update.out;
    this.id = update.id;
    this.date = update.date;
    this.ttlPeriod = update.ttlPeriod;
    if (update.media) {
      let media = new Media();
      await media.encode(await media.parseMedia(update.media));
      this.media = media;
    }
    if (update.entities) {
      let temp: Entities[] = [];
      update.entities.forEach((item) => {
        temp.push(new Entities(item!));
      });
      this.entities = temp;
    }
    return this;
  }
}
