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
export interface deleteHistoryMoreParams {
  maxId?: number;
  revoke?: boolean;
  justClear?: boolean;
}
export async function DeleteHistory(
  snakeClient: Snake,
  chatId: number | string,
  more?: deleteHistoryMoreParams
) {
  try {
    let type = await snakeClient.telegram.getEntity(chatId);
    if (type.type == 'channel') {
      return snakeClient.client.invoke(
        new Api.channels.DeleteHistory({
          channel: chatId,
          ...more,
        })
      );
    } else {
      return new ResultAffectedMessages(
        await snakeClient.client.invoke(
          new Api.messages.DeleteHistory({
            peer: chatId,
            ...more,
          })
        )
      );
    }
  } catch (error) {
    return snakeClient._handleError(
      error,
      `telegram.deleteHistory(${chatId}${more ? ',' + JSON.stringify(more) : ''})`
    );
  }
}
