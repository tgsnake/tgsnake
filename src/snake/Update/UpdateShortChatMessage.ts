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
import { ReplyToMessageContext } from '../Context/ReplyToMessageContext';
import { Entities } from '../Utils/Entities';
import { ForwardMessage } from '../Utils/ForwardMessage';
import { From } from '../Utils/From';
import { Chat } from '../Utils/Chat';
export class UpdateShortChatMessage extends Update {
  out?: boolean;
  mentioned?: boolean;
  mediaUnread?: boolean;
  silent?: boolean;
  id!: number;
  from!: From;
  chat!: Chat;
  text!: string;
  date!: number;
  fwdFrom?: ForwardMessage;
  viaBotId?: number;
  replyToMessage?: ReplyToMessageContext;
  entities?: Entities[];
  ttlPeriod?: number;
  constructor() {
    super();
    this['_'] = 'UpdateShortChatMessage';
  }
  async init(update: Api.UpdateShortChatMessage, SnakeClient: Snake) {
    this.telegram = SnakeClient.telegram;
    this.out = update.out;
    this.mentioned = update.mentioned;
    this.mediaUnread = update.mediaUnread;
    this.silent = update.silent;
    this.id = update.id;
    this.text = update.message;
    this.date = update.date;
    this.viaBotId = update.viaBotId;
    this.ttlPeriod = update.ttlPeriod;
    if (update.fromId) {
      let from = new From();
      await from.init(update.fromId, SnakeClient);
      this.from = from;
    }
    if (update.chatId) {
      let chat = new Chat();
      await chat.init(update.chatId, SnakeClient);
      this.chat = chat;
    }
    if (update.fwdFrom) {
      let fwd = new ForwardMessage();
      await fwd.init(update.fwdFrom, SnakeClient);
      this.fwdFrom = fwd;
    }
    if (update.replyTo) {
      let replyTo = new ReplyToMessageContext();
      await replyTo.init(update.replyTo, SnakeClient, this.chat.id);
      this.replyToMessage = replyTo;
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
