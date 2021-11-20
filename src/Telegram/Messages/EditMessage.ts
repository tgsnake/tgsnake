// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import { TypeReplyMarkup, BuildReplyMarkup } from '../../Utils/ReplyMarkup';
import { Entities } from '../../Utils/Entities';
import { ParseMessage } from '../../Utils/ParseMessage';
import BigInt from 'big-integer';
import * as Update from '../../Update';
import { toBigInt, toNumber } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
export interface editMessageMoreParams {
  noWebpage?: boolean;
  media?: Api.TypeInputMedia;
  replyMarkup?: TypeReplyMarkup;
  entities?: Entities[];
  scheduleDate?: number;
  parseMode?: string;
}
export async function EditMessage(
  snakeClient: Snake,
  chatId: number | string,
  messageId: number,
  text: string,
  more?: editMessageMoreParams
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      console.log(
        '\x1b[31m',
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.editMessage`,
        '\x1b[0m'
      );
    }
    let parseMode = '';
    let replyMarkup;
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
    }
    let [parseText, entities] = await ParseMessage(snakeClient, text, parseMode, more?.entities);
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
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.editMessage';
    botError.functionArgs = `${chatId},${messageId},${text},${
      more ? JSON.stringify(more, null, 2) : ''
    }`;
    throw botError;
  }
}
async function createResults(results: Api.TypeUpdates, snakeClient: Snake) {
  let mode = ['debug', 'info'];
  if (mode.includes(snakeClient.logger)) {
    console.log(
      '\x1b[31m',
      `[${
        snakeClient.connectTime
      }] - [${new Date().toLocaleString()}] - Creating results telegram.editMessage`,
      '\x1b[0m'
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
