// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { BannedRights } from './BannedRight';
import { ChatPhoto } from './ChatPhoto';
import { Snake } from '../client';
import { Api } from 'telegram';
export class Chat {
  id!: number;
  title?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  private?: boolean;
  photo?: ChatPhoto;
  defaultBannedRights?: BannedRights;
  participantsCount?: number;
  dcId?: number;
  fake: boolean = false;
  scam: boolean = false;
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
      if (entity.username) {
        this.username = entity.username!;
      }
      if (entity.firstName) {
        this.firstName = entity.firstName!;
      }
      if (entity.lastName) {
        this.lastName = entity.lastName!;
      }
      if (entity.title) {
        this.title = entity.title!;
      }
      if (entity.photo) {
        this.photo = entity.photo!;
      }
      if (entity.defaultBannedRights) {
        this.defaultBannedRights = entity.defaultBannedRights;
      }
      if (entity.participantsCount) {
        this.participantsCount = entity.participantsCount;
      }
      if (entity.dcId) {
        this.dcId = entity.dcId;
      }
      if (entity.fake) {
        this.fake = entity.fake;
      }
      if (entity.scam) {
        this.scam = entity.scam;
      }
      this.private = Boolean(entity.type === 'user');
    }
    return this;
  }
}
