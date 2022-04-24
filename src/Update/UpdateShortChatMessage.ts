// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
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
import { ForwardMessage } from '../Utils/ForwardMessage';
import { From } from '../Utils/From';
import { Chat } from '../Utils/Chat';
import { MessageContext } from '../Context/MessageContext';
import { toString } from '../Utils/ToBigInt';
const parser = new Parser(Api);
export class UpdateShortChatMessage extends Update {
  message!: MessageContext;
  constructor() {
    super();
    this['_'] = 'updateShortChatMessage';
  }
  async init(update: Api.UpdateShortChatMessage, SnakeClient: Snake) {
    SnakeClient.log.debug(`Creating ${this['_']}`);
    this.telegram = SnakeClient.telegram;
    this.message = new MessageContext();
    this.message.out = update.out;
    this.message.mentioned = update.mentioned;
    this.message.mediaUnread = update.mediaUnread;
    this.message.silent = update.silent;
    this.message.id = update.id;
    this.message.text = update.message;
    this.message.date = update.date;
    this.message.viaBotId = BigInt(toString(update.viaBotId!) as string);
    this.message.ttlPeriod = update.ttlPeriod;
    this.message.SnakeClient = SnakeClient;
    if (update.fromId) {
      let from = new From();
      if (!update.out) {
        await from.init(BigInt(toString(update.fromId!) as string), SnakeClient);
      } else {
        await from.init(SnakeClient.aboutMe.id, SnakeClient);
      }
      this.message.from = from;
    }
    if (update.chatId) {
      let chat = new Chat();
      await chat.init(BigInt(toString(update.chatId!) as string), SnakeClient);
      this.message.chat = chat;
    }
    if (update.fwdFrom) {
      let fwd = new ForwardMessage();
      await fwd.init(update.fwdFrom, SnakeClient);
      this.message.fwdFrom = fwd;
    }
    if (update.replyTo) {
      this.SnakeClient.log.debug(`Creating replyToMessage`);
      let replyTo = await this.SnakeClient.telegram.getMessages(
        this.message.chat.id,
        [update.replyTo.replyToMsgId],
        false
      );
      this.message.replyToMessage = replyTo.messages[0];
    }
    if (update.entities) {
      this.message.entities = parser.fromRaw(update.entities!);
    }
    return this;
  }
}
