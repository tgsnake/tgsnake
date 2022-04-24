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
import Util from 'tg-file-id/dist/Util';
import { toString } from '../Utils/ToBigInt';
import { PostAddress } from '../Utils/Payment';
import { ShippingOptions } from '../Telegram/Bots';
export class UpdateBotShippingQuery extends Update {
  id!: bigint;
  from!: From;
  payload!: string;
  shippingAddress!: PostAddress;
  constructor() {
    super();
    this['_'] = 'updateBotShippingQuery';
  }
  async init(update: Api.UpdateBotShippingQuery, SnakeClient: Snake) {
    SnakeClient.log.debug(`Creating ${this['_']}`);
    this.telegram = SnakeClient.telegram;
    this.id = BigInt(String(update.queryId));
    this.payload = update.payload.toString('utf8');
    this.shippingAddress = new PostAddress(update.shippingAddress!);
    this.from = new From();
    await this.from.init(BigInt(String(update.userId)), SnakeClient);
    return this;
  }
  async answer(options?: Array<ShippingOptions>, error?: string) {
    return this.telegram.answerShippingQuery(this.id, options, error);
  }
}
