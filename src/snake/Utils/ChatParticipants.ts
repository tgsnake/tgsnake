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

export class ChatParticipant {
  user!: From;
  inviter!: From;
  date!: number;
  constructor() {}
  async init(participant: Api.ChatParticipant, SnakeClient: Snake) {
    this.date = participant.date;
    if (participant.userId) {
      let user = new From();
      await user.init(participant.userId, SnakeClient);
      this.user = user;
    }
    if (participant.inviterId) {
      let inviter = new From();
      await inviter.init(participant.inviterId, SnakeClient);
      this.inviter = inviter;
    }
    return this;
  }
}
export class ChatParticipantCreator {
  user!: From;
  constructor() {}
  async init(participant: Api.ChatParticipantCreator, SnakeClient: Snake) {
    if (participant.userId) {
      let user = new From();
      await user.init(participant.userId, SnakeClient);
      this.user = user;
    }
    return this;
  }
}
export class ChatParticipantAdmin {
  user!: From;
  inviter!: From;
  date!: number;
  constructor() {}
  async init(participant: Api.ChatParticipantAdmin, SnakeClient: Snake) {
    this.date = participant.date;
    if (participant.userId) {
      let user = new From();
      await user.init(participant.userId, SnakeClient);
      this.user = user;
    }
    if (participant.inviterId) {
      let inviter = new From();
      await inviter.init(participant.inviterId, SnakeClient);
      this.inviter = inviter;
    }
    return this;
  }
}
export type TypeChatParticipant = ChatParticipant | ChatParticipantAdmin | ChatParticipantCreator;
export class ChatParticipantsForbidden {
  chat!: Chat;
  selfParticipant?: TypeChatParticipant;
  constructor() {}
  async init(participant: Api.ChatParticipantsForbidden, SnakeClient: Snake) {
    if (participant.chatId) {
      let chat = new Chat();
      await chat.init(participant.chatId, SnakeClient);
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
  constructor() {}
  async init(participant: Api.ChatParticipants, SnakeClient: Snake) {
    this.version = participant.version;
    if (participant.chatId) {
      let chat = new Chat();
      await chat.init(participant.chatId, SnakeClient);
      this.chat = chat;
    }
    if (participant.participants) {
      let participants = participant.participants;
      let temp: TypeChatParticipant[] = [];
      participants.forEach(async (item) => {
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
      });
      this.participants = temp;
    }
    return this;
  }
}
export type TypeChatParticipants = ChatParticipants | ChatParticipantsForbidden;
