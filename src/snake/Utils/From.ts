// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../client';
import { ChatPhoto } from './ChatPhoto';
import { RestrictionReason } from './RestrictionReason';
export class From {
  id!: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  status?: string;
  self?: boolean;
  deleted?: boolean;
  fake?: boolean;
  scam?: boolean;
  bot?: boolean;
  verified?: boolean;
  restricted?: boolean;
  dcId?: number;
  photo?: ChatPhoto;
  restrictionReason?: RestrictionReason[];
  constructor() {}
  async init(peer: Api.TypePeer | number, snakeClient: Snake) {
    if (typeof peer !== 'number') {
      if (peer instanceof Api.PeerUser) {
        peer as Api.PeerUser;
        this.id = peer.userId;
      }
      if (peer instanceof Api.PeerChat) {
        peer as Api.PeerChat;
        this.id = Number(`-${peer.chatId}`);
      }
      if (peer instanceof Api.PeerChannel) {
        peer as Api.PeerChannel;
        this.id = Number(`-100${peer.channelId}`);
      }
    } else {
      this.id = peer;
    }
    if (this.id) {
      let tg = snakeClient.telegram;
      let entity = await tg.getEntity(this.id);
      this.id = entity.id;
      this.username = entity.username;
      this.firstName = entity.firstName;
      this.lastName = entity.lastName;
      this.status = entity.status;
      this.self = entity.self;
      this.deleted = entity.deleted;
      this.fake = entity.fake;
      this.scam = entity.scam;
      this.bot = entity.bot;
      this.verified = entity.verified;
      this.restricted = entity.restricted;
      if (entity.dcId) {
        this.dcId = entity.dcId;
      }
      if (entity.photo) {
        this.photo = entity.photo;
      }
      if (entity.restrictionReason) {
        this.restrictionReason = entity.restrictionReason;
      }
    }
    return this;
  }
}
