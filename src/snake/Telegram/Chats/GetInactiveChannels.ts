// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';

export async function GetInactiveChannels(snakeClient: Snake) {
  try {
    return await snakeClient.client.invoke(new Api.channels.GetInactiveChannels());
  } catch (error) {
    return snakeClient._handleError(error, `telegram.getInactiveChannels()`);
  }
}
