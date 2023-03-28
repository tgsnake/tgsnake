// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2023 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Raw } from '@tgsnake/core';
import { Composer, run, ErrorHandler, Combine } from './Composer';
import { Logger } from './Logger';
import { Update } from '../TL/Updates/Update';
import type { Snake } from '../Client/Snake';

type TypeChat = Raw.Chat | Raw.Channel;
type TypeUser = Raw.User;
export class MainContext<T = {}> extends Composer<T> {
  /** @hidden */
  protected _errorHandler: ErrorHandler<T> = (error, update) => {
    Logger.error(`Snake error (${error.message}) when processing update :`);
    Logger.error(update);
    throw error;
  };
  constructor() {
    super();
  }
  async handleUpdate(update: Raw.TypeUpdate, client: Snake) {
    if (!update) return false;
    this.use = () => {
      throw new Error(
        `bot.use is unavailable when bot running. so kill bot first then add bot.use in your source code then running again.`
      );
    };
    const parsed = await this.parseUpdate(update, client);
    for (const _update of parsed) {
      try {
        // @ts-ignore
        await run<Update>(this.middleware(), _update);
      } catch (error: any) {
        // @ts-ignore
        return this._errorHandler(error, _update);
      }
    }
  }
  async parseUpdate(update: Raw.TypeUpdate, client: Snake): Promise<Array<object>> {
    // Why Promise<Array<object>> ? because the return of parseUpdate is can by anything, but it must be a class or json object.
    // Possible plugin for make their own parse function.
    const parsedUpdate: Array<Update> = [];
    if (update instanceof Raw.Updates) {
      const { updates, chats, users } = update as Raw.Updates;
      const filterChats: Array<TypeChat> = chats.filter((chat): chat is TypeChat => {
        if (chat instanceof Raw.Chat) return true;
        if (chat instanceof Raw.Channel) return true;
        return false;
      });
      const filterUsers: Array<TypeUser> = users.filter((user): user is TypeUser => {
        return user instanceof Raw.User;
      });
      for (const _update of updates) {
        parsedUpdate.push(await Update.parse(client, _update, filterChats, filterUsers));
      }
    }
    return parsedUpdate;
  }
  catch(errorHandler: ErrorHandler<T>) {
    if (typeof errorHandler === 'function') {
      this._errorHandler = errorHandler;
    }
    return;
  }
}
