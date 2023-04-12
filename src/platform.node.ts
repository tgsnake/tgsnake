/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */

export { Raw, Helpers, Storages, Raws, Clients, Sessions, Client } from '@tgsnake/core';
export {
  Writer,
  base64_url_encode,
  FileId,
  FileType,
  ThumbnailSource,
  FileTypeUniqueId,
} from '@tgsnake/fileid';
export { Parser, type Entities } from '@tgsnake/parser';
export { Logger, TypeLogLevel } from '@tgsnake/log';
import path from 'path';
import prompts from 'prompts';
export { path, prompts };
export const { cwd } = process;
// @ts-ignore
export const isBrowser = typeof window !== 'undefined';
export const isDeno = false;
