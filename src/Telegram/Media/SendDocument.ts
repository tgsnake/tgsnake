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
import { GetFileInfo } from './GetFileInfo';
import path from 'path';
import BotError from '../../Context/Error';
import { onProgress } from './UploadFile';
export interface sendDocumentMoreParams extends sendMediaMoreParams {
  workers?: number;
  mimeType?: string;
  filename?: string;
  forceDocument?: boolean;
  onProgress?: onProgress;
  download?: boolean;
  thumbnail?: Buffer | string;
}
function clean(more?: sendDocumentMoreParams) {
  if (more) {
    let purge = [
      'workers',
      'mimeType',
      'forceDocument',
      'onProgress',
      'download',
      'thumbnail',
      'filename',
    ];
    for (let [key] of Object.entries(more)) {
      if (purge.includes(key)) delete more[key];
    }
  }
  return more;
}
/**
 * Sending Document file location/url/buffer.
 * @param snakeClient - Client
 * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
 * @param {string|Buffer} fileId - File Location/Url/Buffer .
 * @param {Object} more - more parameters to use.
 * ```ts
 * bot.command("doc",async (ctx) => {
 *     let results = await ctx.telegram.sendDocument(ctx.chat.id,"https://tgsnake.js.org/images/tgsnake.jpg")
 * })
 * ```
 */
export async function SendDocument(
  snakeClient: Snake,
  chatId: number | string | bigint,
  fileId: string | Buffer | Medias.TypeMessageMediaDocument,
  more?: sendDocumentMoreParams
) {
  try {
    snakeClient.log.debug('Running telegram.sendDocument');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    const validateThumb = (thumb: string | Buffer) => {
      switch (thumb.constructor) {
        case Buffer:
          return true;
          break;
        case String:
          thumb as string;
          if (/^http/i.test(String(thumb)) || /^(\/|\.\.?\/|~\/)/i.test(String(thumb))) return true;
          return false;
          break;
        default:
          return false;
      }
    };
    switch (fileId.constructor) {
      case Buffer:
        fileId as Buffer;
        let bufferInfo = await GetFileInfo(fileId as Buffer);
        return await SendMedia(
          snakeClient,
          chatId,
          new Api.InputMediaUploadedDocument({
            //@ts-ignore
            file: await UploadFile(snakeClient, bufferInfo.source as Buffer, {
              workers: more?.workers || 1,
              fileName: more?.filename,
              onProgress: more?.onProgress,
            }),
            //@ts-ignore
            mimeType: bufferInfo.mime || more?.mimeType || 'application/zip',
            attributes: [
              new Api.DocumentAttributeFilename({
                fileName: more?.filename ?? 'unknown',
              }),
            ],
            forceFile: more?.forceDocument ?? true,
            ...(more && more.thumbnail && validateThumb(more.thumbnail)
              ? {
                  thumb: await UploadFile(snakeClient, more.thumbnail!, {
                    workers: more.workers || 1,
                  }),
                }
              : {}),
          }),
          clean(more)
        );
        break;
      case Medias.MediaSticker:
      case Medias.MediaVoice:
      case Medias.MediaVideoNote:
      case Medias.MediaVideo:
      case Medias.MediaAnimation:
      case Medias.MediaAudio:
      case Medias.MediaDocument:
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
        if (/^http/i.test(String(fileId)) || /^(\/|\.\.?\/|~\/)/i.test(String(fileId))) {
          let download = more?.download ?? false;
          if (/^http/i.test(String(fileId)) && !download) {
            let file = new Api.InputMediaDocumentExternal({
              url: fileId as string,
            });
            return await SendMedia(snakeClient, chatId, file, clean(more));
          }
          let fileInfo = await GetFileInfo(String(fileId));
          let basename = path.basename(String(fileId));
          if (!/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim.exec(basename)) {
            basename = `${basename}.${fileInfo?.ext}`;
          }
          return await SendMedia(
            snakeClient,
            chatId,
            new Api.InputMediaUploadedDocument({
              //@ts-ignore
              file: await UploadFile(snakeClient, fileInfo.source as Buffer, {
                workers: more?.workers || 1,
                fileName: more?.filename ?? basename,
                onProgress: more?.onProgress,
              }),
              //@ts-ignore
              mimeType: fileInfo.mime || more?.mimeType || 'application/zip',
              attributes: [
                new Api.DocumentAttributeFilename({
                  fileName: more?.filename ?? 'unknown',
                }),
              ],
              forceFile: more?.forceDocument ?? true,
              ...(more && more.thumbnail && validateThumb(more.thumbnail)
                ? {
                    thumb: await UploadFile(snakeClient, more.thumbnail!, {
                      workers: more.workers || 1,
                    }),
                  }
                : {}),
            }),
            clean(more)
          );
        } else {
          //@ts-ignore
          let file = await decodeFileId(fileId);
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
    snakeClient.log.error('Failed to running telegram.sendDocument');
    throw new BotError(
      error.message,
      'telegram.sendDocument',
      `${chatId},${
        Buffer.isBuffer(fileId) ? `<Buffer ${fileId.toString('hex')}>` : JSON.stringify(fileId)
      }${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
