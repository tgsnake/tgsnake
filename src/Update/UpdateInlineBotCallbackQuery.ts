// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { From } from '../Utils/From';
import { Update } from './Update';
import { Telegram } from '../Telegram';
import { Snake } from '../client';
import { BigInteger } from 'big-integer';
import { MessageContext } from '../Context/MessageContext';
import Util from 'tg-file-id/dist/Util';
export class UpdateInlineBotCallbackQuery extends Update {
  id!: BigInteger;
  data?: string;
  message!: MessageContext;
  from!: From;
  chatInstance!: BigInteger;
  inlineMessageId?: string;
  gameShortName?: string;
  constructor() {
    super();
    this['_'] = 'updateInlineBotCallbackQuery';
  }
  async init(update: Api.UpdateInlineBotCallbackQuery, SnakeClient: Snake) {
    this.telegram = SnakeClient.telegram;
    this.data = update.data?.toString('utf8');
    this.id = update.queryId;
    this.gameShortName = update.gameShortName;
    this.chatInstance = update.chatInstance;
    this.inlineMessageId = '';
    this.inlineMessageId += Util.to32bitBuffer(update.msgId.dcId);
    let id = BigInt(String(update.msgId.id));
    let accessHash = BigInt(String(update.msgId.accessHash));
    this.inlineMessageId += Util.to64bitBuffer(id);
    if (accessHash < BigInt(0)) {
      this.inlineMessageId += Util.to64bitBuffer(accessHash * BigInt(-1));
    } else {
      this.inlineMessageId += Util.to64bitBuffer(accessHash);
    }
    this.inlineMessageId = Util.base64UrlEncode(Util.rleEncode(this.inlineMessageId));
    this.from = new From();
    await this.from.init(update.userId, SnakeClient);
    return this;
  }
}
