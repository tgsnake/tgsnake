// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Snake } from '../../client';
import { Api } from 'telegram';
import { ResultAffectedMessages } from './DeleteMessages';
export async function DeleteUserHistory(
  snakeClient: Snake,
  chatId: number | string,
  userId: number | string
) {
  try {
    return new ResultAffectedMessages(
      await snakeClient.client.invoke(
        new Api.channels.DeleteUserHistory({
          channel: chatId,
          userId: userId,
        })
      )
    );
  } catch (error) {
    return snakeClient._handleError(error, `telegram.deleteUserHistory(${chatId}${userId})`);
  }
}
