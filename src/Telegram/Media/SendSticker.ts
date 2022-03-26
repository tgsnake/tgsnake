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
import * as Medias from '../../Utils/Medias';
import bigInt from 'big-integer';
import BotError from '../../Context/Error';
/**
 * Sending sticker with fileId/file location/url/buffer.
 * @param snakeClient - client
 * @param {bigint|number|string} chatId - Chat/Groups/Channel id.
 * @param {string|Buffer|Object} fileId - Path file/FileId/Buffer.
 * ```ts
 * bot.on("message",async (ctx) => {
 *     if(ctx.media && ctx.media._ == "sticker"){
 *         let results = await ctx.telegram.sendSticker(ctx.chat.id,ctx.media.fileId)
 *         console.log(results)
 *     }
 * })
 * ```
 */
export async function SendSticker(
  snakeClient: Snake,
  chatId: number | string | bigint,
  fileId: string | Buffer | Medias.MediaSticker
) {
  try {
    snakeClient.log.debug('Running telegram.sendSticker');
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
          new Api.InputMediaUploadedDocument({
            //@ts-ignore
            file: await UploadFile(snakeClient, fileId),
            mimeType: 'image/webp',
            attributes: [
              new Api.DocumentAttributeFilename({
                fileName: `sticker.webp`,
              }),
            ],
          })
        );
        break;
      case Medias.MediaSticker:
        fileId as Medias.MediaSticker;
        return await SendMedia(
          snakeClient,
          chatId,
          new Api.InputMediaDocument({
            id: new Api.InputDocument({
              //@ts-ignore
              id: bigInt(String(fileId._id)),
              //@ts-ignore
              accessHash: bigInt(String(fileId._accessHash)),
              //@ts-ignore
              fileReference: Buffer.from(fileId._fileReference, 'hex'),
            }),
          })
        );
        break;
      case String:
        fileId as string;
        //@ts-ignore
        if (/^http/i.test(fileId) || /^(\/|\.\.?\/|~\/)/i.test(fileId)) {
          return await SendMedia(
            snakeClient,
            chatId,
            new Api.InputMediaUploadedDocument({
              //@ts-ignore
              file: await UploadFile(snakeClient, fileId),
              mimeType: 'image/webp',
              attributes: [
                new Api.DocumentAttributeFilename({
                  fileName: `sticker.webp`,
                }),
              ],
            })
          );
        } else {
          //@ts-ignore
          let file = await decodeFileId(fileId);
          if (file.typeId !== 8) throw new Error(`Invalid fileId. This fileId not for sticker`);
          return await SendMedia(
            snakeClient,
            chatId,
            new Api.InputMediaDocument({
              id: new Api.InputDocument({
                id: bigInt(String(file.id)),
                accessHash: bigInt(String(file.access_hash)),
                fileReference: Buffer.from(file.fileReference, 'hex'),
              }),
            })
          );
        }
        break;
      default:
        throw new Error(`Couldn't resolve this fileId.`);
    }
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.sendSticker');
    throw new BotError(
      error.message,
      'telegram.sendSticker',
      `${chatId},${
        Buffer.isBuffer(fileId) ? `<Buffer ${fileId.toString('hex')}>` : JSON.stringify(fileId)
      }`
    );
  }
}
