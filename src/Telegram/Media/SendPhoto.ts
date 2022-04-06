// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../Client';
import { SendMedia, sendMediaMoreParams } from './SendMedia';
import { UploadFile } from './UploadFile';
import { decodeFileId } from '../../Libs/tg-file-id-1.1.3/src';
import * as Medias from '../../Utils/Medias';
import bigInt from 'big-integer';
import BotError from '../../Context/Error';
import { onProgress } from './UploadFile';
export interface sendPhotoMoreParams extends sendMediaMoreParams {
  workers?: number;
  onProgress?: onProgress;
  download?: boolean;
}
function clean(more?: sendPhotoMoreParams) {
  if (more) {
    let purge = ['workers', 'onProgress'];
    for (let [key] of Object.entries(more)) {
      if (purge.includes(key)) delete more[key];
    }
  }
  return more;
}
/**
 * Sending photo with fileId/file location/url/buffer.
 * @param snakeClient - client
 * @param {number|string|bigint} chatId - Chat/Groups/Channel id.
 * @param {string|Buffer|Object} fileId - FileId/File Location/Url/Buffer
 * @param {Object} more - more parameters to use.
 * ```ts
 * bot.on("message",async (ctx) => {
 *     if(ctx.media && ctx.media._ == "photo"){
 *         let results = await ctx.telegram.sendPhoto(ctx.chat.id,ctx.media.fileId)
 *         console.log(results)
 *     }
 * })
 * ```
 */
export async function SendPhoto(
  snakeClient: Snake,
  chatId: number | string | bigint,
  fileId: string | Buffer | Medias.MediaPhoto,
  more?: sendPhotoMoreParams
) {
  try {
    snakeClient.log.debug('Running telegram.sendPhoto');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    switch (fileId.constructor) {
      case Buffer:
        fileId as Buffer;
        return await SendMedia(
          snakeClient,
          chatId,
          new Api.InputMediaUploadedPhoto({
            //@ts-ignore
            file: await UploadFile(snakeClient, fileId, {
              workers: more?.workers || 1,
              onProgress: more?.onProgress,
            }),
          }),
          clean(more)
        );
        break;
      case Medias.MediaPhoto:
        fileId as Medias.MediaPhoto;
        return await SendMedia(
          snakeClient,
          chatId,
          new Api.InputMediaPhoto({
            id: new Api.InputPhoto({
              //@ts-ignore
              id: bigInt(String(fileId._id!)),
              //@ts-ignore
              accessHash: bigInt(String(fileId._accessHash!)),
              //@ts-ignore
              fileReference: Buffer.from(fileId._fileReference!, 'hex'),
            }),
          }),
          clean(more)
        );
        break;
      case String:
        fileId as string;
        if (/^http/i.test(String(fileId)) || /^(\/|\.\.?\/|~\/)/i.test(String(fileId))) {
          if (more && more.download) {
            return await SendMedia(
              snakeClient,
              chatId,
              new Api.InputMediaUploadedPhoto({
                //@ts-ignore
                file: await UploadFile(snakeClient, fileId, {
                  workers: more?.workers || 1,
                  onProgress: more?.onProgress,
                }),
              }),
              clean(more)
            );
          }
          return await SendMedia(
            snakeClient,
            chatId,
            new Api.InputMediaPhotoExternal({
              //@ts-ignore
              url: fileId,
            }),
            clean(more)
          );
        } else {
          //@ts-ignore
          let file = await decodeFileId(fileId);
          if (file.typeId !== 2) throw new Error(`Invalid fileId. This fileId not for photos`);
          return await SendMedia(
            snakeClient,
            chatId,
            new Api.InputMediaPhoto({
              id: new Api.InputPhoto({
                id: bigInt(String(file.id)),
                accessHash: bigInt(String(file.access_hash)),
                fileReference: Buffer.from(file.fileReference, 'hex'),
              }),
            }),
            clean(more)
          );
        }
      default:
        throw new Error(`Couldn't resolve this fileId.`);
    }
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.sendPhoto');
    throw new BotError(
      error.message,
      'telegram.sendPhoto',
      `${chatId},${
        Buffer.isBuffer(fileId) ? `<Buffer ${fileId.toString('hex')}>` : JSON.stringify(fileId)
      }${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
