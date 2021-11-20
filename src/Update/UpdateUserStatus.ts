// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Update } from './Update';
import { From } from '../Utils/From';
import { Telegram } from '../Telegram';
import { Snake } from '../client';

export class UpdateUserStatus extends Update {
  user!: From;
  status!: string;
  constructor() {
    super();
    this['_'] = 'UpdateUserStatus';
  }
  async init(update: Api.UpdateUserStatus, SnakeClient: Snake) {
    let mode = ['debug', 'info'];
    if (mode.includes(SnakeClient.logger)) {
      console.log(
        '\x1b[31m',
        `[${SnakeClient.connectTime}] - [${new Date().toLocaleString()}] - Creating update ${
          this['_']
        }`,
        '\x1b[0m'
      );
    }
    this.telegram = SnakeClient.telegram;
    if (update.userId) {
      let user = new From();
      await user.init(update.userId, SnakeClient);
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
