// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';

export async function GetLeftChannels(snakeClient: Snake, offset: number = 0) {
  try {
    return await snakeClient.client.invoke(
      new Api.channels.GetLeftChannels({
        offset: offset,
      })
    );
  } catch (error) {
    return snakeClient._handleError(error, `telegram.getLeftChannels(${offset})`);
  }
}
