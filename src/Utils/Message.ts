// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../Client';
import { RestrictionReason } from './RestrictionReason';
import { BigInteger } from 'big-integer';
import { MessageAction } from './MessageAction';
import { Chat } from './Chat';
import { From } from './From';
import { MessageContext } from '../Context/MessageContext';
import Parser, { Entities } from '@tgsnake/parser';
import { ForwardMessage } from './ForwardMessage';
import { TypeMessageMedia, GenerateMedia } from './Medias';
import { Telegram } from '../Telegram';
import { convertReplyMarkup, TypeReplyMarkup } from './ReplyMarkup';
import { toString } from './ToBigInt';
import { Cleaning, betterConsoleLog } from './CleanObject';
import { Reactions } from './Reactions';
const parser = new Parser(Api);
export class Message {
  out?: boolean;
  mentioned?: boolean;
  mediaUnread?: boolean;
  silent?: boolean;
  post?: boolean;
  legacy?: boolean;
  id!: number;
  from!: From;
  chat!: Chat;
  replyToMessage?: MessageContext;
  date?: number | Date;
  action?: MessageAction;
  ttlPeriod?: number;
  fromScheduled?: boolean;
  editHide?: boolean;
  pinned?: boolean;
  fwdFrom?: ForwardMessage;
  viaBotId?: bigint;
  text?: string;
  media?: TypeMessageMedia;
  replyMarkup?: TypeReplyMarkup;
  entities?: Entities[];
  views?: number;
  forwards?: number;
  replies?: Api.TypeMessageReplies | number;
  editDate?: number;
  postAuthor?: string;
  mediaGroupId?: bigint;
  restrictionReason?: RestrictionReason[];
  noforward?: boolean;
  senderChat?: Chat;
  isAutomaticForward?: boolean;
  reactions?: Array<Reactions>;
  /** @hidden */
  private _SnakeClient!: Snake;
  constructor() {}
  async init(message: Api.MessageService | Api.Message, SnakeClient: Snake) {
    SnakeClient.log.debug(`Creating Message`);
    this._SnakeClient = SnakeClient;
    if (message instanceof Api.Message) {
      return await this.parseMessage(message as Api.Message);
    }
    if (message instanceof Api.MessageService) {
      return await this.parseMessageService(message as Api.MessageService);
    }
  }
  // only parse Message Service
  /** @hidden */
  private async parseMessageService(message: Api.MessageService) {
    this.out = message.out;
    this.mentioned = message.mentioned;
    this.mediaUnread = message.mediaUnread;
    this.silent = message.silent;
    this.legacy = message.legacy;
    this.id = message.id;
    this.date = message.date;
    this.post = message.post;
    //@ts-ignore
    this.noforward = message.noforwards;
    let messageAction = new MessageAction();
    await messageAction.init(message.action, this.SnakeClient);
    this.action = messageAction;
    this.ttlPeriod = message.ttlPeriod;
    if (message.fromId) {
      let from = new From();
      if (message.out) {
        await from.init(this.SnakeClient.aboutMe.id, this.SnakeClient);
      } else if (message.fromId instanceof Api.PeerChannel) {
        this.isAutomaticForward = false;
        this.senderChat = new Chat();
        await from.init('@Channel_Bot', this.SnakeClient);
        await this.senderChat.init(message.fromId, this.SnakeClient);
        if (message.fwdFrom) {
          if (message.fwdFrom.savedFromPeer) {
            this.isAutomaticForward = true;
          }
        }
      } else if (message.fromId instanceof Api.PeerChat) {
        await from.init('@GroupAnonymousBot', this.SnakeClient);
      } else if (message.fromId instanceof Api.PeerUser) {
        await from.init(message.fromId, this.SnakeClient);
      }
      this.from = from;
    } else {
      if (message.peerId) {
        let from = new From();
        if (message.out) {
          await from.init(this.SnakeClient.aboutMe.id, this.SnakeClient);
        } else if (message.peerId instanceof Api.PeerUser) {
          await from.init(message.peerId, this.SnakeClient);
        } else if (
          message.peerId instanceof Api.PeerChannel ||
          message.peerId instanceof Api.PeerChat
        ) {
          await from.init('@GroupAnonymousBot', this.SnakeClient);
          if (!this.senderChat) {
            this.senderChat = new Chat();
            await this.senderChat.init(message.peerId, this.SnakeClient);
          }
        }
        this.from = from;
      }
    }
    if (message.peerId) {
      let chat = new Chat();
      await chat.init(message.peerId, this.SnakeClient);
      this.chat = chat;
    } else {
      if (message.fromId) {
        let chat = new Chat();
        await chat.init(message.fromId, this.SnakeClient);
        this.chat = chat;
      }
    }
    if (message.replyTo) {
      this.SnakeClient.log.debug(`Creating replyToMessage`);
      let replyTo = await this.SnakeClient.telegram.getMessages(
        this.chat.id,
        [message.replyTo.replyToMsgId],
        false
      );
      this.replyToMessage = replyTo.messages[0];
    }
    await Cleaning(this);
    return this;
  }
  // only parse Message
  /** @hidden */
  private async parseMessage(message: Api.Message) {
    this.out = message.out;
    this.mentioned = message.mentioned;
    this.mediaUnread = message.mediaUnread;
    this.silent = message.silent;
    this.legacy = message.legacy;
    this.id = message.id;
    this.date = message.date;
    this.post = message.post;
    this.fromScheduled = message.fromScheduled;
    this.editHide = message.editHide;
    this.pinned = message.pinned;
    //@ts-ignore
    this.noforward = message.noforwards;
    this.viaBotId =
      message.viaBotId !== null || message.viaBotId !== undefined
        ? BigInt(toString(message.viaBotId!) as string)
        : BigInt(0);
    this.text = message.message;
    this.views = message.views;
    this.forwards = message.forwards;
    this.postAuthor = message.postAuthor;
    this.mediaGroupId = BigInt(String(message.groupedId ?? 0));
    this.ttlPeriod = message.ttlPeriod;
    this.editDate = message.editDate;
    if (message.fromId) {
      let from = new From();
      if (message.out) {
        await from.init(this.SnakeClient.aboutMe.id, this.SnakeClient);
      } else if (message.fromId instanceof Api.PeerChannel) {
        this.isAutomaticForward = false;
        this.senderChat = new Chat();
        await from.init('@Channel_Bot', this.SnakeClient);
        await this.senderChat.init(message.fromId, this.SnakeClient);
        if (message.fwdFrom) {
          if (message.fwdFrom.savedFromPeer) {
            this.isAutomaticForward = true;
          }
        }
      } else if (message.fromId instanceof Api.PeerChat) {
        await from.init('@GroupAnonymousBot', this.SnakeClient);
      } else if (message.fromId instanceof Api.PeerUser) {
        await from.init(message.fromId, this.SnakeClient);
      }
      this.from = from;
    } else {
      if (message.peerId) {
        let from = new From();
        if (message.out) {
          await from.init(this.SnakeClient.aboutMe.id, this.SnakeClient);
        } else if (message.peerId instanceof Api.PeerUser) {
          await from.init(message.peerId, this.SnakeClient);
        } else if (
          message.peerId instanceof Api.PeerChannel ||
          message.peerId instanceof Api.PeerChat
        ) {
          await from.init('@GroupAnonymousBot', this.SnakeClient);
          if (!this.senderChat) {
            this.senderChat = new Chat();
            await this.senderChat.init(message.peerId, this.SnakeClient);
          }
        }
        this.from = from;
      }
    }
    if (message.peerId) {
      let chat = new Chat();
      await chat.init(message.peerId, this.SnakeClient);
      this.chat = chat;
    } else {
      if (message.fromId) {
        let chat = new Chat();
        await chat.init(message.fromId, this.SnakeClient);
        this.chat = chat;
      }
    }
    if (message.media) {
      this.media = await GenerateMedia(message.media!, this._SnakeClient);
    }
    if (message.replyTo) {
      this.SnakeClient.log.debug(`Creating replyToMessage`);
      let replyTo = await this.SnakeClient.telegram.getMessages(
        this.chat.id,
        [message.replyTo.replyToMsgId],
        false
      );
      this.replyToMessage = replyTo.messages[0];
    }
    if (message.fwdFrom) {
      let forward = new ForwardMessage();
      await forward.init(message.fwdFrom, this.SnakeClient);
      this.fwdFrom = forward;
    }
    if (message.entities) {
      this.entities = parser.fromRaw(message.entities!);
    }
    if (message.restrictionReason) {
      let temp: RestrictionReason[] = [];
      for (let i = 0; i < message.restrictionReason.length; i++) {
        temp.push(new RestrictionReason(message.restrictionReason[i]));
      }
      this.restrictionReason = temp;
    }
    // todo
    // change the  replies json.
    if (message.replyMarkup) {
      this.replyMarkup = await convertReplyMarkup(message.replyMarkup, this.SnakeClient);
    }
    if (message.replies) {
      this.replies = message.replies;
    }
    if (message.reactions) {
      this.reactions = message.reactions.results.map((el) => new Reactions(el));
    }
    await Cleaning(this);
    return this;
  }
  get SnakeClient() {
    return this._SnakeClient;
  }
  get snakeClient() {
    return this._SnakeClient;
  }
  set SnakeClient(client: Snake) {
    this._SnakeClient = client;
  }
  set snakeClient(client: Snake) {
    this._SnakeClient = client;
  }
  get telegram() {
    return this._SnakeClient.telegram;
  }
}
