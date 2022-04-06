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
export interface sendAudioMoreParams extends sendMediaMoreParams {
  workers?: number;
  mimeType?: string;
  onProgress?: onProgress;
  download?: boolean;
  thumbnail?: Buffer | string;
  duration?: number;
  title?: string;
  performer?: string;
  filename?: string;
}
function clean(more?: sendAudioMoreParams) {
  if (more) {
    let purge = [
      'workers',
      'mimeType',
      'duration',
      'onProgress',
      'download',
      'thumbnail',
      'performer',
      'title',
      'filename',
    ];
    for (let [key] of Object.entries(more)) {
      if (purge.includes(key)) delete more[key];
    }
  }
  return more;
}
/**
 * Sending Audio
 * @param snakeClient - Client
 * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
 * @param {string|Buffer} fileId - File Location/Url/Buffer .
 * @param {Object} more - more parameters to use.
 * ```ts
 * bot.command("au",async (ctx) => {
 *     let results = await ctx.telegram.sendAudio(ctx.chat.id,"file id here")
 * })
 * ```
 */
export async function SendAudio(
  snakeClient: Snake,
  chatId: number | string | bigint,
  fileId: string | Buffer | Medias.MediaAudio,
  more?: sendAudioMoreParams
) {
  try {
    snakeClient.log.debug('Running telegram.sendAudio');
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
              onProgress: more?.onProgress,
              fileName: more?.filename,
            }),
            //@ts-ignore
            mimeType: bufferInfo.mime || more?.mimeType || 'audio/mp3',
            attributes: [
              new Api.DocumentAttributeAudio({
                duration: more?.duration ?? 0,
                voice: false,
                title: more?.title ?? 'unknown',
                performer: more?.performer ?? 'unknown',
              }),
              new Api.DocumentAttributeFilename({
                fileName: more?.filename || 'unknown',
              }),
            ],
            forceFile: false,
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
      case Medias.MediaAudio:
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
                fileName: basename,
                onProgress: more?.onProgress,
              }),
              //@ts-ignore
              mimeType: fileInfo.mime || more?.mimeType || 'audio/mp3',
              attributes: [
                new Api.DocumentAttributeAudio({
                  duration: more?.duration ?? 0,
                  voice: false,
                  title: more?.title ?? 'unknown',
                  performer: more?.performer ?? 'unknown',
                }),
                new Api.DocumentAttributeFilename({
                  fileName: more?.filename || basename || 'unknown',
                }),
              ],
              forceFile: false,
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
          if (file.typeId !== 9) throw new Error(`Invalid fileId. This fileId not for audio`);
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
    snakeClient.log.error('Failed to running telegram.sendAudio');
    throw new BotError(
      error.message,
      'telegram.sendAudio',
      `${chatId},${
        Buffer.isBuffer(fileId) ? `<Buffer ${fileId.toString('hex')}>` : JSON.stringify(fileId)
      }${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
