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
  private _options!: Options;
  private _gramjsOptions!: Options;
  connected: Boolean = false;
  aboutMe!: ResultGetEntity;
  entityCache!: EntityCache;
  consoleColor!: string;
  log!: Logger;
  errorHandler: ErrorHandler<T> = (error, update) => {
    this.log.error(`Snake error (${error.message}) when processing update :`);
    this.log.error(update);
    this.log.error(`${error.functionName}(${error.functionArgs})`);
    throw error;
  };
  constructor() {
    super();
  }
  [inspect.custom]() {
    return betterConsoleLog(this);
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
    update = await Cleaning(update);
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
        await run(this.middleware(), parsedUpdate!);
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
            await run(this.middleware(), parsedUpdate!);
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
