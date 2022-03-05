// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Snake } from '../../Client';
import { Api } from 'telegram';
import BotError from '../../Context/Error';
import * as Updates from '../../Update';
import { convertId } from '../../Utils/ToBigInt';
export interface editBannedMoreParams {
  untilDate?: number;
  viewMessages?: boolean;
  sendMessages?: boolean;
  sendMedia?: boolean;
  sendStickers?: boolean;
  sendGifs?: boolean;
  sendGames?: boolean;
  sendInline?: boolean;
  sendPolls?: boolean;
  changeInfo?: boolean;
  inviteUsers?: boolean;
  pinMessages?: boolean;
  embedLinks?: boolean;
}
/**
 * Ban/unban/kick a user in a supergroup/channel.
 * @param snakeClient - Client
 * @param {number|bigint|string} chatId - Chat/Group/Channel id.
 * @param {number|bigint|string} userId - User id.
 * @param {Object} more - more parameters to use.
 * ```ts
 * bot.command("ban",async (ctx) => {
 * if((!ctx.chat.private) && ctx.replyToMessage){
 *   let results = await ctx.telegram.editBanned(ctx.chat.id,ctx.replyToMessage.from.id)
 *   console.log(results)
 * }
 * })
 * ```
 * This method will return UpdateNewMessage or UpdateNewChannelMessage. if success.
 */
export async function EditBanned(
  snakeClient: Snake,
  chatId: bigint | number | string,
  userId: bigint | number | string,
  more?: editBannedMoreParams
) {
  try {
    snakeClient.log.debug('Running telegram.editBanned');
    if (typeof userId === 'number')
      snakeClient.log.warning(
        'Type of userId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let results: Api.TypeUpdates = await snakeClient.client.invoke(
      new Api.channels.EditBanned({
        channel: convertId(chatId),
        participant: convertId(userId),
        bannedRights: new Api.ChatBannedRights(
          Object.assign(
            {
              untilDate: 0,
              viewMessages: true,
              sendMessages: true,
              sendMedia: true,
              sendStickers: true,
              sendGifs: true,
              sendGames: true,
              sendInline: true,
              sendPolls: true,
              changeInfo: true,
              inviteUsers: true,
              pinMessages: true,
              embedLinks: true,
            },
            more
          )
        ),
      })
    );
    snakeClient.log.debug('Creating results telegram.editBanned');
    return await generateResults(results, snakeClient);
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.editBanned');
    throw new BotError(
      error.message,
      'telegram.editBanned',
      `${chatId},${userId}${more ? ',' + JSON.stringify(more) : ''}`
    );
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
