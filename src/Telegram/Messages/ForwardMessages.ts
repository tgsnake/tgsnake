// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Snake } from '../../Client';
import { TypeReplyMarkup, BuildReplyMarkup } from '../../Utils/ReplyMarkup';
import Parser, { Entities } from '@tgsnake/parser';
import bigInt from 'big-integer';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import * as Update from '../../Update';
import BotError from '../../Context/Error';

export interface forwardMessageMoreParams {
  withMyScore?: boolean;
  silent?: boolean;
  background?: boolean;
  scheduleDate?: number;
  noforwards?: boolean;
  sendAs?: string;
  dropAuthor?: boolean;
  dropMediaCaptions?: boolean;
}
/**
 * Forwards messages by their IDs.
 * @param snakeClient - client
 * @param {number|string|bigint} chatId - Destination.
 * @param {number|string|bigint} fromChatId - Source of messages.
 * @param {Array} messageId - IDs of messages which will forwarded.
 * @param {Object} more - more paramaters to use.
 * ```ts
 * bot.command("forward", async (ctx) => {
 *     let results = await ctx.telegram.forwardMessages(ctx.chat.id,ctx.chat.id,[ctx.id])
 *     return console.log(results)
 * })
 * ```
 */
export async function ForwardMessages(
  snakeClient: Snake,
  chatId: number | string | bigint,
  fromChatId: number | string | bigint,
  messageId: number[],
  more?: forwardMessageMoreParams
) {
  try {
    snakeClient.log.debug('Running telegram.forwardMessages');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    if (typeof fromChatId === 'number')
      snakeClient.log.warning(
        'Type of fromChatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let randomId: any = [];
    for (let i = 0; i < messageId.length; i++) {
      snakeClient.log.debug('Building randomId');
      randomId.push(bigInt(Math.floor(Math.random() * 10000000000000)));
    }
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    let [fId, fType, fPeer] = await toBigInt(fromChatId, snakeClient);
    let results: Api.TypeUpdates = await snakeClient.client.invoke(
      new Api.messages.ForwardMessages({
        fromPeer: fPeer,
        toPeer: peer,
        id: messageId,
        randomId: randomId,
        ...more,
      })
    );
    return await createResults(results, snakeClient);
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.forwardMessages');
    throw new BotError(
      error.message,
      'telegram.forwardMessages',
      `${chatId},${fromChatId},${JSON.stringify(messageId)},${
        more ? JSON.stringify(more, null, 2) : ''
      }`
    );
  }
}
async function createResults(results: Api.TypeUpdates, snakeClient: Snake) {
  snakeClient.log.debug('Creating results telegram.forwardMessages');
  if (results instanceof Api.Updates) {
    results as Api.Updates;
    if (results.updates?.length > 0) {
      for (let i = 0; i < results.updates.length; i++) {
        if (results.updates[i] instanceof Api.UpdateNewMessage) {
          let arc = results.updates[i] as Api.UpdateNewMessage;
          let update = new Update.UpdateNewMessage();
          await update.init(arc, snakeClient);
          return update;
        }
        if (results.updates[i] instanceof Api.UpdateNewChannelMessage) {
          let arc = results.updates[i] as Api.UpdateNewChannelMessage;
          let res = new Update.UpdateNewChannelMessage();
          await res.init(arc, snakeClient);
          return res;
        }
      }
    }
  }
}
