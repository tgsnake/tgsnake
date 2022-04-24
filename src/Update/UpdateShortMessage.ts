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
import { ForwardMessage } from '../Utils/ForwardMessage';
import { From } from '../Utils/From';
import { Chat } from '../Utils/Chat';
import { MessageContext } from '../Context/MessageContext';
import { toString } from '../Utils/ToBigInt';
const parser = new Parser(Api);
export class UpdateShortMessage extends Update {
  message!: MessageContext;
  constructor() {
    super();
    this['_'] = 'updateShortMessage';
  }
  async init(update: Api.UpdateShortMessage, SnakeClient: Snake) {
    SnakeClient.log.debug(`Creating ${this['_']}`);
    this.message = new MessageContext();
    this.telegram = SnakeClient.telegram;
    this.message.out = update.out;
    this.message.mentioned = update.mentioned;
    this.message.mediaUnread = update.mediaUnread;
    this.message.silent = update.silent;
    this.message.id = update.id;
    this.message.text = update.message;
    this.message.date = update.date;
    this.message.ttlPeriod = update.ttlPeriod;
    this.message.viaBotId = BigInt(toString(update.viaBotId!) as string);
    this.message.SnakeClient = SnakeClient;
    if (update.userId) {
      let chat = new Chat();
      let from = new From();
      await chat.init(BigInt(toString(update.userId!) as string), SnakeClient);
      if (!update.out) {
        await from.init(BigInt(toString(update.userId!) as string), SnakeClient);
      } else {
        await from.init(SnakeClient.aboutMe.id, SnakeClient);
      }
      this.message.chat = chat;
      this.message.from = from;
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
    if (update.fwdFrom) {
      let fwd = new ForwardMessage();
      await fwd.init(update.fwdFrom, SnakeClient);
      this.message.fwdFrom = fwd;
    }
    if (update.entities) {
      this.message.entities = parser.fromRaw(update.entities);
    }
    return this;
  }
}
