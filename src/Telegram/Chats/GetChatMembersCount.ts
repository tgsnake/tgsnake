// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Snake } from '../../Client';
import { ResultGetEntity } from '../Users/GetEntity';
import { Api } from 'telegram';
import BotError from '../../Context/Error';
import bigInt from 'big-integer';
/**
 * Get the number of members in a chat.
 * @param snakeClient - client
 * @param {number|string|bigint} chatId - Chat or channels id to getting the number of members.
 * ```ts
 * bot.command("getChatMembersCount",async (ctx) => {
 *     let results = await ctx.telegram.getChatMembersCount(ctx.chat.id)
 *     console.log(results)
 * })
 * ```
 */
export async function GetChatMembersCount(snakeClient: Snake, chatId: number | string | bigint) {
  try {
    snakeClient.log.debug('Running telegram.getChatMembersCount');
    let chat = await snakeClient.telegram.getEntity(chatId, true);
    if (chat.type === 'user') {
      throw new Error('Typeof chatId must be channel or chat, not a user.');
    }
    if (chat.participantsCount && chat.participantsCount !== null) {
      return chat.participantsCount;
    }
    if (chat.type == 'chat') {
      let r = await snakeClient.client.invoke(
        new Api.messages.GetChats({
          id: [bigInt(chat.id!)],
        })
      );
      let s: Api.Chat = r.chats[0] as Api.Chat;
      snakeClient.entityCache.set(chat.id, new ResultGetEntity(s));
      return s.participantsCount;
    }
    if (chat.type == 'channel' || chat.type == 'supergroup') {
      let r: Api.messages.ChatFull = await snakeClient.client.invoke(
        new Api.channels.GetFullChannel({
          channel: bigInt(chat.id!),
        })
      );
      let fc: Api.ChannelFull = r.fullChat as Api.ChannelFull;
      let s: Api.Channel = r.chats[0] as Api.Channel;
      s.participantsCount = fc.participantsCount;
      snakeClient.entityCache.set(chat.id, new ResultGetEntity(s));
      return s.participantsCount;
    }
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.getChatMembersCount');
    throw new BotError(error.message, 'telegram.getChatMembersCount', `${chatId}`);
  }
}
