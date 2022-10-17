/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { exec } from 'child_process';

// adapted from https://stackoverflow.com/a/49013356
export function open(url: string) {
  if (process.platform === 'darwin') {
    return exec(`open ${url}`);
  }
  if (process.platform === 'win32') {
    return exec(`start ${url}`);
  }
  return exec(`xdg-open ${url}`);
}
