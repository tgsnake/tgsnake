// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import * as Updates from '../../Update';
import { toBigInt, toNumber } from '../../Utils/ToBigInt';
export interface pinMessageMoreParams {
  silent?: boolean;
  unpin?: boolean;
  pmOneside?: boolean;
}
export async function PinMessage(
  snakeClient: Snake,
  chatId: number | string,
  messageId: number,
  more?: pinMessageMoreParams
) {
  try {
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    let results: Api.TypeUpdates = await snakeClient.client.invoke(
      new Api.messages.UpdatePinnedMessage({
        peer: peer,
        id: messageId,
        ...more,
      })
    );
    return await generateResults(results, snakeClient);
  } catch (error) {
    return snakeClient._handleError(
      error,
      `telegram.pinMessage(${chatId},${messageId}${more ? ',' + JSON.stringify(more) : ''})`
    );
  }
}
async function generateResults(results: Api.TypeUpdates, SnakeClient: Snake) {
  if (results instanceof Api.Updates) {
    results as Api.Updates;
    if (results.updates.length > 0) {
      for (let i = 0; i < results.updates.length; i++) {
        let update = results.updates[i];
        if (update instanceof Api.UpdateNewMessage) {
          update as Api.UpdateNewMessage;
          let res = new Updates.UpdateNewMessage();
          await res.init(update, SnakeClient);
          return res;
        }
        if (update instanceof Api.UpdateNewChannelMessage) {
          update as Api.UpdateNewChannelMessage;
          //todo
          //using Updates.UpdateNewChannelMessage
          return update;
        }
        if (update instanceof Api.UpdatePinnedMessages) {
          update as Api.UpdatePinnedMessages;
          //todo
          // using Updates.UpdatePinnedMessages
          return update;
        }
        if (update instanceof Api.UpdatePinnedChannelMessages) {
          update as Api.UpdatePinnedChannelMessages;
          //todo
          //using Updates.UpdatePinnedChannelMessage
          return update;
        }
      }
    }
  }
}
