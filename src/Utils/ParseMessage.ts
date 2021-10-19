// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Snake } from '../client';
import marked from 'marked';
import { Entities, ParseEntities } from './Entities';
import { _parseMessageText } from 'telegram/client/messageParse';
import { Api } from 'telegram';
export async function ParseMessage(
  SnakeClient: Snake,
  text: string,
  parseMode: string,
  entities?: Entities[]
): Promise<[string, Api.TypeMessageEntity[]]> {
  if (parseMode == '') return [text, []];
  let [c, e] = await _parseMessageText(SnakeClient.client, text, parseMode);
  if (parseMode == 'markdown') {
    let d = await marked(c);
    let [f, g] = await _parseMessageText(
      SnakeClient.client,
      d.replace(/\<(\/)?([^a])\>/gim, '').trim(),
      'html'
    );
    c = f;
    e = [...e, ...g];
  }
  if (entities) {
    e = await ParseEntities(entities);
    c = text;
  }
  if (!c) c = text;
  if (!e) e = [];
  return [c, e];
}
