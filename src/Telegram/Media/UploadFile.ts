// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
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
import {fileTypeFromBuffer,fileTypeFromFile} from 'file-type';
import { Snake } from '../../client';
import BotError from '../../Context/Error';
export interface uploadFileMoreParams {
  fileName?: string;
  workers?: number;
  onProgress?: onProgress;
}
interface onProgress {
  (progress: number): void;
  isCanceled?: boolean;
}
class ResultUploadFile {
  id!: Api.long;
  parts!: number;
  name!: string;
  md5Checksum!: string;
  constructor(resultUploadFile: Api.InputFile | Api.InputFileBig) {
    this.id = resultUploadFile.id;
    this.parts = resultUploadFile.parts;
    this.name = resultUploadFile.name;
    this.md5Checksum = '';
    if (resultUploadFile instanceof Api.InputFile) {
      this.md5Checksum = resultUploadFile.md5Checksum || '';
    }
  }
}
export async function UploadFile(
  snakeClient: Snake,
  file: string | Buffer,
  more?: uploadFileMoreParams
):Promise<ResultUploadFile|undefined>{
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      console.log(
        '\x1b[31m',
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.uploadFile`,
        '\x1b[0m'
      );
    }
    if (Buffer.isBuffer(file)) {
      let fileInfo = await fileTypeFromBuffer(file);
      //if (fileInfo) {
      let file_name = more?.fileName || `${Date.now() / 1000}.${fileInfo?.ext}`;
      let toUpload = new CustomFile(file_name, Buffer.byteLength(file), '', file);
      return new ResultUploadFile(
        await snakeClient.client.uploadFile({
          file: toUpload,
          workers: more?.workers || 1,
          onProgress: more?.onProgress,
        })
      );
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
          let fileInfo = await fileTypeFromBuffer(basebuffer);
          if (fileInfo) {
            file_name = `${file_name}.${fileInfo.ext}`;
          }
        }
        let toUpload = new CustomFile(file_name, Buffer.byteLength(basebuffer), '', basebuffer);
        return new ResultUploadFile(
          await snakeClient.client.uploadFile({
            file: toUpload,
            workers: more?.workers || 1,
            onProgress: more?.onProgress,
          })
        );
      }
      if (/^(\/|\.\.?\/|~\/)/i.exec(file)) {
        let file_name = more?.fileName || basename;
        let match = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim.exec(file_name);
        if (!match) {
          let fileInfo = await fileTypeFromFile(file);
          if (fileInfo) {
            file_name = `${file_name}.${fileInfo.ext}`;
          }
        }
        let toUpload = new CustomFile(file_name, fs.statSync(file).size, file);
        return new ResultUploadFile(
          await snakeClient.client.uploadFile({
            file: toUpload,
            workers: more?.workers || 1,
            onProgress: more?.onProgress,
          })
        );
      }
    }
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.uploadFile';
    botError.functionArgs = `${Buffer.isBuffer(file) ? `<Buffer ${file.toString('hex')}>` : file}${
      more ? ',' + JSON.stringify(more) : ''
    }`;
    throw botError;
  }
}
