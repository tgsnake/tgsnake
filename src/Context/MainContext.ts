// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2023 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Raw, Raws } from '../platform.deno.ts';
import { Composer, run, ErrorHandler, Combine } from './Composer.ts';
import { Logger } from './Logger.ts';
import { Update } from '../TL/Updates/Update.ts';
import type { Snake } from '../Client/Snake.ts';

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
  async handleUpdate(update: Raw.TypeUpdates, client: Snake) {
    if (!update) return false;
    Logger.debug(`Receive update: ${update.className}`);
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
  async parseUpdate(update: Raw.TypeUpdates, client: Snake): Promise<Array<object>> {
    // Why Promise<Array<object>> ? because the return of parseUpdate is can by anything, but it must be a class or json object.
    // Possible plugin for make their own parse function.
    const parsedUpdate: Array<Update | Raw.TypeUpdates> = [];
    if (update instanceof Raw.Updates || update instanceof Raw.UpdatesCombined) {
      const { updates, chats, users } = update;
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
    } else if (
      update instanceof Raw.UpdateShortMessage ||
      update instanceof Raw.UpdateShortChatMessage
    ) {
      const difference = await client.api.invoke(
        new Raw.updates.GetDifference({
          pts: update.pts - update.ptsCount,
          date: update.date,
          qts: -1,
        })
      );
      const { newMessages, otherUpdates, chats, users } = difference;
      const filterChats: Array<TypeChat> = chats.filter((chat): chat is TypeChat => {
        if (chat instanceof Raw.Chat) return true;
        if (chat instanceof Raw.Channel) return true;
        return false;
      });
      const filterUsers: Array<TypeUser> = users.filter((user): user is TypeUser => {
        return user instanceof Raw.User;
      });
      if (newMessages) {
        parsedUpdate.push(
          await Update.parse(
            client,
            new Raw.UpdateNewMessage({
              message: newMessages[0],
              pts: update.pts,
              ptsCount: update.ptsCount,
            }),
            filterChats,
            filterUsers
          )
        );
      } else if (otherUpdates) {
        parsedUpdate.push(await Update.parse(client, otherUpdates, filterChats, filterUsers));
      }
    } else if (update instanceof Raw.UpdateShort) {
      parsedUpdate.push(await Update.parse(client, update.update, [], []));
    }
    parsedUpdate.push(update);
    return parsedUpdate;
  }
  catch(errorHandler: ErrorHandler<T>) {
    if (typeof errorHandler === 'function') {
      this._errorHandler = errorHandler;
    }
    return;
  }
}
