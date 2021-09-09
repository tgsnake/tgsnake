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
    let randomId: any = [];
    for (let i = 0; i < messageId.length; i++) {
      randomId.push(BigInt(Math.floor(Math.random() * 10000000000000)));
    }
    let results: Api.TypeUpdates = await snakeClient.client.invoke(
      new Api.messages.ForwardMessages({
        fromPeer: fromChatId,
        toPeer: chatId,
        id: messageId,
        randomId: randomId,
        ...more,
      })
    );
    return await createResults(results, snakeClient);
  } catch (error) {
    return snakeClient._handleError(
      error,
      `telegram.forwardMessages(${chatId},${fromChatId},${JSON.stringify(messageId)},${
        more ? JSON.stringify(more, null, 2) : ''
      })`
    );
  }
}
async function createResults(results: Api.TypeUpdates, snakeClient: Snake) {
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
