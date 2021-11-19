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
import { ReplyToMessageContext } from '../Context/ReplyToMessageContext';
import { Entities } from '../Utils/Entities';
import { ForwardMessage } from '../Utils/ForwardMessage';
import { From } from '../Utils/From';
import { Chat } from '../Utils/Chat';
import { MessageContext } from '../Context/MessageContext';
export class UpdateShortMessage extends Update {
  message!: MessageContext;
  constructor() {
    super();
    this['_'] = 'UpdateShortMessage';
  }
  async init(update: Api.UpdateShortMessage, SnakeClient: Snake) {
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
    this.message.viaBotId = update.viaBotId;
    this.message.telegram = this.telegram;
    this.message.SnakeClient = SnakeClient;
    if (update.userId) {
      let chat = new Chat();
      let from = new From();
      await chat.init(update.userId, SnakeClient);
      if (!update.out) {
        await from.init(update.userId, SnakeClient);
      } else {
        await from.init(SnakeClient.aboutMe.id, SnakeClient);
      }
      this.message.chat = chat;
      this.message.from = from;
    }
    if (update.replyTo) {
      let replyTo = new ReplyToMessageContext();
      await replyTo.init(update.replyTo, SnakeClient, this.message.chat.id);
      this.message.replyToMessage = replyTo;
    }
    if (update.fwdFrom) {
      let fwd = new ForwardMessage();
      await fwd.init(update.fwdFrom, SnakeClient);
      this.message.fwdFrom = fwd;
    }
    if (update.entities) {
      let temp: Entities[] = [];
      update.entities.forEach((item) => {
        temp.push(new Entities(item!));
      });
      this.message.entities = temp;
    }
    return this;
  }
}
