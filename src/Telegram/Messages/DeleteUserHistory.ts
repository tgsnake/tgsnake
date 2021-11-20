// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Snake } from '../../client';
import { Api } from 'telegram';
import { ResultAffectedMessages } from './DeleteMessages';
import { toBigInt, toNumber } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
export async function DeleteUserHistory(
  snakeClient: Snake,
  chatId: number | string,
  userId: number | string
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      console.log(
        '\x1b[31m',
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.deleteUserHistory`,
        '\x1b[0m'
      );
    }
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    let [uId, uType, uPeer] = await toBigInt(userId, snakeClient);
    return new ResultAffectedMessages(
      await snakeClient.client.invoke(
        new Api.channels.DeleteUserHistory({
          channel: peer,
          userId: uPeer,
        })
      )
    );
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.deleteUserHistory';
    botError.functionArgs = `${chatId}${userId}`;
    throw botError;
  }
}
