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
import * as Medias from '../Utils/Medias';
import { toString } from '../Utils/ToBigInt';
export class UpdateBotInlineQuery extends Update {
  id!: bigint;
  from!: From;
  query!: string;
  location?: Medias.MediaLocation;
  chatType?: string;
  offset!: string;
  constructor() {
    super();
    this['_'] = 'updateBotInlineQuery';
  }
  async init(update: Api.UpdateBotInlineQuery, SnakeClient: Snake) {
    SnakeClient.log.debug(`Creating ${this['_']}`);
    this.telegram = SnakeClient.telegram;
    this.id = BigInt(toString(update.queryId!) as string);
    this.query = update.query;
    this.offset = update.offset;
    if (update.peerType instanceof Api.InlineQueryPeerTypeSameBotPM) {
      this.chatType = 'sender';
    }
    if (update.peerType instanceof Api.InlineQueryPeerTypePM) {
      this.chatType = 'private';
    }
    if (update.peerType instanceof Api.InlineQueryPeerTypeChat) {
      this.chatType = 'group';
    }
    if (update.peerType instanceof Api.InlineQueryPeerTypeMegagroup) {
      this.chatType = 'superGroup';
    }
    if (update.peerType instanceof Api.InlineQueryPeerTypeBroadcast) {
      this.chatType = 'channel';
    }
    if (update.geo) {
      this.location = new Medias.MediaLocation();
      await this.location.encode(update.geo!, SnakeClient);
    }
    this.from = new From();
    await this.from.init(BigInt(toString(update.userId!) as string), SnakeClient);
    return this;
  }
}
