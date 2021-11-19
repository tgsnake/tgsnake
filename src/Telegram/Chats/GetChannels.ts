// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';

export async function GetChannels(snakeClient: Snake, chatId: number[] | string[]) {
  try {
    let results: Api.messages.TypeChats = await snakeClient.client.invoke(
      new Api.channels.GetChannels({
        id: chatId,
      })
    );
    //todo
    //change the json results.
    return results;
  } catch (error) {
    return snakeClient._handleError(error, `telegram.getChannels(${chatId})`);
  }
}
