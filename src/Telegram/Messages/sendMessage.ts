// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published..

import { Api } from 'telegram';
import { Snake } from '../../Client';
import { TypeReplyMarkup, BuildReplyMarkup } from '../../Utils/ReplyMarkup';
import Parser, { Entities } from '@tgsnake/parser';
import bigInt from 'big-integer';
import * as Update from '../../Update';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
const parser = new Parser(Api);
export interface sendMessageMoreParams {
  noWebpage?: boolean;
  silent?: boolean;
  background?: boolean;
  parseMode?: string;
  clearDraft?: boolean;
  replyToMsgId?: number;
  replyMarkup?: TypeReplyMarkup;
  entities?: Entities[];
  scheduleDate?: number;
  noforwards?: boolean;
  sendAs?: string;
}
export async function sendMessage(
  snakeClient: Snake,
  chatId: number | string | bigint,
  text: string,
  more?: sendMessageMoreParams
) {
  try {
    snakeClient.log.debug('Running telegram.sendMessage');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let parseMode = '';
    let replyMarkup;
    let parseText = text;
    let entities: Api.TypeMessageEntity[] = [];
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    if (more) {
      if (more.parseMode) {
        parseMode = more.parseMode.toLowerCase();
        delete more.parseMode;
      }
      if (more.replyMarkup) {
        snakeClient.log.debug('Building replyMarkup');
        replyMarkup = BuildReplyMarkup(more.replyMarkup!);
        delete more.replyMarkup;
      }
      if (more.entities) {
        snakeClient.log.debug('Building Entities');
        entities = (await parser.toRaw(
          snakeClient.client!,
          more.entities!
        )) as Array<Api.TypeMessageEntity>;
      }
    }
    if (!more?.entities) {
      snakeClient.log.debug('Building Entities');
      //@ts-ignore
      let [t, e] = parseMode !== '' ? parser.parse(text, parseMode) : [text, []];
      parseText = t;
      entities = (await parser.toRaw(snakeClient.client!, e!)) as Array<Api.TypeMessageEntity>;
    }
    let results: Api.TypeUpdates = await snakeClient.client.invoke(
      new Api.messages.SendMessage({
        peer: peer,
        message: parseText,
        randomId: bigInt(-Math.floor(Math.random() * 10000000000000)),
        //@ts-ignore
        entities: entities,
        replyMarkup: replyMarkup,
        ...more,
      })
    );
    return await createResults(results, snakeClient);
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.sendMessage');
    throw new BotError(
      error.message,
      'telegram.sendMessage',
      `${chatId},${text},${more ? JSON.stringify(more, null, 2) : ''}`
    );
  }
}
async function createResults(results: Api.TypeUpdates, snakeClient: Snake) {
  snakeClient.log.debug('Creating results telegram.sendMessage');
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
