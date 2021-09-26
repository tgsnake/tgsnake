// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Snake } from '../../client';
import { Api } from 'telegram';
import * as Updates from '../../Update';

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
export async function EditBanned(
  snakeClient: Snake,
  chatId: number | string,
  userId: number | string,
  more?: editBannedMoreParams
) {
  try {
    let permissions = {
      untilDate: more?.untilDate || 0,
      viewMessages: more?.viewMessages || true,
      sendMessages: more?.sendMessages || true,
      sendMedia: more?.sendMedia || true,
      sendStickers: more?.sendStickers || true,
      sendGifs: more?.sendGifs || true,
      sendGames: more?.sendGames || true,
      sendInline: more?.sendInline || true,
      sendPolls: more?.sendPolls || true,
      changeInfo: more?.changeInfo || true,
      inviteUsers: more?.inviteUsers || true,
      pinMessages: more?.pinMessages || true,
      embedLinks: more?.embedLinks || true,
    };
    let results: Api.TypeUpdates = await snakeClient.client.invoke(
      new Api.channels.EditBanned({
        channel: chatId,
        participant: userId,
        bannedRights: new Api.ChatBannedRights(permissions),
      })
    );
    return await generateResults(results, snakeClient);
  } catch (error) {
    return snakeClient._handleError(
      error,
      `telegram.editBanned(${chatId},${userId}${more ? ',' + JSON.stringify(more) : ''})`
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
          //todo
          // using Updates.UpdateNewChannelMessage
          return update;
        }
      }
    }
  }
}
