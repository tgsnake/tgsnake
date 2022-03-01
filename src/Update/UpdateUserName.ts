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

export class UpdateUserName extends Update {
  user!:From;
  constructor(){
    super(); 
    this["_"] = "updateUserName"
  }
  async init(update:Api.UpdateUserName,SnakeClient:Snake){
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
  }
}