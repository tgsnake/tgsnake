/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { Logger, TypeLogLevel } from '@tgsnake/log';
const log = new Logger({
  name: 'tgsnake',
  level: ['debug'] as Array<TypeLogLevel>,
});

export { log as Logger };
