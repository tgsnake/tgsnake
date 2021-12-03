// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import { ResultAffectedMessages } from './DeleteMessages';
import { toBigInt, toNumber } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
export async function ReadMentions(snakeClient: Snake, chatId: number | string) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.readMentions`
      );
    }
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    return new ResultAffectedMessages(
      await snakeClient.client.invoke(
        new Api.messages.ReadMentions({
          peer: peer,
        })
      )
    );
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.readMentions';
    botError.functionArgs = ``;
    throw botError;
  }
}
