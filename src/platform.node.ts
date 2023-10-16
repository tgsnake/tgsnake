/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import path from 'path';
import fs from 'fs';
import prompts from 'prompts';
export { Raw, Helpers, Storages, Raws, Clients, Sessions, Client, Files } from '@tgsnake/core';
export {
  Writer,
  base64_url_encode,
  FileId,
  FileType,
  ThumbnailSource,
  FileTypeUniqueId,
  PHOTO_TYPES,
  DOCUMENT_TYPES,
} from '@tgsnake/fileid';
export { Parser, type Entities } from '@tgsnake/parser';
export { Logger, TypeLogLevel } from '@tgsnake/log';
export { lookup as mimetypes } from 'mime-types';
export { Readable, Writable, Duplex } from 'stream';
export { path, prompts, fs };
export const { cwd } = process;
export const isBrowser = typeof window !== 'undefined';
export const isDeno = false;
