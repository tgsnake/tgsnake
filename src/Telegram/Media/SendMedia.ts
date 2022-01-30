// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../Client';
import { TypeReplyMarkup, BuildReplyMarkup } from '../../Utils/ReplyMarkup';
import Parser, { Entities } from '@tgsnake/parser';
import BigInt from 'big-integer';
import * as Update from '../../Update';
import path from 'path';
import { toBigInt, toString, convertId } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
import { onProgress } from './UploadFile';
const parser = new Parser(Api);
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
}
/**
 * Sending message media.
 * @param snakeClient - Client
 * @param {number|string|bigint} chatId - Chat/Groups/Channel id.
 * @param {Object} media - Message Media.
 * @param more - more parameters to use.
 */
export async function SendMedia(
  snakeClient: Snake,
  chatId: number | string | bigint,
  media: Api.TypeInputMedia,
  more?: sendMediaMoreParams
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.sendMedia`
      );
    }
    let parseMode = '';
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    if (more) {
      if (more.parseMode) {
        parseMode = more.parseMode.toLowerCase();
        delete more.parseMode;
      }
    }
    let parseText;
    let entities: Api.TypeMessageEntity[] = [];
    let replyMarkup;
    if (more) {
      if (more.entities) {
        entities = (await parser.toRaw(
          snakeClient.client!,
          more.entities
        )) as Array<Api.TypeMessageEntity>;
        parseText = more.caption || '';
        delete more.entities;
      }
      if (more.caption && !more.entities) {
        //@ts-ignore
        let [t, e] = parseMode !== '' ? parser.parse(more.caption, parseMode!) : [more.caption, []];
        parseText = t;
        entities = (await parser.toRaw(snakeClient.client!, e!)) as Array<Api.TypeMessageEntity>;
        delete more.caption;
      }
      if (more.replyMarkup) {
        replyMarkup = BuildReplyMarkup(more.replyMarkup!);
        delete more.replyMarkup;
      }
    }
    return snakeClient.client.invoke(
      new Api.messages.SendMedia({
        peer: peer,
        media: media,
        message: parseText || '',
        randomId: BigInt(-Math.floor(Math.random() * 10000000000000)),
        //@ts-ignore
        entities: entities,
        replyMarkup: replyMarkup,
        ...more,
      })
    );
  } catch (error: any) {
    throw new BotError(
      error.message,
      'telegram.sendMedia',
      `${chatId},${JSON.stringify(media)}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
