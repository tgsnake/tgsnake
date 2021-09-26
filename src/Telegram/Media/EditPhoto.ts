// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import { UploadFile } from './UploadFile';
import * as Updates from '../../Update';
export async function EditPhoto(
  snakeClient: Snake,
  chatId: number | string,
  photo: string | Buffer
) {
  try {
    let rr = await UploadFile(snakeClient, photo);
    let toUpload = new Api.InputFile({ ...rr! });
    let type = await snakeClient.telegram.getEntity(chatId);
    if (type.type == 'channel') {
      let results: Api.TypeUpdates = await snakeClient.client.invoke(
        new Api.channels.EditPhoto({
          channel: chatId,
          photo: toUpload,
        })
      );
      return await generateResults(results, snakeClient);
    } else {
      return snakeClient.client.invoke(
        new Api.messages.EditChatPhoto({
          chatId: type.id,
          photo: toUpload,
        })
      );
    }
  } catch (error) {
    return snakeClient._handleError(
      error,
      `telegram.editPhoto(${chatId}${
        Buffer.isBuffer(photo) ? `<Buffer ${photo.toString('hex')} >` : photo
      })`
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
