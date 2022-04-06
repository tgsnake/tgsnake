// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Snake } from '../../Client';
import { inspect } from 'util';
import { betterConsoleLog } from '../CleanObject';
import { FileId, decodeFileId } from '../../Libs/tg-file-id-1.1.3/src';
import { DownloadFileParams } from '../../Interface/Download';
import BotError from '../../Context/Error';
export type TypeMessageMediaName =
  | 'sticker' //done
  | 'document' //done
  | 'photo' // done
  | 'location' //done
  | 'dice' //done
  | 'contact' //done
  | 'animation' //done
  | 'video' //done
  | 'poll' //done
  | 'venue' // done
  | 'videoNote' //done
  | 'voice' // done
  | 'audio' // done
  | 'webPage' //done
  | 'game' // done
  | 'invoice' // done
  | 'chatPhoto'; //done
export class Media {
  _!: TypeMessageMediaName;
  date!: Date | number;
  /** @hidden */
  private _SnakeClient!: Snake;
  constructor() {
    this.date = Math.floor(Date.now() / 1000);
  }
  get snakeClient() {
    return this._SnakeClient;
  }
  get SnakeClient() {
    return this._SnakeClient;
  }
  set snakeClient(client: Snake) {
    this._SnakeClient = client;
  }
  set SnakeClient(client: Snake) {
    this._SnakeClient = client;
  }
  decode(fileId?: string) {
    //@ts-ignore
    let file = fileId ?? this.fileId;
    if (!file) throw new BotError(`FileId not found!`, 'Media.decode', '');
    return decodeFileId(String(file));
  }
  /** @hidden */
  [inspect.custom]() {
    return betterConsoleLog(this);
  }
  /** @hidden */
  toJSON() {
    let obj = betterConsoleLog(this);
    for (let [key, value] of Object.entries(obj)) {
      if (typeof value == 'bigint') obj[key] = String(value);
    }
    return obj;
  }
}
