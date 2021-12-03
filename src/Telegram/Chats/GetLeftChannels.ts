// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import BotError from '../../Context/Error';
export async function GetLeftChannels(snakeClient: Snake, offset: number = 0) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.getLeftChannels`
      );
    }
    return await snakeClient.client.invoke(
      new Api.channels.GetLeftChannels({
        offset: offset,
      })
    );
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.getLeftChannels';
    botError.functionArgs = `${offset}`;
    throw botError;
  }
}
