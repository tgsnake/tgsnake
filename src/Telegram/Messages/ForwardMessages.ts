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
import { Entities, ParseEntities } from '../../Utils/Entities';
import { _parseMessageText } from 'telegram/client/messageParse';
import BigInt from 'big-integer';
import { toBigInt, toNumber } from '../../Utils/ToBigInt';
import * as Update from '../../Update';
import BotError from '../../Context/Error';
export interface forwardMessageMoreParams {
  withMyScore?: boolean;
  silent?: boolean;
  background?: boolean;
  scheduleDate?: number;
}
export async function ForwardMessages(
  snakeClient: Snake,
  chatId: number | string,
  fromChatId: number | string,
  messageId: number[],
  more?: forwardMessageMoreParams
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.forwardMessages`
      );
    }
    let randomId: any = [];
    for (let i = 0; i < messageId.length; i++) {
      randomId.push(BigInt(Math.floor(Math.random() * 10000000000000)));
    }
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    let [fId, fType, fPeer] = await toBigInt(fromChatId, snakeClient);
    let results: Api.TypeUpdates = await snakeClient.client.invoke(
      new Api.messages.ForwardMessages({
        fromPeer: fPeer,
        toPeer: peer,
        id: messageId,
        randomId: randomId,
        ...more,
      })
    );
    return await createResults(results, snakeClient);
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.forwardMessages';
    botError.functionArgs = `${chatId},${fromChatId},${JSON.stringify(messageId)},${
      more ? JSON.stringify(more, null, 2) : ''
    }`;
    throw botError;
  }
}
async function createResults(results: Api.TypeUpdates, snakeClient: Snake) {
  let mode = ['debug', 'info'];
  if (mode.includes(snakeClient.logger)) {
    snakeClient.log(
      `[${
        snakeClient.connectTime
      }] - [${new Date().toLocaleString()}] - Creating results telegram.forwardMessages`
    );
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
        if (results.updates[i] instanceof Api.UpdateNewChannelMessage) {
          let arc = results.updates[i] as Api.UpdateNewChannelMessage;
          let res = new Update.UpdateNewChannelMessage();
          await res.init(arc, snakeClient);
          return res;
        }
      }
    }
  }
}
