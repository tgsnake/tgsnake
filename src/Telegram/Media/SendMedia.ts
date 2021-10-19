// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import { TypeReplyMarkup, BuildReplyMarkup } from '../../Utils/ReplyMarkup';
import { Entities, ParseEntities } from '../../Utils/Entities';
import { _parseMessageText } from 'telegram/client/messageParse';
import BigInt from 'big-integer';
import * as Update from '../../Update';
import path from 'path';
export interface sendMediaMoreParams {
  silent?: boolean;
  background?: boolean;
  parseMode?: string;
  clearDraft?: boolean;
  replyToMsgId?: number;
  replyMarkup?: TypeReplyMarkup;
  entities?: Entities[];
  scheduleDate?: number;
  caption?: string;
  workers?: number;
  mimeType?: string;
  fileName?: string;
}

export async function SendMedia(
  snakeClient: Snake,
  chatId: number | string,
  media: Api.TypeInputMedia,
  more?: sendMediaMoreParams
) {
  try {
    let parseMode = '';
    if (more) {
      if (more.parseMode) {
        parseMode = more.parseMode.toLowerCase();
        delete more.parseMode;
      }
    }
    let parseText;
    let entities;
    let replyMarkup;
    if (more) {
      if (more.entities) {
        entities = await ParseEntities(more.entities);
        parseText = more.caption || '';
        delete more.entities;
      }
      if (more.caption && !entities) {
        let parse = await _parseMessageText(snakeClient.client, more.caption, parseMode);
        parseText = parse[0];
        entities = parse[1];
        delete more.caption;
      }
      if (more.replyMarkup) {
        replyMarkup = BuildReplyMarkup(more.replyMarkup!);
        delete more.replyMarkup;
      }
      if (more.workers) {
        delete more.workers;
      }
      if (more.mimeType) {
        delete more.mimeType;
      }
      if (more.fileName) {
        delete more.fileName;
      }
    }
    return snakeClient.client.invoke(
      new Api.messages.SendMedia({
        peer: chatId,
        media: media,
        message: parseText || '',
        randomId: BigInt(-Math.floor(Math.random() * 10000000000000)),
        entities: entities,
        replyMarkup: replyMarkup,
        ...more,
      })
    );
  } catch (error) {
    return snakeClient._handleError(
      error,
      `telegram.sendMedia(${chatId},${JSON.stringify(media)}${
        more ? ',' + JSON.stringify(more) : ''
      })`
    );
  }
}
