// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import { ResultAffectedMessages } from './DeleteMessages';
export async function ReadMentions(snakeClient: Snake, chatId: number | string) {
  try {
    return new ResultAffectedMessages(
      await snakeClient.client.invoke(
        new Api.messages.ReadMentions({
          peer: chatId,
        })
      )
    );
  } catch (error) {
    return snakeClient._handleError(error, `telegram.readMentions(${chatId}`);
  }
}
