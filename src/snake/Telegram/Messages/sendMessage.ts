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
  chatId: number | string,
  text: string,
  more?: sendMessageMoreParams
) {
  try {
    let parseMode = '';
    let replyMarkup;
    if (more) {
      if (more.parseMode) {
        parseMode = more.parseMode.toLowerCase();
        delete more.parseMode;
      }
    }
    let [parseText, entities] = await _parseMessageText(snakeClient.client, text, parseMode);
    if (more) {
      if (more.entities) {
        entities = await ParseEntities(more.entities);
        parseText = text;
        delete more.entities;
      }
      if (more.replyMarkup) {
        replyMarkup = BuildReplyMarkup(more.replyMarkup!);
        delete more.replyMarkup;
      }
    }
    let results: Api.TypeUpdates = await snakeClient.client.invoke(
      new Api.messages.SendMessage({
        peer: chatId,
        message: parseText,
        randomId: BigInt(-Math.floor(Math.random() * 10000000000000)),
        //@ts-ignore
        entities: entities,
        replyMarkup: replyMarkup,
        ...more,
      })
    );
    return await createResults(results, snakeClient);
  } catch (error) {
    return snakeClient._handleError(
      error,
      `telegram.sendMessage(${chatId},${text},${more ? JSON.stringify(more, null, 2) : ''})`
    );
  }
}
async function createResults(results: Api.TypeUpdates, snakeClient: Snake) {
  console.log(results);
  if (results instanceof Api.UpdateShortSentMessage) {
    results as Api.UpdateShortSentMessage;
    let update = new Update.UpdateShortSentMessage();
    await update.init(results, snakeClient);
    return update;
  }
  if (results instanceof Api.Updates) {
    results as Api.Updates;
    if (results.updates?.length > 0) {
      for (let i = 0; i < results.updates.length; i++) {
        if (results.updates[i] instanceof Api.UpdateNewMessage) {
          let arc = results.updates[i] as Api.UpdateNewMessage;
          let update = new Update.UpdateNewMessage();
          await update.init(arc, snakeClient);
          return update;
        }
        //todo
        // using UpdateNewChannelMessage
        if (results.updates[i] instanceof Api.UpdateNewChannelMessage) {
          let arc = results.updates[i] as Api.UpdateNewChannelMessage;
          return arc;
        }
      }
    }
  }
}
