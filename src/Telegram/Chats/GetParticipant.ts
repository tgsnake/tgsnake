// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Snake } from '../../client';
import { ResultGetEntity } from '../Users/GetEntity';
import { Api } from 'telegram';
import { AdminRights } from '../../Utils/AdminRights';
import { BannedRights } from '../../Utils/BannedRight';

type UserStatus = 'self' | 'creator' | 'admin' | 'banned' | 'left' | 'member' | 'restricted';
export class ChannelParticipant {
  user!: ResultGetEntity;
  status: UserStatus = 'left';
  adminRights?: AdminRights;
  bannedRights?: BannedRights;
  date: number = Math.floor(Date.now() / 1000);
  canEdit?: boolean;
  self?: boolean;
  inviter?: ResultGetEntity;
  promotedBy?: ResultGetEntity;
  rank?: string;
  kickedBy?: ResultGetEntity;
  constructor() {}
  async init(results: Api.channels.ChannelParticipant, snakeClient: Snake) {
    if (results.participant instanceof Api.ChannelParticipantCreator) {
      results.participant as Api.ChannelParticipantCreator;
      this.status = 'creator';
      this.adminRights = new AdminRights(results.participant.adminRights);
      if (results.users.length > 0) {
        for (let i = 0; i < results.users.length; i++) {
          if (results.users[i].id == results.participant.userId) {
            this.user = new ResultGetEntity(results.users[i]);
            break;
          }
        }
      } else {
        if (results.chats.length > 0) {
          for (let i = 0; i < results.chats.length; i++) {
            if (results.chats[i].id == results.participant.userId) {
              this.user = new ResultGetEntity(results.chats[i]);
              break;
            }
          }
        }
      }
      snakeClient.entityCache.set(this.user.id, this.user);
      return this;
    }
    if (results.participant instanceof Api.ChannelParticipantAdmin) {
      results.participant as Api.ChannelParticipantAdmin;
      this.status = 'admin';
      this.adminRights = new AdminRights(results.participant.adminRights);
      this.canEdit = results.participant.canEdit;
      this.self = results.participant.self;
      this.rank = results.participant.rank;
      if (results.users.length > 0) {
        for (let i = 0; i < results.users.length; i++) {
          if (results.users[i].id == results.participant.userId) {
            this.user = new ResultGetEntity(results.users[i]);
          }
          if (results.participant.inviterId) {
            if (results.users[i].id == results.participant.inviterId) {
              this.inviter = new ResultGetEntity(results.users[i]);
            }
          }
          if (results.participant.promotedBy) {
            if (results.users[i].id == results.participant.promotedBy) {
              this.promotedBy = new ResultGetEntity(results.users[i]);
            }
          }
        }
      } else {
        if (results.chats.length > 0) {
          for (let i = 0; i < results.chats.length; i++) {
            if (results.chats[i].id == results.participant.userId) {
              this.user = new ResultGetEntity(results.chats[i]);
            }
            if (results.participant.inviterId) {
              if (results.chats[i].id == results.participant.inviterId) {
                this.inviter = new ResultGetEntity(results.chats[i]);
              }
            }
            if (results.participant.promotedBy) {
              if (results.chats[i].id == results.participant.promotedBy) {
                this.promotedBy = new ResultGetEntity(results.chats[i]);
              }
            }
          }
        }
      }
      snakeClient.entityCache.set(this.user.id, this.user);
      if (this.inviter) {
        snakeClient.entityCache.set(this.inviter.id, this.inviter);
      }
      if (this.promotedBy) {
        snakeClient.entityCache.set(this.promotedBy.id, this.promotedBy);
      }
      return this;
    }
    if (results.participant instanceof Api.ChannelParticipantBanned) {
      results.participant as Api.ChannelParticipantBanned;
      this.status = 'banned';
      this.bannedRights = new BannedRights(results.participant.bannedRights);
      if (!results.participant.left) {
        this.status = 'restricted';
      }
      if (results.users.length > 0) {
        for (let i = 0; i < results.users.length; i++) {
          if (results.participant.peer instanceof Api.PeerUser) {
            results.participant.peer as Api.PeerUser;
            if (results.users[i].id == results.participant.peer.userId) {
              this.user = new ResultGetEntity(results.users[i]);
            }
          }
          if (results.participant.kickedBy) {
            if (results.users[i].id == results.participant.kickedBy) {
              this.kickedBy = new ResultGetEntity(results.users[i]);
            }
          }
        }
      } else {
        if (results.chats.length > 0) {
          for (let i = 0; i < results.chats.length; i++) {
            if (results.participant.peer instanceof Api.PeerUser) {
              results.participant.peer as Api.PeerUser;
              if (results.chats[i].id == results.participant.peer.userId) {
                this.user = new ResultGetEntity(results.chats[i]);
              }
            }
            if (results.participant.kickedBy) {
              if (results.chats[i].id == results.participant.kickedBy) {
                this.kickedBy = new ResultGetEntity(results.chats[i]);
              }
            }
          }
        }
      }
      snakeClient.entityCache.set(this.user.id, this.user);
      if (this.kickedBy) {
        snakeClient.entityCache.set(this.kickedBy.id, this.kickedBy);
      }
      return this;
    }
    if (results.participant instanceof Api.ChannelParticipantLeft) {
      results.participant as Api.ChannelParticipantLeft;
      this.status = 'left';
      if (results.users.length > 0) {
        for (let i = 0; i < results.users.length; i++) {
          if (results.participant.peer instanceof Api.PeerUser) {
            results.participant.peer as Api.PeerUser;
            if (results.users[i].id == results.participant.peer.userId) {
              this.user = new ResultGetEntity(results.users[i]);
            }
          }
        }
      } else {
        if (results.chats.length > 0) {
          for (let i = 0; i < results.chats.length; i++) {
            if (results.participant.peer instanceof Api.PeerUser) {
              results.participant.peer as Api.PeerUser;
              if (results.chats[i].id == results.participant.peer.userId) {
                this.user = new ResultGetEntity(results.chats[i]);
              }
            }
          }
        }
      }
      snakeClient.entityCache.set(this.user.id, this.user);
      return this;
    }
    if (results.participant instanceof Api.ChannelParticipantSelf) {
      results.participant as Api.ChannelParticipantSelf;
      this.status = 'self';
      if (results.users.length > 0) {
        for (let i = 0; i < results.users.length; i++) {
          if (results.users[i].id == results.participant.userId) {
            this.user = new ResultGetEntity(results.users[i]);
          }
          if (results.participant.inviterId) {
            if (results.users[i].id == results.participant.inviterId) {
              this.inviter = new ResultGetEntity(results.users[i]);
            }
          }
        }
      } else {
        if (results.chats.length > 0) {
          for (let i = 0; i < results.chats.length; i++) {
            if (results.chats[i].id == results.participant.userId) {
              this.user = new ResultGetEntity(results.chats[i]);
            }
            if (results.participant.inviterId) {
              if (results.chats[i].id == results.participant.inviterId) {
                this.inviter = new ResultGetEntity(results.chats[i]);
              }
            }
          }
        }
      }
      snakeClient.entityCache.set(this.user.id, this.user);
      if (this.inviter) {
        snakeClient.entityCache.set(this.inviter.id, this.inviter);
      }
      return this;
    }
    if (results.participant instanceof Api.ChannelParticipant) {
      results.participant as Api.ChannelParticipant;
      this.status = 'member';
      if (results.users.length > 0) {
        for (let i = 0; i < results.users.length; i++) {
          if (results.users[i].id == results.participant.userId) {
            this.user = new ResultGetEntity(results.users[i]);
          }
        }
      } else {
        if (results.chats.length > 0) {
          for (let i = 0; i < results.chats.length; i++) {
            if (results.chats[i].id == results.participant.userId) {
              this.user = new ResultGetEntity(results.chats[i]);
            }
          }
        }
      }
      snakeClient.entityCache.set(this.user.id, this.user);
      return this;
    }
  }
}
export async function GetParticipant(
  snakeClient: Snake,
  chatId: number | string,
  userId: number | string
) {
  try {
    let { client } = snakeClient;
    let result = await client.invoke(
      new Api.channels.GetParticipant({
        channel: chatId,
        participant: userId,
      })
    );
    let _results = new ChannelParticipant();
    await _results.init(result, snakeClient);
    return _results;
  } catch (error) {
    return snakeClient._handleError(error, `telegram.getParticipant(${chatId},${userId}})`);
  }
}
