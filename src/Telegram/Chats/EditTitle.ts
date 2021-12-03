// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Snake } from '../../client';
import { Api } from 'telegram';
import * as Updates from '../../Update';
import BotError from '../../Context/Error';
export async function EditTitle(snakeClient: Snake, chatId: number | string, title: string) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.editTitle`
      );
    }
    let type = await snakeClient.telegram.getEntity(chatId);
    if (type.type == 'channel') {
      let results: Api.TypeUpdates = await snakeClient.client.invoke(
        new Api.channels.EditTitle({
          channel: chatId,
          title: title,
        })
      );
      return await generateResults(results, snakeClient);
    } else {
      return snakeClient.client.invoke(
        new Api.messages.EditChatTitle({
          chatId: type.id,
          title: title,
        })
      );
    }
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.editTitle';
    botError.functionArgs = `${chatId},${title}`;
    throw botError;
  }
}
async function generateResults(results: Api.TypeUpdates, SnakeClient: Snake) {
  let mode = ['debug', 'info'];
  if (mode.includes(SnakeClient.logger)) {
    SnakeClient.log(
      `[${
        SnakeClient.connectTime
      }] - [${new Date().toLocaleString()}] - Creating results telegram.editTitle`
    );
  }
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
          let res = new Updates.UpdateNewChannelMessage();
          await res.init(update, SnakeClient);
          return res;
        }
      }
    }
  }
}
