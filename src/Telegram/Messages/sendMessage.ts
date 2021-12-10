// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published..

import { Api } from 'telegram';
import { Snake } from '../../client';
import { TypeReplyMarkup, BuildReplyMarkup } from '../../Utils/ReplyMarkup';
import { Entities } from '../../Utils/Entities';
import { ParseMessage } from '../../Utils/ParseMessage';
import bigInt from 'big-integer';
import * as Update from '../../Update';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
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
}
export async function sendMessage(
  snakeClient: Snake,
  chatId: number | string | bigint,
  text: string,
  more?: sendMessageMoreParams
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.sendMessage`
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
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.sendMessage';
    botError.functionArgs = `${chatId},${text},${more ? JSON.stringify(more, null, 2) : ''}`;
    throw botError;
  }
}
async function createResults(results: Api.TypeUpdates, snakeClient: Snake) {
  let mode = ['debug', 'info'];
  if (mode.includes(snakeClient.logger)) {
    snakeClient.log(
      `[${
        snakeClient.connectTime
      }] - [${new Date().toLocaleString()}] - Creating results telegram.sendMessage`
    );
  }
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
