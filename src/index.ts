// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

export { Snake } from './snake/client';
export { Telegram } from './snake/Telegram';
export * as Wizard from './snake/wizard';
export * as Update from './snake/Update';
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
