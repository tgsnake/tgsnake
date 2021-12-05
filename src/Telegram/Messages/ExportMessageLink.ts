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
import BotError from '../../Context/Error';
export interface exportMessageLinkMoreParams {
  thread?: boolean;
  grouped?: boolean;
}
/**
 * Get link and embed info of a message in a channel/supergroup
 * @param snakeClient - client
 * @param {number|string|bigint} chatId - supergroup/channel id.
 * @param {number} messageId - message id.
 * @param {Object} more - more paramaters to use.
 */
export async function ExportMessageLink(
  snakeClient: Snake,
  chatId: number | string | bigint,
  messageId: number,
  more?: exportMessageLinkMoreParams
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.exportMessageLink`
      );
    }
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    return snakeClient.client.invoke(
      new Api.channels.ExportMessageLink({
        channel: peer,
        id: messageId,
        ...more,
      })
    );
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.exportMessageLink';
    botError.functionArgs = `${chatId},${messageId}${more ? ',' + JSON.stringify(more) : ''}`;
    throw botError;
  }
}
