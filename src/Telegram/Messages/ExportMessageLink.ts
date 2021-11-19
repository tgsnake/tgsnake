// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import { toBigInt, toNumber } from '../../Utils/ToBigInt';
export interface exportMessageLinkMoreParams {
  thread?: boolean;
  grouped?: boolean;
}
export async function ExportMessageLink(
  snakeClient: Snake,
  chatId: number | string,
  messageId: number,
  more?: exportMessageLinkMoreParams
) {
  try {
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    return snakeClient.client.invoke(
      new Api.channels.ExportMessageLink({
        channel: peer,
        id: messageId,
        ...more,
      })
    );
  } catch (error) {
    return snakeClient._handleError(
      error,
      `telegram.exportMessageLink(${chatId},${messageId}${more ? ',' + JSON.stringify(more) : ''})`
    );
  }
}
