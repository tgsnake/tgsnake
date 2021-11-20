// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Snake } from '../../client';
import { ResultGetEntity } from '../Users/GetEntity';
import { Api } from 'telegram';
import BotError from '../../Context/Error';
export async function GetChatMembersCount(snakeClient: Snake, chatId: number | string) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      console.log(
        '\x1b[31m',
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.getChatMembersCount`,
        '\x1b[0m'
      );
    }
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
          id: [chat.id],
        })
      );
      let s: Api.Chat = r.chats[0] as Api.Chat;
      snakeClient.entityCache.set(chat.id, new ResultGetEntity(s));
      return s.participantsCount;
    }
    if (chat.type == 'channel') {
      let r: Api.messages.ChatFull = await snakeClient.client.invoke(
        new Api.channels.GetFullChannel({
          channel: chat.id,
        })
      );
      let fc: Api.ChannelFull = r.fullChat as Api.ChannelFull;
      let s: Api.Channel = r.chats[0] as Api.Channel;
      s.participantsCount = fc.participantsCount;
      snakeClient.entityCache.set(chat.id, new ResultGetEntity(s));
      return s.participantsCount;
    }
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.getChatMembersCount';
    botError.functionArgs = `${chatId}`;
    throw botError;
  }
}
