// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { CustomFile } from 'telegram/client/uploads';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { Snake } from '../../Client';
import BotError from '../../Context/Error';
import { fromBuffer, fromFile } from 'file-type';
export interface uploadFileMoreParams {
  fileName?: string;
  workers?: number;
  onProgress?: onProgress;
}
export interface onProgress {
  (progress: number): void;
  isCanceled?: boolean;
}
export function inRange(x: number, min: number, max: number) {
  return (x - min) * (x - max) <= 0;
}
export async function UploadFile(
  snakeClient: Snake,
  file: string | Buffer,
  more?: uploadFileMoreParams
): Promise<Api.InputFile | Api.InputFileBig | undefined> {
  try {
    snakeClient.log.debug('Running telegram.uploadFile');
    if (more?.workers !== undefined) {
      if (!inRange(more?.workers!, 1, 16)) {
        snakeClient.log.warning(
          `Workers (${more.workers}) out of range (1 <= workers <= 16). Chances are this will make tgsnake unstable.`
        );
      }
    }
    if (Buffer.isBuffer(file)) {
      let fileInfo = await fromBuffer(file);
      //if (fileInfo) {
      let file_name = more?.fileName || `${Date.now() / 1000}.${fileInfo?.ext}`;
      let toUpload = new CustomFile(file_name, Buffer.byteLength(file), '', file);
      return snakeClient.client.uploadFile({
        file: toUpload,
        workers: more?.workers || 1,
        onProgress: more?.onProgress,
      });
      //}
    } else {
      let basename = path.basename(file);
      if (/^http/i.exec(file)) {
        let res = await axios.get(file, {
          responseType: 'arraybuffer',
        });
        let data: any = res.data;
        let basebuffer = Buffer.from(data, 'utf-8');
        let file_name = more?.fileName || basename;
        let match = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim.exec(file_name);
        if (!match) {
          let fileInfo = await fromBuffer(basebuffer);
          if (fileInfo) {
            file_name = `${file_name}.${fileInfo.ext}`;
          }
        }
        let toUpload = new CustomFile(file_name, Buffer.byteLength(basebuffer), '', basebuffer);
        return await snakeClient.client.uploadFile({
          file: toUpload,
          workers: more?.workers || 1,
          onProgress: more?.onProgress,
        });
      }
      if (/^(\/|\.\.?\/|~\/)/i.exec(file)) {
        let file_name = more?.fileName || basename;
        let match = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim.exec(file_name);
        if (!match) {
          let fileInfo = await fromFile(file);
          if (fileInfo) {
            file_name = `${file_name}.${fileInfo.ext}`;
          }
        }
        let toUpload = new CustomFile(file_name, fs.statSync(file).size, file);
        return await snakeClient.client.uploadFile({
          file: toUpload,
          workers: more?.workers || 1,
          onProgress: more?.onProgress,
        });
      }
    }
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.uploadFile');
    throw new BotError(
      error.message,
      'telegram.uploadFile',
      `${Buffer.isBuffer(file) ? `<Buffer ${file.toString('hex')}>` : file}${
        more ? ',' + JSON.stringify(more) : ''
      }`
    );
  }
}
