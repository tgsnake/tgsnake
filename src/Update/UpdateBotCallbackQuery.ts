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
export class UpdateBotCallbackQuery extends Update {
  id!: BigInteger;
  data?: string;
  message?: MessageContext;
  from!: From;
  chatInstance!: BigInteger;
  inlineMessageId?: string;
  gameShortName?: string;
  constructor() {
    super();
    this['_'] = 'updateBotCallbackQuery';
  }
  async init(update: Api.UpdateBotCallbackQuery, SnakeClient: Snake) {
    let mode = ['debug', 'info'];
    if (mode.includes(SnakeClient.logger)) {
      SnakeClient.log(
        `[${SnakeClient.connectTime}] - [${new Date().toLocaleString()}] - Creating update ${
          this['_']
        }`
      );
    }
    this.telegram = SnakeClient.telegram;
    this.data = update.data?.toString('utf8');
    this.id = update.queryId;
    this.gameShortName = update.gameShortName;
    this.chatInstance = update.chatInstance;
    this.message = new MessageContext();
    if (update.peer instanceof Api.PeerChat) {
      update.peer as Api.PeerChat;
      let msg = await SnakeClient.telegram.getMessages(update.peer.chatId, [update.msgId]);
      this.message = msg.messages[0];
    }
    if (update.peer instanceof Api.PeerChannel) {
      update.peer as Api.PeerChannel;
      let msg = await SnakeClient.telegram.getMessages(update.peer.channelId, [update.msgId]);
      this.message = msg.messages[0];
    }
    if (update.peer instanceof Api.PeerUser) {
      update.peer as Api.PeerUser;
      let msg = await SnakeClient.telegram.getMessages(update.peer.userId, [update.msgId]);
      this.message = msg.messages[0];
    }
    this.from = new From();
    await this.from.init(update.userId, SnakeClient);
    return this;
  }
}
