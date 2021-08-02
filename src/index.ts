// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

/**
 * TgSnake client.
 * @example
 * ```ts
 * import {Snake} from "tgsnake"
 * ```
 */
export { Snake } from './snake/client';
/**
 * Helpers modules to filters text.
 * @example
 * ```ts
 * import {Filters} from "tgsnake"
 * ```
 */
export { Filters } from './snake/filters';
/**
 * Create Shortcut or ctx.
 * @example
 * ```ts
 * import {Shortcut} from "tgsnake"
 * ```
 */
export { Shortcut } from './snake/shortcut';
/**
 * Create Method.
 * @example
 * ```ts
 * import {Telegram} from "tgsnake"
 * ```
 */
export { Telegram } from './snake/tele';
/**
 * Helpers modules to rewrite results.
 * @example
 * ```ts
 * import {GenerateResult} from "tgsnake"
 * ```
 */
export * as GenerateResult from './snake/rewriteresults';
/**
 * Helpers modules to rewrite json.
 * @example
 * ```ts
 * import {GenerateJson} from "tgsnake"
 * ```
 */
export * as GenerateJson from './snake/rewritejson';
export * as Interface from './snake/interface';
// importing gramjs
import { Api } from 'telegram/tl';
import * as Tl from 'telegram/tl';
import * as Helpers from 'telegram/Helpers';
import * as Password from 'telegram/Password';
import * as Utils from 'telegram/Utils';
import * as EntityCache from 'telegram/entityCache';
import * as Version from 'telegram/Version';
import * as TelegramClient from 'telegram/client/TelegramClient';
import * as Uploads from 'telegram/client/uploads';
import * as MessageParse from 'telegram/client/messageParse';
/**
 * Exporting Gramjs Modules.
 * To import gramjs modules you can use this.
 * @example
 * ```ts
 * import {GramJs} from "tgsnake"
 * ```
 */
export let GramJs = {
  Api,
  Tl,
  Helpers,
  Password,
  Utils,
  Version,
  TelegramClient,
  Uploads,
  MessageParse,
};
