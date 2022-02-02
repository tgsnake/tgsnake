// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import {
  _intoIdSet,
  DefaultEventInterface,
  EventBuilder,
  EventCommon,
} from 'telegram/events/common';
import { Api } from 'telegram';
import { Snake } from '../Client';
import { TelegramClient } from 'telegram';
import bigInt, { BigInteger } from 'big-integer';
import { ResultGetEntity } from '../Telegram/Users/GetEntity';
import type { Entity, EntityLike } from 'telegram/define';

export interface InterfaceSnakeEvent extends DefaultEventInterface {
  func?: { (event: Api.TypeUpdate | Api.TypeUpdates): any };
}

export class SnakeEvent extends EventBuilder {
  private _SnakeClient!: Snake;
  constructor(SnakeClient: Snake, eventParams: InterfaceSnakeEvent) {
    let { chats, blacklistChats, func } = eventParams;
    super({ chats, blacklistChats, func });
    this._SnakeClient = SnakeClient;
  }
  build(update: Api.TypeUpdate | Api.TypeUpdates, callback: undefined, selfId: BigInteger) {
    //@ts-ignore
    if (update._entities && update._entities.size) {
      //@ts-ignore
      for (let [key, value] of update._entities.entries()) {
        let entities = new ResultGetEntity(value!);
        this._SnakeClient.entityCache.set(entities.id!, entities!);
        if (entities.username) this._SnakeClient.entityCache.set(entities.username!, entities!);
      }
    }
    return update;
  }
}
