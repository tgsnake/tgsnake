// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Telegram } from '../Telegram';
import { ResultGetEntity } from '../Telegram/Users/GetEntity';
import * as Updates from '../Update';
import { Snake } from '../Client';
import { Api } from 'telegram';
import { MessageContext } from './MessageContext';
import { Composer, run, ErrorHandler, Combine } from './Composer';
import BotError from './Error';
import { Cleaning, betterConsoleLog } from '../Utils/CleanObject';
import { EntityCache } from './EntityCache';
import { Options } from '../Interface/Options';
import { Logger } from './Logger';
import { inspect } from 'util';
export class MainContext<T = {}> extends Composer<T> {
  /** @hidden */
  private _options!: Options;
  /** @hidden */
  private _gramjsOptions!: Options;
  connected: Boolean = false;
  aboutMe!: ResultGetEntity;
  entityCache!: EntityCache;
  log!: Logger;
  /** @hidden */
  errorHandler: ErrorHandler<T> = (error, update) => {
    this.log.error(`Snake error (${error.message}) when processing update :`);
    this.log.error(update);
    this.log.error(`${error.functionName}(${error.functionArgs})`);
    throw error;
  };
  constructor() {
    super();
  }
  /** @hidden */
  [inspect.custom]() {
    return betterConsoleLog(this);
  }
  /** @hidden */
  toJSON() {
    let obj = betterConsoleLog(this);
    for (let [key, value] of Object.entries(obj)) {
      if (typeof value == 'bigint') obj[key] = String(value);
    }
    return obj;
  }
  get options() {
    return this._options;
  }
  set options(options) {
    this._options = options;
  }
  get gramjsOptions() {
    return this._gramjsOptions;
  }
  set gramjsOptions(options) {
    this._gramjsOptions = options;
  }
  async handleUpdate(update: Api.TypeUpdate | ResultGetEntity, SnakeClient: Snake) {
    if (!update) return false;
    this.use = () => {
      throw new BotError(
        `bot.use is unavailable when bot running. so kill bot first then add bot.use in your source code then running again.`,
        'Composer',
        ''
      );
    };
    let parsed: boolean = false;
    let parsedUpdate: Combine<Updates.TypeUpdate, T>;
    if (update instanceof ResultGetEntity) {
      try {
        this.log.debug('Receive update (ResultGetEntity)');
        parsed = true;
        //@ts-ignore
        parsedUpdate = update;
        await run(this.middleware(), await Cleaning(parsedUpdate!));
        return update;
      } catch (error: any | BotError) {
        //@ts-ignore
        if (error._isBotErrorClass) {
          //@ts-ignore
          return this.errorHandler(error as BotError, parsed ? parsedUpdate : update);
        }
        let botError = new BotError(
          error.message!,
          error.functionName ? error.functionName : `handleUpdate`,
          error.functionArgs ? error.functionArgs : `[Update]`
        );
        this.log.info('something is wrong,set logger to "error" to see more info.');
        //@ts-ignore
        return this.errorHandler(botError, parsed ? parsedUpdate : update);
      }
    } else if (
      update instanceof Api.UpdateShortChatMessage ||
      update instanceof Api.UpdateShortMessage
    ) {
      try {
        this.log.debug(`Receive update ${(update as Api.UpdateShortMessage).className}`);
        const difference: Api.updates.TypeDifference = await SnakeClient.client.invoke(
          new Api.updates.GetDifference({
            pts:
              (update as Api.UpdateShortMessage).pts - (update as Api.UpdateShortMessage).ptsCount,
            date: (update as Api.UpdateShortMessage).date,
            qts: -1,
          })
        );
        if (
          difference instanceof Api.updates.Difference ||
          difference instanceof Api.updates.DifferenceSlice
        ) {
          const { newMessages, otherUpdates, chats, users } = difference;
          if (newMessages) {
            for (let message of newMessages) {
              let jsonUpdate = new Updates.UpdateNewMessage();
              await jsonUpdate.init(
                new Api.UpdateNewMessage({
                  message: message,
                  pts: (update as Api.UpdateShortMessage).pts,
                  ptsCount: (update as Api.UpdateShortMessage).ptsCount,
                }),
                SnakeClient
              );
              parsed = true;
              // @ts-ignore
              parsedUpdate = jsonUpdate;
              await run(this.middleware(), await Cleaning(parsedUpdate!));
            }
          } else if (otherUpdates) {
            for (let otherUpdate of otherUpdates) {
              if (Updates[otherUpdate.className]) {
                this.log.debug(`Receive update ${otherUpdate.className}`);
                let jsonUpdate = new Updates[otherUpdate.className]();
                await jsonUpdate.init(otherUpdate, SnakeClient);
                parsed = true;
                parsedUpdate = jsonUpdate;
                await run(this.middleware(), await Cleaning(parsedUpdate!));
              }
            }
          }
        }
        return update;
      } catch (error: any | BotError) {
        //@ts-ignore
        if (error._isBotErrorClass) {
          //@ts-ignore
          return this.errorHandler(error as BotError, parsed ? parsedUpdate : update);
        }
        let botError = new BotError(
          error.message!,
          error.functionName ? error.functionName : `handleUpdate`,
          error.functionArgs ? error.functionArgs : `[Update]`
        );
        this.log.info('something is wrong,set logger to "error" to see more info.');
        //@ts-ignore
        return this.errorHandler(botError, parsed ? parsedUpdate : update);
      }
    } else {
      if (update.className) {
        if (Updates[update.className]) {
          try {
            this.log.debug(`Receive update ${update.className}`);
            let jsonUpdate = new Updates[update.className]();
            await jsonUpdate.init(update, SnakeClient);
            parsed = true;
            parsedUpdate = jsonUpdate;
            await run(this.middleware(), await Cleaning(parsedUpdate!));
            return jsonUpdate;
          } catch (error: any | BotError) {
            //@ts-ignore
            if (error._isBotErrorClass) {
              //@ts-ignore
              return this.errorHandler(error as BotError, parsed ? parsedUpdate : update);
            }
            let botError = new BotError(
              error.message!,
              error.functionName ? error.functionName : `handleUpdate`,
              error.functionArgs ? error.functionArgs : `[Update]`
            );
            this.log.info('something is wrong,set logger to "error" to see more info.');
            //@ts-ignore
            return this.errorHandler(botError, parsed ? parsedUpdate : update);
          }
        }
      }
    }
  }
  catch(errorHandler: ErrorHandler<T>) {
    this.log.debug(`Replace default error handle`);
    return (this.errorHandler = errorHandler);
  }
}
