// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Snake } from '../../Client';
import { Api } from 'telegram';
import { ResultGetEntity } from '../Users/GetEntity';
import { ChatParticipants } from '../../Utils/ChatParticipants';
import BotError from '../../Context/Error';
import { toBigInt } from '../../Utils/ToBigInt';
import bigInt from 'big-integer';
export interface GetParticipantMoreParams {
  offset?: number;
  limit?: number;
  query?: string;
  filter?: 'all' | 'kicked' | 'restricted' | 'bots' | 'recents' | 'administrators';
}
/**
 * Getting list from all participants in channel or chats.
 * @param snakeClient - Client
 * @param {number|string|bigint} chatId - Chat or channels id to getting the list of members.
 * @param {Object} more - more parameters to use.
 * ```ts
 * bot.command("getChatMembers",async (ctx) => {
 *     let results = await ctx.telegram.getParticipants(ctx.chat.id) // getChatMembers and getParticipants is same methods.
 *     console.log(results)
 * })
 * ```
 */
export async function GetParticipants(
  snakeClient: Snake,
  chatId: number | string | bigint,
  more?: GetParticipantMoreParams
): Promise<ChatParticipants | undefined> {
  try {
    snakeClient.log.debug('Running telegram.getParticipants');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let options = Object.assign(
      {
        offset: 0,
        limit: 200,
        query: '',
        filter: 'all',
      },
      more || {}
    );
    let chat: ResultGetEntity = await snakeClient.telegram.getEntity(chatId, true);
    if (chat.type == 'user') {
      throw new Error('Typeof chatId must be channel or chat, not a user.');
    }
    if (chat.type == 'chat') {
      let r: Api.messages.ChatFull = await snakeClient.client.invoke(
        new Api.messages.GetFullChat({
          chatId: bigInt(String(chat.id * BigInt(-1)) as string),
        })
      );
      let cf: Api.ChatFull = r.fullChat as Api.ChatFull;
      let part: Api.ChatParticipants = cf.participants as Api.ChatParticipants;
      snakeClient.log.debug('Creating results telegram.getParticipants');
      let participant: ChatParticipants = new ChatParticipants();
      await participant.init(part, snakeClient);
      return participant;
    }
    if (chat.type == 'channel' || chat.type == 'supergroup') {
      let filter: Api.TypeChannelParticipantsFilter = new Api.ChannelParticipantsSearch({
        q: options.query,
      });
      switch (options.filter) {
        case 'kicked':
          filter = new Api.ChannelParticipantsKicked({ q: options.query });
          break;
        case 'restricted':
          filter = new Api.ChannelParticipantsBanned({ q: options.query });
          break;
        case 'bots':
          filter = new Api.ChannelParticipantsBots();
          break;
        case 'recents':
          filter = new Api.ChannelParticipantsRecent();
          break;
        case 'administrators':
          filter = new Api.ChannelParticipantsAdmins();
          break;
        default:
      }
      let r: Api.channels.ChannelParticipants = (await snakeClient.client.invoke(
        new Api.channels.GetParticipants({
          channel: bigInt(chat.id as bigint),
          filter: filter,
          offset: options.offset,
          limit: options.limit,
          hash: bigInt(0),
        })
      )) as Api.channels.ChannelParticipants;
      snakeClient.log.debug('Creating results telegram.getParticipants');
      let participant: ChatParticipants = new ChatParticipants();
      //@ts-ignore
      await participant.init(r as Api.ChannelParticipants, snakeClient);
      return participant;
    }
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.getParticipants');
    throw new BotError(
      error.message,
      'telegram.getParticipants',
      `${chatId},${JSON.stringify(more)}`
    );
  }
}
