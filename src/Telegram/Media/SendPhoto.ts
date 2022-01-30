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
import { decodeFileId } from 'tg-file-id';
import { Media } from '../../Utils/Media';
import bigInt from 'big-integer';
import BotError from '../../Context/Error';
import { onProgress } from './UploadFile';
export interface sendPhotoMoreParams extends sendMediaMoreParams {
  workers?: number;
  onProgress?: onProgress;
}
function clean(more?: sendPhotoMoreParams) {
  if (more) {
    if (more.workers !== undefined) {
      delete more.workers;
    }
    if (more.onProgress !== undefined) {
      delete more.onProgress;
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
 *     if(ctx.media && ctx.media.type == "photo"){
 *         let results = await ctx.telegram.sendPhoto(ctx.chat.id,ctx.media.fileId)
 *         console.log(results)
 *     }
 * })
 * ```
 */
export async function SendPhoto(
  snakeClient: Snake,
  chatId: number | string | bigint,
  fileId: string | Buffer | Media,
  more?: sendPhotoMoreParams
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.sendPhoto`
      );
    }
    // buffer
    if (Buffer.isBuffer(fileId)) {
      fileId as Buffer;
      let file = await UploadFile(snakeClient, fileId, {
        workers: more?.workers || 1,
        onProgress: more?.onProgress,
      });
      let media = new Api.InputMediaUploadedPhoto({
        file: file!,
      });
      return SendMedia(snakeClient, chatId, media, clean(more));
    }
    // https and path file.
    if (
      typeof fileId == 'string' &&
      (/^http/i.exec(String(fileId)) || /^(\/|\.\.?\/|~\/)/i.exec(String(fileId)))
    ) {
      fileId as string;
      if (/^http/i.exec(String(fileId))) {
        let file = new Api.InputMediaPhotoExternal({
          url: fileId as string,
        });
        return SendMedia(snakeClient, chatId, file, clean(more));
      }
      let file = await UploadFile(snakeClient, fileId, {
        workers: more?.workers || 1,
        onProgress: more?.onProgress,
      });
      let media = new Api.InputMediaUploadedPhoto({
        file: file!,
      });
      return SendMedia(snakeClient, chatId, media, clean(more));
    }
    // file id
    if (fileId instanceof Media) {
      let file;
      try {
        fileId as Media;
        file = fileId.decode();
      } catch (e) {
        throw new Error('Invalid fileId!');
      }
      if (file) {
        if (file.typeId !== 2) {
          throw new Error(`typeId invalid. typeId must be 2 but got ${file.typeId}`);
        }
        let accessHash: string = String(file.access_hash);
        let id: string = String(file.id);
        let results;
        while (true) {
          try {
            let media = new Api.InputMediaPhoto({
              id: new Api.InputPhoto({
                id: bigInt(id),
                accessHash: bigInt(accessHash),
                fileReference: Buffer.from(file.fileReference, 'hex'),
              }),
            });
            results = SendMedia(snakeClient, chatId, media, clean(more));
            break;
          } catch (e) {
            if (BigInt(accessHash) > BigInt(0) && BigInt(id) > BigInt(0)) {
              // id (+) accessHash (+)
              accessHash = `-${accessHash}`; // id (+) accessHash (-)
            } else if (BigInt(accessHash) < BigInt(0) && BigInt(id) > BigInt(0)) {
              // id (+) accessHash (-)
              id = `-${id}`; // id (-) accessHash (-)
            } else if (BigInt(accessHash) < BigInt(0) && BigInt(id) < BigInt(0)) {
              // id (-) accessHash (-)
              accessHash = accessHash.replace(/^\-/, '');
              // id (-) accessHash (+)
            } else {
              //@ts-ignore
              throw new Error(e.message);
              break;
            }
          }
        }
        return results;
      }
    }
    if (typeof fileId == 'string') {
      let file;
      try {
        file = decodeFileId(String(fileId));
      } catch (e) {
        throw new Error('Invalid fileId!');
      }
      if (file) {
        if (file.typeId !== 2) {
          throw new Error(`typeId invalid. typeId must be 2 but got ${file.typeId}`);
        }
        let accessHash: string = String(file.accessHash);
        let id: string = String(file.id);
        let results;
        while (true) {
          try {
            let media = new Api.InputMediaPhoto({
              id: new Api.InputPhoto({
                id: bigInt(id),
                accessHash: bigInt(accessHash),
                fileReference: Buffer.from(file.fileReference, 'hex'),
              }),
            });
            results = SendMedia(snakeClient, chatId, media, clean(more));
            break;
          } catch (e) {
            if (BigInt(accessHash) > BigInt(0) && BigInt(id) > BigInt(0)) {
              // id (+) accessHash (+)
              accessHash = `-${accessHash}`; // id (+) accessHash (-)
            } else if (BigInt(accessHash) < BigInt(0) && BigInt(id) > BigInt(0)) {
              // id (+) accessHash (-)
              id = `-${id}`; // id (-) accessHash (-)
            } else if (BigInt(accessHash) < BigInt(0) && BigInt(id) < BigInt(0)) {
              // id (-) accessHash (-)
              accessHash = accessHash.replace(/^\-/, '');
              // id (-) accessHash (+)
            } else {
              //@ts-ignore
              throw new Error(e.message);
              break;
            }
          }
        }
        return results;
      }
    }
  } catch (error: any) {
    throw new BotError(
      error.message,
      'telegram.sendPhoto',
      `${chatId},${
        Buffer.isBuffer(fileId) ? `<Buffer ${fileId.toString('hex')}>` : JSON.stringify(fileId)
      }${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
