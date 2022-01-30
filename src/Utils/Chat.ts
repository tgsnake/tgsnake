// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { BannedRights } from './BannedRight';
import { ChatPhoto } from './ChatPhoto';
import { Snake } from '../Client';
import { Api } from 'telegram';
import { toBigInt, toString } from './ToBigInt';
import { BigInteger, isInstance } from 'big-integer';
import { Cleaning } from './CleanObject';
export class Chat {
  id!: bigint;
  title?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  private?: boolean;
  photo?: ChatPhoto;
  defaultBannedRights?: BannedRights;
  participantsCount?: number;
  dcId?: number;
  fake!: boolean;
  scam!: boolean;
  type!: string;
  noforward?: boolean;
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
          this.id = BigInt(`-${toString(peer.chatId)}`);
        } else {
          //@ts-ignore
          this.id = BigInt(`-${peer.chatId}`);
        }
      }
      if (peer instanceof Api.PeerChannel) {
        peer as Api.PeerChannel;
        if (isInstance(peer.channelId)) {
          //@ts-ignore
          this.id = BigInt(`-100${toString(peer.channelId)}`);
        } else {
          //@ts-ignore
          this.id = BigInt(`-100${peer.channelId}`);
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
      let tg = snakeClient.telegram;
      let entity = await tg.getEntity(this.id, true);
      this.id = entity.id;
      this.noforward = entity.noforward;
      this.username = entity.username!;
      this.firstName = entity.firstName!;
      this.lastName = entity.lastName!;
      this.title = entity.title!;
      this.photo = entity.photo!;
      this.defaultBannedRights = entity.defaultBannedRights;
      this.participantsCount = entity.participantsCount;
      this.dcId = entity.dcId;
      this.fake = entity.fake !== undefined ? entity.fake : false;
      this.scam = entity.scam !== undefined ? entity.scam : false;
      this.private = Boolean(entity.type === 'user');
      this.type = entity.type as string;
    }
    await Cleaning(this);
    return this;
  }
}
