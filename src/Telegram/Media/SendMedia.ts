// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import * as crypto from 'crypto';
import { Api } from 'telegram';
import { Snake } from '../../Client';
import { TypeReplyMarkup, BuildReplyMarkup } from '../../Utils/ReplyMarkup';
import Parser, { Entities } from '@tgsnake/parser';
import bigInt from 'big-integer';
import * as Update from '../../Update';
import path from 'path';
import { toBigInt, toString, convertId } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
import { onProgress } from './UploadFile';
const parser = new Parser(Api);
export interface defaultSendMediaMoreParams {
  silent?: boolean;
  background?: boolean;
  clearDraft?: boolean;
  replyToMsgId?: number;
  scheduleDate?: number;
  noforwards?: boolean;
  sendAs?: string;
  replyMarkup?: TypeReplyMarkup;
}
export interface sendMediaMoreParams extends defaultSendMediaMoreParams {
  entities?: Entities[];
  parseMode?: string;
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
    snakeClient.log.debug('Running telegram.sendMedia');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
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
        snakeClient.log.debug('Building Entities');
        entities = (await parser.toRaw(
          snakeClient.client!,
          more.entities
        )) as Array<Api.TypeMessageEntity>;
        parseText = more.caption || '';
        delete more.entities;
      }
      if (more.caption && !more.entities) {
        snakeClient.log.debug('Building Entities');
        //@ts-ignore
        let [t, e] = parseMode !== '' ? parser.parse(more.caption, parseMode!) : [more.caption, []];
        parseText = t;
        entities = (await parser.toRaw(snakeClient.client!, e!)) as Array<Api.TypeMessageEntity>;
        delete more.caption;
      }
      if (more.replyMarkup) {
        snakeClient.log.debug('Building replyMarkup');
        replyMarkup = await BuildReplyMarkup(more.replyMarkup!, snakeClient);
        delete more.replyMarkup;
      }
    }
    return await createResults(
      await snakeClient.client.invoke(
        new Api.messages.SendMedia({
          peer: peer,
          media: media,
          message: parseText || '',
          randomId: bigInt(crypto.randomBytes(8).readBigInt64LE()),
          //@ts-ignore
          entities: entities,
          replyMarkup: replyMarkup,
          silent: more?.silent,
          background: more?.background,
          clearDraft: more?.clearDraft,
          scheduleDate: more?.scheduleDate,
          noforwards: more?.noforwards,
          sendAs: more?.sendAs,
          replyTo: more?.replyToMsgId
            ? new Api.InputReplyToMessage({
                replyToMsgId: more!.replyToMsgId,
              })
            : undefined,
        })
      ),
      snakeClient
    );
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.sendMedia');
    throw new BotError(
      error.message,
      'telegram.sendMedia',
      `${chatId},${JSON.stringify(media)}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
async function createResults(results: Api.TypeUpdates, snakeClient: Snake) {
  snakeClient.log.debug('Creating results telegram.sendMedia');
  if (results instanceof Api.UpdateShortSentMessage) {
    results as Api.UpdateShortSentMessage;
    let update = new Update.UpdateShortSentMessage();
    await update.init(results, snakeClient);
    return update;
  }
  if (results instanceof Api.Updates) {
    results as Api.Updates;
    if (results.updates.length > 0) {
      for (let i = 0; i < results.updates.length; i++) {
        if (results.updates[i] instanceof Api.UpdateNewMessage) {
          let arc = results.updates[i] as Api.UpdateNewMessage;
          let update = new Update.UpdateNewMessage();
          await update.init(arc, snakeClient);
          return update;
        }
        if (results.updates[i] instanceof Api.UpdateNewChannelMessage) {
          let arc = results.updates[i] as Api.UpdateNewChannelMessage;
          let update = new Update.UpdateNewChannelMessage();
          await update.init(arc, snakeClient);
          return update;
        }
      }
    }
  }
}
