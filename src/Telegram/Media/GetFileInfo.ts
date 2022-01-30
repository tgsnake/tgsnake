// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../Client';
import { CustomFile } from 'telegram/client/uploads';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { fromBuffer, fromFile } from 'file-type';
export interface FileInfo {
  mime?: string;
  ext?: string;
  source: Buffer | string;
  fileName?: string;
}
export async function GetFileInfo(file: string | Buffer) {
  if (Buffer.isBuffer(file)) {
    let fileInfo = await fromBuffer(file);
    let r: FileInfo = Object.assign(fileInfo || {}, {
      source: file as Buffer,
    });
    return r;
  }
  if (typeof file == 'string') {
    file as string;
    let basename = path.basename(file);
    if (/^http/i.exec(file)) {
      let res = await axios.get(file, {
        responseType: 'arraybuffer',
      });
      let data: any = res.data;
      let basebuffer = Buffer.from(data, 'utf-8');
      let fileInfo = await fromBuffer(basebuffer);
      let file_name = basename;
      let match = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim.exec(file_name);
      if (!match) {
        file_name = `${file_name}.${fileInfo?.ext}`;
      }
      let r: FileInfo = Object.assign(fileInfo || {}, {
        source: basebuffer as Buffer,
        fileName: file_name,
      });
      return r;
    }
    if (/^(\/|\.\.?\/|~\/)/i.exec(file)) {
      let fileInfo = await fromFile(file);
      let file_name = basename;
      let match = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim.exec(file_name);
      if (!match) {
        file_name = `${file_name}.${fileInfo?.ext}`;
      }
      let r: FileInfo = Object.assign(fileInfo || {}, {
        source: file as string,
        fileName: file_name,
      });
      return r;
    }
  }
}
