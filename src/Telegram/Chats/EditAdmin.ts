// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Snake } from '../../client';
import { Api } from 'telegram';
import * as Updates from '../../Update';

export interface editAdminMoreParams {
  changeInfo?: boolean;
  postMessages?: boolean;
  editMessages?: boolean;
  deleteMessages?: boolean;
  banUsers?: boolean;
  inviteUsers?: boolean;
  pinMessages?: boolean;
  addAdmins?: boolean;
  anonymous?: boolean;
  manageCall?: boolean;
  rank?: string;
}
export async function EditAdmin(
  snakeClient: Snake,
  chatId: number | string,
  userId: number | string,
  more?: editAdminMoreParams
) {
  try {
    let permissions = {
      changeInfo: more?.changeInfo || true,
      postMessages: more?.postMessages || true,
      editMessages: more?.editMessages || true,
      deleteMessages: more?.deleteMessages || true,
      banUsers: more?.banUsers || true,
      inviteUsers: more?.inviteUsers || true,
      pinMessages: more?.pinMessages || true,
      addAdmins: more?.addAdmins || false,
      anonymous: more?.anonymous || false,
      manageCall: more?.manageCall || true,
    };
    let results: Api.TypeUpdates = await snakeClient.client.invoke(
      new Api.channels.EditAdmin({
        channel: chatId,
        userId: userId,
        adminRights: new Api.ChatAdminRights(permissions),
        rank: more?.rank || '',
      })
    );
    return await generateResults(results, snakeClient);
  } catch (error) {
    return snakeClient._handleError(
      error,
      `telegram.editAdmin(${chatId},${userId}${more ? ',' + JSON.stringify(more) : ''})`
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
