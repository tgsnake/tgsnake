/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { TLObject } from '../../TL';
import { Raw, Helpers } from '@tgsnake/core';
import type { Snake } from '../../../Client';

// https://core.telegram.org/bots/api#dice
export class Dice extends TLObject {
  emoji!: string;
  value!: number;
  constructor(
    {
      emoji,
      value,
    }: {
      emoji: string;
      value: number;
    },
    client: Snake
  ) {
    super(client);
    this.className = 'dice';
    this.classType = 'types';
    this.constructorId = 0x3f7ee58b; // Raw.MessageMediaDice
    this.subclassOfId = 0x476cbe32; // Raw.TypeMessageMedia
    this.emoji = emoji;
    this.value = value;
  }
  static parse(client: Snake, dice: Raw.MessageMediaDice) {
    return new Dice(
      {
        emoji: dice.emoticon,
        value: dice.value,
      },
      client
    );
  }
}
