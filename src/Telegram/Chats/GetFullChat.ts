// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published..

import { Api } from 'telegram';
import { Snake } from '../../client';
import BotError from '../../Context/Error';
export async function GetFullChat(snakeClient: Snake, chatId: number | string) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      console.log(
        '\x1b[31m',
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.getFullChat`,
        '\x1b[0m'
      );
    }
    let type = await snakeClient.telegram.getEntity(chatId);
    if (type.type == 'channel') {
      return snakeClient.client.invoke(
        new Api.channels.GetFullChannel({
          channel: chatId,
        })
      );
    } else {
      return snakeClient.client.invoke(
        new Api.messages.GetFullChat({
          chatId: type.id,
        })
      );
    }
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.getFullChat';
    botError.functionArgs = `${chatId}`;
    throw botError;
  }
}
