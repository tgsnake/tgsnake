// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Chat } from './Chat';
import { From } from './From';
import { Snake } from '../client';
import { Cleaning } from './CleanObject';
export class ForwardMessage {
  imported?: boolean;
  from!: From;
  fromName?: string;
  date!: number | Date;
  channelPost?: number;
  postAuthor?: string;
  savedFromChat?: Chat;
  savedFromMsgId?: number;
  psaType?: string;
  constructor() {}
  async init(forwardHeader: Api.MessageFwdHeader, snakeClient: Snake) {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      console.log(
        '\x1b[31m',
        `[${snakeClient.connectTime}] - [${new Date().toLocaleString()}] - Creating forwardMessage`,
        '\x1b[0m'
      );
    }
    this.imported = forwardHeader.imported;
    this.fromName = forwardHeader.fromName;
    this.date = forwardHeader.date;
    this.channelPost = forwardHeader.channelPost;
    this.postAuthor = forwardHeader.postAuthor;
    this.savedFromMsgId = forwardHeader.savedFromMsgId;
    this.psaType = forwardHeader.psaType;
    if (forwardHeader.fromId) {
      let from = new From();
      await from.init(forwardHeader.fromId, snakeClient);
      this.from = from;
    }
    if (forwardHeader.savedFromPeer) {
      let chat = new Chat();
      await chat.init(forwardHeader.savedFromPeer, snakeClient);
      this.savedFromChat = chat;
    }
    await Cleaning(this);
    return this;
  }
}
