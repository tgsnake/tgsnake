// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Update } from './Update';
import { From } from '../Utils/From';
import { Telegram } from '../Telegram';
import { Snake } from '../Client';
import { toString } from '../Utils/ToBigInt';

export class UpdateUserStatus extends Update {
  user!: From;
  status!: string;
  constructor() {
    super();
    this['_'] = 'updateUserStatus';
  }
  async init(update: Api.UpdateUserStatus, SnakeClient: Snake) {
    let mode = ['debug', 'info'];
    if (mode.includes(SnakeClient.logger)) {
      SnakeClient.log(
        `[${SnakeClient.connectTime}] - [${new Date().toLocaleString()}] - Creating update ${
          this['_']
        }`
      );
    }
    this.telegram = SnakeClient.telegram;
    if (update.userId) {
      let user = new From();
      await user.init(BigInt(toString(update.userId!) as string), SnakeClient);
      this.user = user;
    }
    if (update.status) {
      switch (update.status.className) {
        case 'UserStatusOnline':
          this.status = 'online';
          break;
        case 'UserStatusOffline':
          this.status = 'offline';
          break;
        case 'UserStatusRecently':
          this.status = 'recently';
          break;
        case 'UserStatusLastWeek':
          this.status = 'withinWeek';
          break;
        case 'UserStatusLastMonth':
          this.status = 'withinMonth';
          break;
        default:
          this.status = 'longTimeAgo';
      }
    }
    return this;
  }
}
