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
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
const parser = new Parser(Api);
export interface editMessageMoreParams {
  noWebpage?: boolean;
  media?: Api.TypeInputMedia;
  replyMarkup?: TypeReplyMarkup;
  entities?: Entities[];
  scheduleDate?: number;
  parseMode?: string;
}
/**
 * This method allow you to edit a message.
 * @param snakeClient - Client
 * @param {number|string|bigint} chatId - Chat/Groups/Channel id.
 * @param {number} messageId - Message id to be edited.
 * @param {string} text - New Message/Caption. You can pass with blank string (`""`) if you want to edit media.
 * @param {Object} more - more parameters to use.
 */
export async function EditMessage(
  snakeClient: Snake,
  chatId: number | string | bigint,
  messageId: number,
  text: string,
  more?: editMessageMoreParams
) {
  try {
    snakeClient.log.debug('Running telegram.editMessage');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let parseMode = '';
    let replyMarkup;
    let parseText = text;
    let entities: Array<Api.TypeMessageEntity> = [];
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    if (more) {
      if (more.parseMode) {
        parseMode = more.parseMode.toLowerCase();
        delete more.parseMode;
      }
      if (more.replyMarkup) {
        snakeClient.log.debug('Building replyMarkup');
        replyMarkup = await BuildReplyMarkup(more.replyMarkup!, snakeClient);
        delete more.replyMarkup;
      }
      if (more.entities) {
        snakeClient.log.debug('Building Entities');
        parseText = text;
        entities = (await parser.toRaw(
          snakeClient.client!,
          more.entities!
        )) as Array<Api.TypeMessageEntity>;
        delete more.entities;
      }
    }
    if (!entities.length) {
      snakeClient.log.debug('Building Entities');
      //@ts-ignore
      let [t, e] = parseMode !== '' ? parser.parse(text, parseMode!) : [text, []];
      parseText = t;
      entities = (await parser.toRaw(snakeClient.client!, e!)) as Array<Api.TypeMessageEntity>;
    }
    let results: Api.TypeUpdates = await snakeClient.client.invoke(
      new Api.messages.EditMessage({
        peer: peer,
        id: messageId,
        message: parseText,
        //@ts-ignore
        entities: entities,
        replyMarkup: replyMarkup,
        ...more,
      })
    );
    return await createResults(results, snakeClient);
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.editMessage');
    throw new BotError(
      error.message,
      'telegram.editMessage',
      `${chatId},${messageId},${text},${more ? JSON.stringify(more, null, 2) : ''}`
    );
  }
}
async function createResults(results: Api.TypeUpdates, snakeClient: Snake) {
  snakeClient.log.debug('Create results telegram.editMessage');
  if (results instanceof Api.Updates) {
    results as Api.Updates;
    if (results.updates?.length > 0) {
      for (let i = 0; i < results.updates.length; i++) {
        if (results.updates[i] instanceof Api.UpdateEditChannelMessage) {
          let arc = results.updates[i] as Api.UpdateEditChannelMessage;
          let update = new Update.UpdateEditChannelMessage();
          await update.init(arc, snakeClient);
          return update;
        }
        if (results.updates[i] instanceof Api.UpdateEditMessage) {
          let arc = results.updates[i] as Api.UpdateEditMessage;
          let update = new Update.UpdateEditMessage();
          await update.init(arc, snakeClient);
          return update;
        }
      }
    }
  }
}
