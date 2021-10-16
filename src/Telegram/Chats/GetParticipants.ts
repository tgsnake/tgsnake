// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Snake } from '../../client';
import { Api } from 'telegram';
import { ResultGetEntity } from '../Users/GetEntity';
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
  async init(
    results: Api.channels.ChannelParticipants,
    _participant: Api.TypeChannelParticipant,
    snakeClient: Snake
  ) {
    if (_participant instanceof Api.ChannelParticipantCreator) {
      _participant as Api.ChannelParticipantCreator;
      this.status = 'creator';
      this.adminRights = new AdminRights(_participant.adminRights);
      if (results.users.length > 0) {
        for (let i = 0; i < results.users.length; i++) {
          if (results.users[i].id == _participant.userId) {
            this.user = new ResultGetEntity(results.users[i]);
            break;
          }
        }
      } else {
        if (results.chats.length > 0) {
          for (let i = 0; i < results.chats.length; i++) {
            if (results.chats[i].id == _participant.userId) {
              this.user = new ResultGetEntity(results.chats[i]);
              break;
            }
          }
        }
      }
      snakeClient.entityCache.set(this.user.id, this.user);
      return this;
    }
    if (_participant instanceof Api.ChannelParticipantAdmin) {
      _participant as Api.ChannelParticipantAdmin;
      this.status = 'admin';
      this.adminRights = new AdminRights(_participant.adminRights);
      this.canEdit = _participant.canEdit;
      this.self = _participant.self;
      this.rank = _participant.rank;
      if (results.users.length > 0) {
        for (let i = 0; i < results.users.length; i++) {
          if (results.users[i].id == _participant.userId) {
            this.user = new ResultGetEntity(results.users[i]);
          }
          if (_participant.inviterId) {
            if (results.users[i].id == _participant.inviterId) {
              this.inviter = new ResultGetEntity(results.users[i]);
            }
          }
          if (_participant.promotedBy) {
            if (results.users[i].id == _participant.promotedBy) {
              this.promotedBy = new ResultGetEntity(results.users[i]);
            }
          }
        }
      } else {
        if (results.chats.length > 0) {
          for (let i = 0; i < results.chats.length; i++) {
            if (results.chats[i].id == _participant.userId) {
              this.user = new ResultGetEntity(results.chats[i]);
            }
            if (_participant.inviterId) {
              if (results.chats[i].id == _participant.inviterId) {
                this.inviter = new ResultGetEntity(results.chats[i]);
              }
            }
            if (_participant.promotedBy) {
              if (results.chats[i].id == _participant.promotedBy) {
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
    if (_participant instanceof Api.ChannelParticipantBanned) {
      _participant as Api.ChannelParticipantBanned;
      this.status = 'banned';
      this.bannedRights = new BannedRights(_participant.bannedRights);
      if (!_participant.left) {
        this.status = 'restricted';
      }
      if (results.users.length > 0) {
        for (let i = 0; i < results.users.length; i++) {
          if (_participant.peer instanceof Api.PeerUser) {
            _participant.peer as Api.PeerUser;
            if (results.users[i].id == _participant.peer.userId) {
              this.user = new ResultGetEntity(results.users[i]);
            }
          }
          if (_participant.kickedBy) {
            if (results.users[i].id == _participant.kickedBy) {
              this.kickedBy = new ResultGetEntity(results.users[i]);
            }
          }
        }
      } else {
        if (results.chats.length > 0) {
          for (let i = 0; i < results.chats.length; i++) {
            if (_participant.peer instanceof Api.PeerUser) {
              _participant.peer as Api.PeerUser;
              if (results.chats[i].id == _participant.peer.userId) {
                this.user = new ResultGetEntity(results.chats[i]);
              }
            }
            if (_participant.kickedBy) {
              if (results.chats[i].id == _participant.kickedBy) {
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
    if (_participant instanceof Api.ChannelParticipantLeft) {
      _participant as Api.ChannelParticipantLeft;
      this.status = 'left';
      if (results.users.length > 0) {
        for (let i = 0; i < results.users.length; i++) {
          if (_participant.peer instanceof Api.PeerUser) {
            _participant.peer as Api.PeerUser;
            if (results.users[i].id == _participant.peer.userId) {
              this.user = new ResultGetEntity(results.users[i]);
            }
          }
        }
      } else {
        if (results.chats.length > 0) {
          for (let i = 0; i < results.chats.length; i++) {
            if (_participant.peer instanceof Api.PeerUser) {
              _participant.peer as Api.PeerUser;
              if (results.chats[i].id == _participant.peer.userId) {
                this.user = new ResultGetEntity(results.chats[i]);
              }
            }
          }
        }
      }
      snakeClient.entityCache.set(this.user.id, this.user);
      return this;
    }
    if (_participant instanceof Api.ChannelParticipantSelf) {
      _participant as Api.ChannelParticipantSelf;
      this.status = 'self';
      if (results.users.length > 0) {
        for (let i = 0; i < results.users.length; i++) {
          if (results.users[i].id == _participant.userId) {
            this.user = new ResultGetEntity(results.users[i]);
          }
          if (_participant.inviterId) {
            if (results.users[i].id == _participant.inviterId) {
              this.inviter = new ResultGetEntity(results.users[i]);
            }
          }
        }
      } else {
        if (results.chats.length > 0) {
          for (let i = 0; i < results.chats.length; i++) {
            if (results.chats[i].id == _participant.userId) {
              this.user = new ResultGetEntity(results.chats[i]);
            }
            if (_participant.inviterId) {
              if (results.chats[i].id == _participant.inviterId) {
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
    if (_participant instanceof Api.ChannelParticipant) {
      _participant as Api.ChannelParticipant;
      this.status = 'member';
      if (results.users.length > 0) {
        for (let i = 0; i < results.users.length; i++) {
          if (results.users[i].id == _participant.userId) {
            this.user = new ResultGetEntity(results.users[i]);
          }
        }
      } else {
        if (results.chats.length > 0) {
          for (let i = 0; i < results.chats.length; i++) {
            if (results.chats[i].id == _participant.userId) {
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

export interface GetParticipantMoreParams {
  offset?: number;
  limit?: number;
  query?: string;
  filter?: 'all' | 'kicked' | 'restricted' | 'bots' | 'recents' | 'administrators';
}
let defaultOptions: GetParticipantMoreParams = {
  offset: 0,
  limit: 200,
  query: '',
  filter: 'all',
};
export async function GetParticipants(
  snakeClient: Snake,
  chatId: number | string,
  more: GetParticipantMoreParams = defaultOptions
) {
  try {
    let chat: ResultGetEntity = await snakeClient.telegram.getEntity(chatId, true);
    if (chat.type == 'user') {
      throw new Error('Typeof chatId must be channel or chat, not a user.');
    }
    if (chat.type == 'chat') {
      let r: Api.messages.ChatFull = await snakeClient.client.invoke(
        new Api.messages.GetFullChat({
          chatId: chat.id,
        })
      );
      let cf: Api.ChatFull = r.fullChat as Api.ChatFull;
      let part: Api.ChatParticipants = cf.participants as Api.ChatParticipants;
      let participants: Api.TypeChatParticipant[] = part.participants;
      let final: ResultGetEntity[] = [];
      for (let i = 0; i < participants.length; i++) {
        let participant = participants[i];
        if (r.users.length > 0) {
          for (let j = 0; j < r.users.length; j++) {
            let user: Api.User = r.users[j] as Api.User;
            if (user.id == participant.userId) {
              final.push(new ResultGetEntity(user));
            }
          }
        } else {
          if (r.chats.length > 0) {
            for (let j = 0; j < r.chats.length; j++) {
              let chat: Api.Chat = r.chats[j] as Api.Chat;
              if (chat.id == participant.userId) {
                final.push(new ResultGetEntity(chat));
              }
            }
          }
        }
      }
      return final;
    }
    if (chat.type == 'channel') {
      let filter: Api.TypeChannelParticipantsFilter = new Api.ChannelParticipantsSearch({
        q: more.query || '',
      });
      switch (more.filter) {
        case 'kicked':
          filter = new Api.ChannelParticipantsKicked({ q: more.query || '' });
          break;
        case 'restricted':
          filter = new Api.ChannelParticipantsBanned({ q: more.query || '' });
          break;
        case 'bots':
          filter = new Api.ChannelParticipantsBots();
          break;
        case 'recents':
          filter = new Api.ChannelParticipantsRecent();
          break;
        case 'administrators':
          filter = new Api.ChannelParticipantsAdmins();
          break;
        default:
      }
      let r: Api.channels.ChannelParticipants = (await snakeClient.client.invoke(
        new Api.channels.GetParticipants({
          channel: chat.id,
          filter: filter,
          offset: more.offset,
          limit: more.limit,
          hash: 0,
        })
      )) as Api.channels.ChannelParticipants;
      let final: ChannelParticipant[] = [];
      for (let i = 0; i < r.participants.length; i++) {
        let c = new ChannelParticipant();
        await c.init(r, r.participants[i], snakeClient);
        final.push(c);
      }
      return final;
    }
  } catch (error) {
    return snakeClient._handleError(
      error,
      `telegram.getParticipants(${chatId},${JSON.stringify(more)})`
    );
  }
}
