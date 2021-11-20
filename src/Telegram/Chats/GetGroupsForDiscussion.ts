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
export async function GetGroupsForDiscussion(snakeClient: Snake) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      console.log(
        '\x1b[31m',
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.getGroupsForDiscussion`,
        '\x1b[0m'
      );
    }
    let results: Api.messages.TypeChats = await snakeClient.client.invoke(
      new Api.channels.GetGroupsForDiscussion()
    );
    return results;
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.getGroupsForDiscussion';
    botError.functionArgs = ``;
    throw botError;
  }
}
