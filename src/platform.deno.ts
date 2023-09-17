/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */

export {
  Raw,
  Helpers,
  Storages,
  Raws,
  Clients,
  Sessions,
  Client,
} from 'https://deno.land/x/tgsnake_core@1.10.1/src/index.ts';
export {
  Writer,
  base64_url_encode,
  FileId,
  FileType,
  ThumbnailSource,
  FileTypeUniqueId,
} from 'https://deno.land/x/tgsnake_fileid@2.1.0/src/index.ts';
export { Parser, type Entities } from 'https://deno.land/x/tgsnake_parser@2.0.2/src/index.ts';
export { Logger, type TypeLogLevel } from 'https://deno.land/x/tgsnake_log@1.4.1/src/index.ts';
import * as path from 'https://deno.land/std@0.182.0/path/mod.ts';
import prompts from 'https://esm.sh/prompts@2.4.2';
export { path, prompts };
export const { cwd } = Deno;
export const isBrowser = false;
export const isDeno = true;

import * as buffer from 'node:buffer';
declare var Buffer: buffer.Buffer;
Object.defineProperty(globalThis, 'Buffer', {
  enumerable: false,
  configurable: false,
  writable: true,
  value: buffer.Buffer,
});
