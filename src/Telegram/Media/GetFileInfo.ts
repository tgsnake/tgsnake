// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
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
import FileType from 'file-type';

export async function GetFileInfo(file: string) {
  if (/^http/i.exec(file)) {
    let res = await axios.get(file, {
      responseType: 'arraybuffer',
    });
    let data: any = res.data;
    let basebuffer = Buffer.from(data, 'utf-8');
    let fileInfo = await FileType.fromBuffer(basebuffer);
    return fileInfo;
  }
  if (/^(\/|\.\.?\/|~\/)/i.exec(file)) {
    let fileInfo = await FileType.fromFile(file);
    return fileInfo;
  }
}
