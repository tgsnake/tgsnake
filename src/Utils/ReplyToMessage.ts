// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Snake } from '../Client';
import { MessageContext } from '../Context/MessageContext';
import { RestrictionReason } from './RestrictionReason';
import { BigInteger } from 'big-integer';
import { MessageAction } from './MessageAction';
import { Chat } from './Chat';
import { From } from './From';
import Parser, { Entities } from '@tgsnake/parser';
import { ForwardMessage } from './ForwardMessage';
import { Media } from './Media';
import { convertReplyMarkup, TypeReplyMarkup } from './ReplyMarkup';
import { Cleaning } from './CleanObject';
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
  viaBotId?: bigint;
  text?: string;
  media?: Media;
  replyMarkup?: TypeReplyMarkup;
  entities?: Entities[];
  views?: number;
  forwards?: number;
  replies?: Api.TypeMessageReplies | number;
  editDate?: number;
  postAuthor?: string;
  mediaGroupId?: BigInteger | number;
  restrictionReason?: RestrictionReason[];
  noforward?: boolean;
  senderChat?: Chat;
  isAutomaticForward?: boolean;
  constructor() {}
  async init(
    messageReplyHeader: Api.MessageReplyHeader,
    SnakeClient: Snake,
    chatId: number | bigint
  ) {
    _SnakeClient = SnakeClient;
    let mode = ['debug', 'info'];
    if (mode.includes(SnakeClient.logger)) {
      SnakeClient.log(
        `[${SnakeClient.connectTime}] - [${new Date().toLocaleString()}] - Creating replyToMessage`
      );
    }
    if (messageReplyHeader.replyToMsgId) {
      this.id = messageReplyHeader.replyToMsgId;
      let message = await this.SnakeClient.telegram.getMessages(chatId, [this.id], false);
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
        this.noforward = msg.noforward;
        this.senderChat = msg.senderChat;
        this.isAutomaticForward = msg.isAutomaticForward;
      }
      await Cleaning(this);
      return this;
    }
  }
  get SnakeClient() {
    return _SnakeClient;
  }
  get telegram() {
    return _SnakeClient.telegram;
  }
}
