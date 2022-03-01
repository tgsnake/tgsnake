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
import { GetFileInfo } from './GetFileInfo';
import path from 'path';
import BotError from '../../Context/Error';
import { onProgress } from './UploadFile';
export interface sendDocumentMoreParams extends sendMediaMoreParams {
  workers?: number;
  mimeType?: string;
  fileName?: string;
  forceDocument?: boolean;
  onProgress?: onProgress;
  download?: boolean;
}
function clean(more?: sendDocumentMoreParams) {
  if (more) {
    if (more.workers !== undefined) {
      delete more.workers;
    }
    if (more.mimeType !== undefined) {
      delete more.mimeType;
    }
    if (more.fileName !== undefined) {
      delete more.fileName;
    }
    if (more.forceDocument !== undefined) {
      delete more.forceDocument;
    }
    if (more.onProgress !== undefined) {
      delete more.onProgress;
    }
    if (more.download !== undefined) {
      delete more.download;
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
  fileId: string | Buffer,
  more?: sendDocumentMoreParams
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.sendDocument`
      );
    }
    if (Buffer.isBuffer(fileId)) {
      fileId as Buffer;
      let info = await GetFileInfo(fileId as Buffer);
      //@ts-ignore
      let file = await UploadFile(snakeClient, info.source as Buffer, {
        workers: more?.workers || 1,
        fileName: more?.fileName,
        onProgress: more?.onProgress,
      });
      let final = new Api.InputMediaUploadedDocument({
        file: file!,
        mimeType: info?.mime || more?.mimeType || 'unknown',
        attributes: [
          new Api.DocumentAttributeFilename({
            fileName: more?.fileName || 'unknown',
          }),
        ],
        forceFile: more?.forceDocument || true,
      });
      return SendMedia(snakeClient, chatId, final, clean(more));
    }
    if (typeof fileId == 'string') {
      fileId as string;
      if (/^http/i.exec(String(fileId)) || /^(\/|\.\.?\/|~\/)/i.exec(String(fileId))) {
        let download = more?.download || false;
        if (/^http/i.exec(String(fileId)) && !download) {
          let file = new Api.InputMediaDocumentExternal({
            url: fileId as string,
          });
          return SendMedia(snakeClient, chatId, file, clean(more));
        }
        let info = await GetFileInfo(fileId);
        //@ts-ignore
        let file = await UploadFile(snakeClient, info.source, {
          workers: more?.workers || 1,
          fileName: more?.fileName || info?.fileName,
          onProgress: more?.onProgress,
        });
        let basename = path.basename(fileId);
        if (!/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim.exec(basename)) {
          basename = `${basename}.${info?.ext}`;
        }
        let final = new Api.InputMediaUploadedDocument({
          file: file!,
          mimeType: more?.mimeType || info?.mime || 'unknown',
          attributes: [
            new Api.DocumentAttributeFilename({
              fileName: more?.fileName || basename,
            }),
          ],
          forceFile: more?.forceDocument || true,
        });
        return SendMedia(snakeClient, chatId, final, clean(more));
      }
    }
  } catch (error: any) {
    throw new BotError(
      error.message,
      'telegram.sendDocument',
      `${chatId},${
        Buffer.isBuffer(fileId) ? `<Buffer ${fileId.toString('hex')}>` : JSON.stringify(fileId)
      }${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
