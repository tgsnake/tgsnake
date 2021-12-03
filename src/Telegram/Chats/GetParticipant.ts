// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Snake } from '../../client';
import { ResultGetEntity } from '../Users/GetEntity';
import { Api } from 'telegram';
import { ChatParticipants } from '../../Utils/ChatParticipants';
import BotError from '../../Context/Error';
export async function GetParticipant(
  snakeClient: Snake,
  chatId: number | string,
  userId: number | string
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.getParticipant`
      );
    }
    let { client } = snakeClient;
    let result: Api.channels.ChannelParticipant = await client.invoke(
      new Api.channels.GetParticipant({
        channel: chatId,
        participant: userId,
      })
    );
    let _results = new ChatParticipants();
    await _results.init(result, snakeClient);
    return _results.participants[0];
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.getParticipant';
    botError.functionArgs = `${chatId},${userId}`;
    throw botError;
  }
}
