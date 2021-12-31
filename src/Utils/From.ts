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
import { ResultGetEntity } from '../Telegram/Users/GetEntity';
import { RestrictionReason } from './RestrictionReason';
import { toBigInt, toString } from './ToBigInt';
import bigInt, { BigInteger, isInstance } from 'big-integer';
import { Cleaning } from './CleanObject';
export class From {
  id!: bigint;
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
  async init(peer: Api.TypePeer | number | bigint, snakeClient: Snake) {
    if (typeof peer !== 'number' && typeof peer !== 'bigint') {
      if (peer instanceof Api.PeerUser) {
        peer as Api.PeerUser;
        if (isInstance(peer.userId)) {
          //@ts-ignore
          this.id = BigInt(toString(peer.userId));
        } else {
          //@ts-ignore
          this.id = BigInt(peer.userId);
        }
      }
      if (peer instanceof Api.PeerChat) {
        peer as Api.PeerChat;
        if (isInstance(peer.chatId)) {
          //@ts-ignore
          this.id = BigInt(Number(`-${toString(peer.chatId)}`));
        } else {
          //@ts-ignore
          this.id = BigInt(Number(`-${peer.chatId}`));
        }
      }
      if (peer instanceof Api.PeerChannel) {
        peer as Api.PeerChannel;
        if (isInstance(peer.channelId)) {
          //@ts-ignore
          this.id = BigInt(Number(`-100${toString(peer.channelId)}`));
        } else {
          //@ts-ignore
          this.id = BigInt(Number(`-100${peer.channelId}`));
        }
      }
    } else {
      this.id = typeof peer == 'number' ? BigInt(peer) : peer;
    }
    if (this.id) {
      let mode = ['debug', 'info'];
      if (mode.includes(snakeClient.logger)) {
        snakeClient.log(
          `[${snakeClient.connectTime}] - [${new Date().toLocaleString()}] - Creating chat ${
            this.id
          }`
        );
      }
      let entity = await snakeClient.telegram.getEntity(this.id, true);
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
      this.dcId = entity.dcId;
      this.photo = entity.photo;
      this.restrictionReason = entity.restrictionReason;
    }
    await Cleaning(this);
    return this;
  }
}
