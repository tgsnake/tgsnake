// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { ResultAffectedMessages } from './DeleteMessages';
import { Api } from 'telegram';
import { Snake } from '../../client';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
export interface readHistoryMoreParams {
  maxId?: number;
}
export async function ReadHistory(
  snakeClient: Snake,
  chatId: number | string | bigint,
  more?: readHistoryMoreParams
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.readHistory`
      );
    }
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    if (type == 'channel') {
      let results = await snakeClient.client.invoke(
        new Api.channels.ReadHistory({
          channel: peer,
          ...more,
        })
      );
      return new ResultAffectedMessages(results);
    } else {
      let results = await snakeClient.client.invoke(
        new Api.messages.ReadHistory({
          peer: peer,
          ...more,
        })
      );
      return new ResultAffectedMessages(results);
    }
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.readHistory';
    botError.functionArgs = `${chatId}${more ? ',' + JSON.stringify(more) : ''}`;
    throw botError;
  }
}
