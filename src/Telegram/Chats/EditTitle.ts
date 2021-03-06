// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Snake } from '../../Client';
import { Api } from 'telegram';
import * as Updates from '../../Update';
import BotError from '../../Context/Error';
import { convertId, toBigInt } from '../../Utils/ToBigInt';
import { BigInteger } from 'big-integer';
/**
 * edit chat/group/channel title.
 * @param snakeClient - Client
 * @param {bigint|number|string} chatId - Chat/Groups/Channel id.
 * @param {string} title - New title.
 * ```ts
 * bot.command("editTitle",async (ctx) => {
 *    if(!ctx.chat.private){
 *        let results = await ctx.telegram.editTitle(ctx.chat.id,"hey new title")
 *        console.log(results)
 *    }
 * })
 * ```
 * This method will return UpdateNewMessage or UpdateNewChannelMessage. if success.
 */
export async function EditTitle(
  snakeClient: Snake,
  chatId: bigint | number | string,
  title: string
) {
  try {
    snakeClient.log.debug('Running telegram.editTitle');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let [id, type] = await toBigInt(chatId, snakeClient);
    if (type == 'channel') {
      let results: Api.TypeUpdates = await snakeClient.client.invoke(
        new Api.channels.EditTitle({
          channel: id as BigInteger,
          title: title,
        })
      );
      snakeClient.log.debug('Creating results telegram.editTitle');
      return await generateResults(results, snakeClient);
    } else {
      return snakeClient.client.invoke(
        new Api.messages.EditChatTitle({
          chatId: id as BigInteger,
          title: title,
        })
      );
    }
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.editTitle');
    throw new BotError(error.message, 'telegram.editTitle', `${chatId},${title}`);
  }
}
async function generateResults(results: Api.TypeUpdates, SnakeClient: Snake) {
  if (results instanceof Api.Updates) {
    results as Api.Updates;
    if (results.updates.length > 0) {
      for (let i = 0; i < results.updates.length; i++) {
        let update = results.updates[i];
        if (update instanceof Api.UpdateNewMessage) {
          update as Api.UpdateNewMessage;
          let res = new Updates.UpdateNewMessage();
          await res.init(update, SnakeClient);
          return res;
        }
        if (update instanceof Api.UpdateNewChannelMessage) {
          update as Api.UpdateNewChannelMessage;
          let res = new Updates.UpdateNewChannelMessage();
          await res.init(update, SnakeClient);
          return res;
        }
      }
    }
  }
}
