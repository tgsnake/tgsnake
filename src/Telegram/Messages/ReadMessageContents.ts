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
export async function ReadMessageContents(snakeClient: Snake, messageId: number[]) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      console.log(
        '\x1b[31m',
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.readMessageContents`,
        '\x1b[0m'
      );
    }
    return new ResultAffectedMessages(
      await snakeClient.client.invoke(
        new Api.messages.ReadMessageContents({
          id: messageId,
        })
      )
    );
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.readMessageContents';
    botError.functionArgs = `${JSON.stringify(messageId)}`;
    throw botError;
  }
}
