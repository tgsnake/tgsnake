// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import { CustomFile } from 'telegram/client/uploads';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import {fromBuffer,fromFile} from 'file-type';

export async function GetFileInfo(file: string | Buffer){
  if (Buffer.isBuffer(file)) {
    let fileInfo = await fromBuffer(file);
    return fileInfo;
  }
  if (typeof file == 'string') {
    file as string;
    if (/^http/i.exec(file)) {
      let res = await axios.get(file, {
        responseType: 'arraybuffer',
      });
      let data: any = res.data;
      let basebuffer = Buffer.from(data, 'utf-8');
      let fileInfo = await fromBuffer(basebuffer);
      return fileInfo;
    }
    if (/^(\/|\.\.?\/|~\/)/i.exec(file)) {
      let fileInfo = await fromFile(file);
      return fileInfo;
    }
  }
}
