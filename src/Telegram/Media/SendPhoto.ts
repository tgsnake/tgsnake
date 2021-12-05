// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import { SendMedia, sendMediaMoreParams } from './SendMedia';
import { UploadFile } from './UploadFile';
import { decodeFileId } from 'tg-file-id';
import { Media } from '../../Utils/Media';
import BigInt from 'big-integer';
import BotError from '../../Context/Error';
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
  more?: sendMediaMoreParams
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
      });
      let media = new Api.InputMediaUploadedPhoto({
        file: new Api.InputFile({ ...file! }),
      });
      return SendMedia(snakeClient, chatId, media, more);
    }
    // https and path file.
    if (
      typeof fileId == 'string' &&
      (/^http/i.exec(String(fileId)) || /^(\/|\.\.?\/|~\/)/i.exec(String(fileId)))
    ) {
      fileId as string;
      let file = await UploadFile(snakeClient, fileId, {
        workers: more?.workers || 1,
      });
      let media = new Api.InputMediaUploadedPhoto({
        file: new Api.InputFile({ ...file! }),
      });
      return SendMedia(snakeClient, chatId, media, more);
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
                id: BigInt(id),
                accessHash: BigInt(accessHash),
                fileReference: Buffer.from(file.fileReference, 'hex'),
              }),
            });
            results = SendMedia(snakeClient, chatId, media, more);
            break;
          } catch (e) {
            if (Number(accessHash) > 0 && Number(id) > 0) {
              // id (+) accessHash (+)
              accessHash = `-${accessHash}`; // id (+) accessHash (-)
            } else if (Number(accessHash) < 0 && Number(id) > 0) {
              // id (+) accessHash (-)
              id = `-${id}`; // id (-) accessHash (-)
            } else if (Number(accessHash) < 0 && Number(id) < 0) {
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
                id: BigInt(id),
                accessHash: BigInt(accessHash),
                fileReference: Buffer.from(file.fileReference, 'hex'),
              }),
            });
            results = SendMedia(snakeClient, chatId, media, more);
            break;
          } catch (e) {
            if (Number(accessHash) > 0 && Number(id) > 0) {
              // id (+) accessHash (+)
              accessHash = `-${accessHash}`; // id (+) accessHash (-)
            } else if (Number(accessHash) < 0 && Number(id) > 0) {
              // id (+) accessHash (-)
              id = `-${id}`; // id (-) accessHash (-)
            } else if (Number(accessHash) < 0 && Number(id) < 0) {
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
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.sendPhoto';
    botError.functionArgs = `${chatId},${
      Buffer.isBuffer(fileId) ? `<Buffer ${fileId.toString('hex')}>` : JSON.stringify(fileId)
    }${more ? ',' + JSON.stringify(more) : ''}`;
    throw botError;
  }
}
