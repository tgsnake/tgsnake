// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
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
    return snakeClient.client.invoke(
      new Api.channels.ExportMessageLink({
        channel: chatId,
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
