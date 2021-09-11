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
export class UpdateShortMessage extends Update {
  out?: boolean;
  mentioned?: boolean;
  mediaUnread?: boolean;
  silent?: boolean;
  id!: number;
  text!: string;
  date!: number | Date;
  replyToMessage?: ReplyToMessageContext;
  entities?: Entities[];
  ttlPeriod?: number;
  viaBotId?: number;
  chat!: Chat;
  from!: From;
  fwdFrom?: ForwardMessage;
  constructor() {
    super();
    this['_'] = 'UpdateShortMessage';
  }
  async init(update: Api.UpdateShortMessage, SnakeClient: Snake) {
    this.telegram = SnakeClient.telegram;
    this.out = update.out;
    this.mentioned = update.mentioned;
    this.mediaUnread = update.mediaUnread;
    this.silent = update.silent;
    this.id = update.id;
    this.text = update.message;
    this.date = update.date;
    this.ttlPeriod = update.ttlPeriod;
    this.viaBotId = update.viaBotId;
    if (update.userId) {
      let chat = new Chat();
      let from = new From();
      await chat.init(update.userId, SnakeClient);
      await from.init(update.userId, SnakeClient);
      this.chat = chat;
      this.from = from;
    }
    if (update.replyTo) {
      let replyTo = new ReplyToMessageContext();
      await replyTo.init(update.replyTo, SnakeClient, this.chat.id);
      this.replyToMessage = replyTo;
    }
    if (update.fwdFrom) {
      let fwd = new ForwardMessage();
      await fwd.init(update.fwdFrom, SnakeClient);
      this.fwdFrom = fwd;
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
