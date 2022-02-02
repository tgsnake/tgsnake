// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { StringSession, StoreSession } from 'telegram/sessions';
import { SnakeSession } from './SnakeSession';
import { Api } from 'telegram';
import BotError from '../Context/Error';
export async function ConvertString(session: string, sessionName: string) {
  let stringsession = new StringSession(session);
  if (sessionName !== '' && session !== '') {
    let storesession = new SnakeSession(sessionName);
    await stringsession.load();
    storesession.setDC(stringsession.dcId, stringsession.serverAddress!, stringsession.port!);
    storesession.setAuthKey(stringsession.authKey);
    return storesession;
  } else {
    return stringsession;
  }
}
export async function ConvertStore(sessionName: string) {
  let stringsession = new StringSession('');
  if (sessionName !== '') {
    let storesession = new SnakeSession(sessionName);
    await storesession.load();
    stringsession.setDC(storesession.dcId, storesession.serverAddress!, storesession.port!);
    stringsession.setAuthKey(storesession.authKey!);
    return stringsession;
  }
  return stringsession;
}
