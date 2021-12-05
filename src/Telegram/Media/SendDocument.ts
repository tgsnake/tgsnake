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
import { GetFileInfo } from './GetFileInfo';
import path from 'path';
import BotError from '../../Context/Error';
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
  more?: sendMediaMoreParams
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
      let file = await UploadFile(snakeClient, fileId as Buffer, {
        workers: more?.workers || 1,
        fileName: more?.fileName,
      });
      let info = await GetFileInfo(fileId as Buffer);
      let final = new Api.InputMediaUploadedDocument({
        file: new Api.InputFile({ ...file! }),
        mimeType: info?.mime || more?.mimeType || 'unknown',
        attributes: [
          new Api.DocumentAttributeFilename({
            fileName: more?.fileName || 'unknown',
          }),
        ],
      });
      return SendMedia(snakeClient, chatId, final, more);
    }
    if (typeof fileId == 'string') {
      fileId as string;
      if (/^http/i.exec(String(fileId)) || /^(\/|\.\.?\/|~\/)/i.exec(String(fileId))) {
        //@ts-ignore
        let file = await UploadFile(snakeClient, fileId, {
          workers: more?.workers || 1,
          fileName: more?.fileName,
        });
        let info = await GetFileInfo(fileId);
        let basename = path.basename(fileId);
        if (!/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim.exec(basename)) {
          basename = `${basename}.${info?.ext}`;
        }
        let final = new Api.InputMediaUploadedDocument({
          file: new Api.InputFile({ ...file! }),
          mimeType: info?.mime || more?.mimeType || 'unknown',
          attributes: [
            new Api.DocumentAttributeFilename({
              fileName: basename,
            }),
          ],
        });
        return SendMedia(snakeClient, chatId, final, more);
      }
    }
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.sendDocument';
    botError.functionArgs = `${chatId},${
      Buffer.isBuffer(fileId) ? `<Buffer ${fileId.toString('hex')}>` : JSON.stringify(fileId)
    }${more ? ',' + JSON.stringify(more) : ''}`;
    throw botError;
  }
}
