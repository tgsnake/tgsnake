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
import bigInt, { BigInteger } from 'big-integer';
import { convertId } from '../../Utils/ToBigInt';

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
/**
 * Modify the admin rights of a user in a supergroup/channel.
 * @param snakeClient - Client
 * @param {bigint|number|string} chatId - Chat/Channel/Group id.
 * @param {bigint|number|string} userId - User id.
 * @param {Object} - more parameters to use.
 *```ts
 * bot.command("promote",async (ctx) => {
 *    if((!ctx.chat.private) && ctx.replyToMessage){
 *        let results = await ctx.telegram.editAdmin(ctx.chat.id,ctx.replyToMessage.from.id)
 *        console.log(results)
 *    }
 * })
 *```
 * This method will return UpdateNewMessage or UpdateNewChannelMessage if success.
 */
export async function EditAdmin(
  snakeClient: Snake,
  chatId: bigint | number | string,
  userId: bigint | number | string,
  more?: editAdminMoreParams
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.editAdmin`
      );
    }
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
        channel: convertId(chatId),
        userId: convertId(userId),
        adminRights: new Api.ChatAdminRights(permissions),
        rank: more?.rank || '',
      })
    );
    return await generateResults(results, snakeClient);
  } catch (error: any) {
    throw new BotError(
      error.message,
      'telegram.editAdmin',
      `${chatId},${userId}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
async function generateResults(results: Api.TypeUpdates, SnakeClient: Snake) {
  let mode = ['debug', 'info'];
  if (mode.includes(SnakeClient.logger)) {
    SnakeClient.log(
      `[${
        SnakeClient.connectTime
      }] - [${new Date().toLocaleString()}] - Creating results telegram.editAdmin`
    );
  }
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
