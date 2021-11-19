// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Snake } from '../../client';
import { Api } from 'telegram';
import { ResultGetEntity } from '../Users/GetEntity';
import { ChatParticipants } from '../../Utils/ChatParticipants';

export interface GetParticipantMoreParams {
  offset?: number;
  limit?: number;
  query?: string;
  filter?: 'all' | 'kicked' | 'restricted' | 'bots' | 'recents' | 'administrators';
}
let defaultOptions: GetParticipantMoreParams = {
  offset: 0,
  limit: 200,
  query: '',
  filter: 'all',
};
export async function GetParticipants(
  snakeClient: Snake,
  chatId: number | string,
  more: GetParticipantMoreParams = defaultOptions
): Promise<ChatParticipants | undefined> {
  try {
    let chat: ResultGetEntity = await snakeClient.telegram.getEntity(chatId, true);
    if (chat.type == 'user') {
      throw new Error('Typeof chatId must be channel or chat, not a user.');
    }
    if (chat.type == 'chat') {
      let r: Api.messages.ChatFull = await snakeClient.client.invoke(
        new Api.messages.GetFullChat({
          chatId: chat.id,
        })
      );
      let cf: Api.ChatFull = r.fullChat as Api.ChatFull;
      let part: Api.ChatParticipants = cf.participants as Api.ChatParticipants;
      let participant: ChatParticipants = new ChatParticipants();
      await participant.init(part, snakeClient);
      return participant;
    }
    if (chat.type == 'channel') {
      let filter: Api.TypeChannelParticipantsFilter = new Api.ChannelParticipantsSearch({
        q: more.query || '',
      });
      switch (more.filter) {
        case 'kicked':
          filter = new Api.ChannelParticipantsKicked({ q: more.query || '' });
          break;
        case 'restricted':
          filter = new Api.ChannelParticipantsBanned({ q: more.query || '' });
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
          channel: chat.id,
          filter: filter,
          offset: more.offset,
          limit: more.limit,
          hash: 0,
        })
      )) as Api.channels.ChannelParticipants;
      let participant: ChatParticipants = new ChatParticipants();
      //@ts-ignore
      await participant.init(r as Api.ChannelParticipants, snakeClient);
      return participant;
    }
  } catch (error) {
    return snakeClient._handleError(
      error,
      `telegram.getParticipants(${chatId},${JSON.stringify(more)})`
    );
  }
}
