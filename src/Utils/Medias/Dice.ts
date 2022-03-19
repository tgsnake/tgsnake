// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Media } from './Media';
import { Snake } from '../../Client';
import { Cleaning } from '../CleanObject';

export class MediaDice extends Media {
  emoji!: string;
  value!: number;
  constructor() {
    super();
    this['_'] = 'dice';
  }
  async encode(dice: Api.MessageMediaDice, snakeClient: Snake) {
    snakeClient.log.debug('Creating MediaDice');
    this.snakeClient = snakeClient;
    this.emoji = dice.emoticon;
    this.value = dice.value;
    await Cleaning(this);
    return this;
  }
}
