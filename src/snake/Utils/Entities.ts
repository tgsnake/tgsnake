// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
export class Entities {
  offset: number = 0;
  length: number = 0;
  type!: string;
  constructor(entities: Api.TypeMessageEntity) {
    if (entities.offset) this.offset = entities.offset;
    if (entities.length) this.length = entities.length;
    this.type = entities.className.replace(/MessageEntity/i, '').trim();
    this.type = this.type.replace(this.type[0], this.type[0].toLowerCase());
  }
}
export function ParseEntities(entities: Entities[]) {
  let temp: Api.TypeMessageEntity[] = [];
  for (let i = 0; i < entities.length; i++) {
    let en = entities[i];
    let type = `MessageEntity${en.type.replace(en.type[0], en.type[0].toUpperCase())}`;
    temp.push(
      new Api[type]({
        length: en.length,
        offset: en.offset,
      })
    );
  }
  return temp as Api.TypeMessageEntity[];
}
