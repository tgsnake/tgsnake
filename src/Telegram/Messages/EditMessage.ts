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
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.editMessage`
      );
    }
    let parseMode = '';
    let replyMarkup;
    let parseText = text;
    let entities;
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    if (more) {
      if (more.parseMode) {
        parseMode = more.parseMode.toLowerCase();
        delete more.parseMode;
      }
      if (more.replyMarkup) {
        replyMarkup = BuildReplyMarkup(more.replyMarkup!);
        delete more.replyMarkup;
      }
      if (more.entities) {
        parseText = text;
        entities = (await parser.toRaw(
          snakeClient.client!,
          more.entities!
        )) as Array<Api.TypeMessageEntity>;
        delete more.entities;
      }
    }
    if (!more?.entities) {
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
    throw new BotError(
      error.message,
      'telegram.editMessage',
      `${chatId},${messageId},${text},${more ? JSON.stringify(more, null, 2) : ''}`
    );
  }
}
async function createResults(results: Api.TypeUpdates, snakeClient: Snake) {
  let mode = ['debug', 'info'];
  if (mode.includes(snakeClient.logger)) {
    snakeClient.log(
      `[${
        snakeClient.connectTime
      }] - [${new Date().toLocaleString()}] - Creating results telegram.editMessage`
    );
  }
  if (results instanceof Api.Updates) {
    results as Api.Updates;
    if (results.updates?.length > 0) {
      for (let i = 0; i < results.updates.length; i++) {
        if (results.updates[i] instanceof Api.UpdateEditChannelMessage) {
          let arc = results.updates[i] as Api.UpdateEditChannelMessage;
          //todo
          //using UpdateEditChannelMessage
          return arc;
        }
        //todo
        // using UpdateEditMessage
        if (results.updates[i] instanceof Api.UpdateEditMessage) {
          let arc = results.updates[i] as Api.UpdateEditMessage;
          return arc;
        }
      }
    }
  }
}
