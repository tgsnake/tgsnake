// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Snake } from '../client';
import { MessageContext } from '../Context/MessageContext';
import { RestrictionReason } from './RestrictionReason';
import { BigInteger } from 'big-integer';
import { MessageAction } from './MessageAction';
import { Chat } from './Chat';
import { From } from './From';
import { Entities } from './Entities';
import { ForwardMessage } from './ForwardMessage';
import { Media } from './Media'; 
let _SnakeClient: Snake;
export class ReplyToMessage {
  out?: boolean;
  mentioned?: boolean;
  mediaUnread?: boolean;
  silent?: boolean;
  post?: boolean;
  legacy?: boolean;
  id!: number;
  from?: From;
  chat!: Chat;
  date?: number | Date;
  action?: MessageAction;
  ttlPeriod?: number;
  fromScheduled?: boolean;
  editHide?: boolean;
  pinned?: boolean;
  fwdFrom?: ForwardMessage;
  viaBotId?: number;
  text?: string;
  media?: Media;
  replyMarkup?: Api.TypeReplyMarkup;
  entities?: Entities[];
  views?: number;
  forwards?: number;
  replies?: Api.TypeMessageReplies | number;
  editDate?: number;
  postAuthor?: string;
  mediaGroupId?: BigInteger | number;
  restrictionReason?: RestrictionReason[];
  constructor() {}
  async init(messageReplyHeader: Api.MessageReplyHeader, SnakeClient: Snake, chatId: number) {
    _SnakeClient = SnakeClient;
    if (messageReplyHeader.replyToMsgId) {
      this.id = messageReplyHeader.replyToMsgId;
      let message = await this.SnakeClient.telegram.getMessages(chatId, [this.id]);
      if (message.messages[0]) {
        let msg = message.messages[0] as MessageContext;
        this.out = msg.out;
        this.mentioned = msg.mentioned;
        this.mediaUnread = msg.mediaUnread;
        this.silent = msg.silent;
        this.post = msg.post;
        this.legacy = msg.legacy;
        this.from = msg.from;
        this.chat = msg.chat;
        this.date = msg.date;
        this.action = msg.action;
        this.ttlPeriod = msg.ttlPeriod;
        this.fromScheduled = msg.fromScheduled;
        this.editHide = msg.editHide;
        this.pinned = msg.pinned;
        this.fwdFrom = msg.fwdFrom;
        this.viaBotId = msg.viaBotId;
        this.text = msg.text;
        this.media = msg.media;
        this.replyMarkup = msg.replyMarkup;
        this.entities = msg.entities;
        this.views = msg.views;
        this.forwards = msg.forwards;
        this.replies = msg.replies;
        this.editDate = msg.editDate;
        this.postAuthor = msg.postAuthor;
        this.mediaGroupId = msg.mediaGroupId;
        this.restrictionReason = msg.restrictionReason;
      }
      return this;
    }
  } 
  get SnakeClient(){
    return _SnakeClient
  } 
  get telegram(){
    return _SnakeClient.telegram
  }
}
