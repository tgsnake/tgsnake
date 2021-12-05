// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../client';
import { From } from './From';
import { Chat } from './Chat';
import { AdminRights } from './AdminRights';
import { BannedRights } from './BannedRight';
import { ResultGetEntity } from '../Telegram/Users/GetEntity';
import { toNumber } from './ToBigInt';
export type UserStatus = 'self' | 'creator' | 'admin' | 'banned' | 'left' | 'member' | 'restricted';
export class ChannelParticipant {
  user!: From;
  status!: UserStatus;
  adminRights?: AdminRights;
  bannedRights?: BannedRights;
  date: number = Math.floor(Date.now() / 1000);
  canEdit?: boolean;
  self?: boolean;
  inviter?: From;
  promotedBy?: From;
  rank?: string;
  kickedBy?: From;
  constructor() {}
  async init(participant: Api.TypeChannelParticipant, SnakeClient: Snake) {
    if (participant instanceof Api.ChannelParticipantCreator) {
      participant as Api.ChannelParticipantCreator;
      this.status = 'creator';
      this.adminRights = new AdminRights(participant.adminRights);
      this.user = new From();
      await this.user.init(BigInt(toNumber(participant.userId) as number), SnakeClient);
      return this;
    }
    if (participant instanceof Api.ChannelParticipantAdmin) {
      participant as Api.ChannelParticipantAdmin;
      this.status = 'admin';
      this.adminRights = new AdminRights(participant.adminRights);
      this.canEdit = participant.canEdit;
      this.self = participant.self;
      this.rank = participant.rank;
      this.user = new From();
      await this.user.init(BigInt(toNumber(participant.userId) as number), SnakeClient);
      if (participant.inviterId) {
        this.inviter = new From();
        await this.inviter.init(BigInt(toNumber(participant.inviterId) as number), SnakeClient);
      }
      if (participant.promotedBy) {
        this.promotedBy = new From();
        await this.promotedBy.init(BigInt(toNumber(participant.promotedBy) as number), SnakeClient);
      }
      return this;
    }
    if (participant instanceof Api.ChannelParticipantBanned) {
      participant as Api.ChannelParticipantBanned;
      this.status = 'banned';
      this.bannedRights = new BannedRights(participant.bannedRights);
      if (!participant.left) {
        this.status = 'restricted';
      }
      this.user = new From();
      //@ts-ignore
      await this.user.init(BigInt(toNumber(participant.peer.userId!) as number), SnakeClient);
      if (participant.kickedBy) {
        this.kickedBy = new From();
        await this.kickedBy.init(BigInt(toNumber(participant.kickedBy) as number), SnakeClient);
      }
      return this;
    }
    if (participant instanceof Api.ChannelParticipantLeft) {
      participant as Api.ChannelParticipantLeft;
      this.status = 'left';
      this.user = new From();
      //@ts-ignore
      await this.user.init(BigInt(toNumber(participant.peer.userId) as number), SnakeClient);
      return this;
    }
    if (participant instanceof Api.ChannelParticipantSelf) {
      participant as Api.ChannelParticipantSelf;
      this.status = 'self';
      this.user = new From();
      await this.user.init(BigInt(toNumber(participant.userId) as number), SnakeClient);
      if (participant.inviterId) {
        this.inviter = new From();
        await this.inviter.init(BigInt(toNumber(participant.inviterId) as number), SnakeClient);
      }
      return this;
    }
    if (participant instanceof Api.ChannelParticipant) {
      participant as Api.ChannelParticipant;
      this.status = 'member';
      this.user = new From();
      await this.user.init(BigInt(toNumber(participant.userId) as number), SnakeClient);
      return this;
    }
  }
}
export class ChatParticipant {
  user!: From;
  inviter!: From;
  date!: number;
  status: string = 'member';
  constructor() {}
  async init(participant: Api.ChatParticipant, SnakeClient: Snake) {
    this.date = participant.date;
    if (participant.userId) {
      let user = new From();
      await user.init(BigInt(toNumber(participant.userId) as number), SnakeClient);
      this.user = user;
    }
    if (participant.inviterId) {
      let inviter = new From();
      await inviter.init(BigInt(toNumber(participant.inviterId) as number), SnakeClient);
      this.inviter = inviter;
    }
    return this;
  }
}
export class ChatParticipantCreator {
  user!: From;
  status: string = 'creator';
  constructor() {}
  async init(participant: Api.ChatParticipantCreator, SnakeClient: Snake) {
    if (participant.userId) {
      let user = new From();
      await user.init(BigInt(toNumber(participant.userId) as number), SnakeClient);
      this.user = user;
    }
    return this;
  }
}
export class ChatParticipantAdmin {
  user!: From;
  inviter!: From;
  date!: number;
  status: string = 'admin';
  constructor() {}
  async init(participant: Api.ChatParticipantAdmin, SnakeClient: Snake) {
    this.date = participant.date;
    if (participant.userId) {
      let user = new From();
      await user.init(BigInt(toNumber(participant.userId) as number), SnakeClient);
      this.user = user;
    }
    if (participant.inviterId) {
      let inviter = new From();
      await inviter.init(BigInt(toNumber(participant.inviterId) as number), SnakeClient);
      this.inviter = inviter;
    }
    return this;
  }
}
export type TypeChatParticipant =
  | ChatParticipant
  | ChatParticipantAdmin
  | ChatParticipantCreator
  | ChannelParticipant;
export class ChatParticipantsForbidden {
  chat!: Chat;
  selfParticipant?: TypeChatParticipant;
  status: string = 'forbidden';
  constructor() {}
  async init(participant: Api.ChatParticipantsForbidden, SnakeClient: Snake) {
    if (participant.chatId) {
      let chat = new Chat();
      await chat.init(BigInt(toNumber(participant.chatId) as number), SnakeClient);
      this.chat = chat;
    }
    if (participant.selfParticipant) {
      if (participant.selfParticipant instanceof Api.ChatParticipant) {
        let selfParticipant = new ChatParticipant();
        await selfParticipant.init(participant.selfParticipant as Api.ChatParticipant, SnakeClient);
        this.selfParticipant = selfParticipant;
      }
      if (participant.selfParticipant instanceof Api.ChatParticipantCreator) {
        let selfParticipant = new ChatParticipantCreator();
        await selfParticipant.init(
          participant.selfParticipant as Api.ChatParticipantCreator,
          SnakeClient
        );
        this.selfParticipant = selfParticipant;
      }
      if (participant.selfParticipant instanceof Api.ChatParticipantAdmin) {
        let selfParticipant = new ChatParticipantAdmin();
        await selfParticipant.init(
          participant.selfParticipant as Api.ChatParticipantAdmin,
          SnakeClient
        );
        this.selfParticipant = selfParticipant;
      }
    }
    return this;
  }
}
export class ChatParticipants {
  chat!: Chat;
  participants!: TypeChatParticipant[];
  version!: number;
  count!: number;
  constructor() {}
  async init(
    participant:
      | Api.ChatParticipants
      | Api.channels.ChannelParticipants
      | Api.channels.ChannelParticipant,
    SnakeClient: Snake
  ) {
    let mode = ['debug', 'info'];
    if (mode.includes(SnakeClient.logger)) {
      SnakeClient.log(
        `[${
          SnakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Creating ChatParticipants`
      );
    }
    if (participant instanceof Api.ChatParticipants) {
      return await this._ChatParticipants(participant as Api.ChatParticipants, SnakeClient);
    }
    if (participant instanceof Api.channels.ChannelParticipants) {
      return await this._ChannelParticipants(
        participant as Api.channels.ChannelParticipants,
        SnakeClient
      );
    }
    if (participant instanceof Api.channels.ChannelParticipant) {
      return await this._ChannelParticipant(
        participant as Api.channels.ChannelParticipant,
        SnakeClient
      );
    }
  }
  private async _ChatParticipants(participant: Api.ChatParticipants, SnakeClient: Snake) {
    this.version = participant.version;
    if (participant.chatId) {
      let chat = new Chat();
      await chat.init(BigInt(toNumber(participant.chatId) as number), SnakeClient);
      this.chat = chat;
    }
    if (participant.participants) {
      let participants = participant.participants;
      let temp: TypeChatParticipant[] = [];
      this.count = participants.length;
      let i = 0;
      while (true) {
        let item = participants[i];
        if (item instanceof Api.ChatParticipant) {
          let selfParticipant = new ChatParticipant();
          await selfParticipant.init(item as Api.ChatParticipant, SnakeClient);
          temp.push(selfParticipant);
        }
        if (item instanceof Api.ChatParticipantCreator) {
          let selfParticipant = new ChatParticipantCreator();
          await selfParticipant.init(item as Api.ChatParticipantCreator, SnakeClient);
          temp.push(selfParticipant);
        }
        if (item instanceof Api.ChatParticipantAdmin) {
          let selfParticipant = new ChatParticipantAdmin();
          await selfParticipant.init(item as Api.ChatParticipantAdmin, SnakeClient);
          temp.push(selfParticipant);
        }
        if (temp.length >= participants.length) {
          this.participants = temp;
          return this;
        }
        i++;
      }
    }
    return this;
  }
  private async _ChannelParticipants(
    participant: Api.channels.ChannelParticipants,
    SnakeClient: Snake
  ) {
    //@ts-ignore
    this.count = participant.count || participant.participants.length;
    let participants: Api.TypeChannelParticipant[] = participant.participants;
    let temp: ChannelParticipant[] = [];
    //@ts-ignore
    participant.users.map((item: Api.User) => {
      let entity = new ResultGetEntity(item);
      SnakeClient.entityCache.set(entity.id, entity);
    });
    //@ts-ignore
    participant.chats.map((item: Api.TypeChat) => {
      if (item instanceof Api.Chat) {
        item as Api.Chat;
      } else {
        item as Api.Channel;
      }
      let entity = new ResultGetEntity(item);
      SnakeClient.entityCache.set(entity.id, entity);
    });
    let i = 0;
    while (true) {
      let item: Api.TypeChannelParticipant = participants[i];
      let channelPart = new ChannelParticipant();
      await channelPart.init(item, SnakeClient);
      temp.push(channelPart);
      if (temp.length >= participants.length) {
        this.participants = temp;
        return this;
      }
      i++;
    }
  }
  private async _ChannelParticipant(
    participant: Api.channels.ChannelParticipant,
    SnakeClient: Snake
  ) {
    //@ts-ignore
    this.count = participant.count || participant.participants?.length || 1;
    let participants: Api.TypeChannelParticipant = participant.participant;
    let temp: ChannelParticipant[] = [];
    //@ts-ignore
    participant.users.map((item: Api.User) => {
      let entity = new ResultGetEntity(item);
      SnakeClient.entityCache.set(entity.id, entity);
    });
    //@ts-ignore
    participant.chats.map((item: Api.TypeChat) => {
      if (item instanceof Api.Chat) {
        item as Api.Chat;
      } else {
        item as Api.Channel;
      }
      let entity = new ResultGetEntity(item);
      SnakeClient.entityCache.set(entity.id, entity);
    });
    let channelPart = new ChannelParticipant();
    await channelPart.init(participants, SnakeClient);
    temp.push(channelPart);
    this.participants = temp;
    return this;
  }
}
export type TypeChatParticipants = ChatParticipants | ChatParticipantsForbidden;
