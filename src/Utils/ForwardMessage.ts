// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Chat } from './Chat';
import { From } from './From';
import { Snake } from '../Client';
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
    snakeClient.log.debug(`Creating forwardMessage`);
    this.imported = forwardHeader.imported;
    this.fromName = forwardHeader.fromName;
    this.date = forwardHeader.date;
    this.channelPost = forwardHeader.channelPost;
    this.postAuthor = forwardHeader.postAuthor;
    this.savedFromMsgId = forwardHeader.savedFromMsgId;
    this.psaType = forwardHeader.psaType;
    if (forwardHeader.fromId) {
      try {
        let from = new From();
        await from.init(forwardHeader.fromId, snakeClient);
        this.from = from;
      } catch (error) {}
    }
    if (forwardHeader.savedFromPeer) {
      try {
        let chat = new Chat();
        await chat.init(forwardHeader.savedFromPeer, snakeClient);
        this.savedFromChat = chat;
      } catch (error) {}
    }
    await Cleaning(this);
    return this;
  }
}
