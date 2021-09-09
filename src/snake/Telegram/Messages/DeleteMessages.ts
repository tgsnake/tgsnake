// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Snake } from '../../client';
import { Api } from 'telegram';
export class ResultAffectedMessages {
  pts?: number = 0;
  ptsCount?: number = 0;
  offset?: number;
  date: Date | number = Math.floor(Date.now() / 1000);
  constructor(results: Api.messages.AffectedMessages | Api.messages.AffectedHistory | boolean) {
    if (results instanceof Api.messages.AffectedMessages) {
      if (results.pts) this.pts = results.pts;
      if (results.ptsCount) this.ptsCount = results.ptsCount;
    }
    if (results instanceof Api.messages.AffectedHistory) {
      if (results.pts) this.pts = results.pts;
      if (results.ptsCount) this.ptsCount = results.ptsCount;
      if (results.offset) this.offset = results.offset;
    }
  }
}
export async function DeleteMessages(
  snakeClient: Snake,
  chatId: number | string,
  messageId: number[]
) {
  try {
    let type = await snakeClient.telegram.getEntity(chatId);
    if (type.type == 'channel') {
      return new ResultAffectedMessages(
        await snakeClient.client.invoke(
          new Api.channels.DeleteMessages({
            channel: chatId,
            id: messageId,
          })
        )
      );
    } else {
      return new ResultAffectedMessages(
        await snakeClient.client.invoke(
          new Api.messages.DeleteMessages({
            revoke: true,
            id: messageId,
          })
        )
      );
    }
  } catch (error) {
    return snakeClient._handleError(
      error,
      `telegram.deleteMessages(${chatId},${JSON.stringify(messageId)})`
    );
  }
}
