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
import { Composer, run, ErrorHandler } from './Composer';
import BotError from './Error';
import { Cleaning } from '../Utils/CleanObject';
import chalk from 'chalk';
import { EntityCache } from './EntityCache';
import * as NodeUtil from 'util';
import fs from 'fs';
export type LoggerInfo = (...args: Array<any>) => void;
export class MainContext extends Composer {
  private _options!: Options;
  private _gramjsOptions!: Options;
  connected: Boolean = false;
  aboutMe!: ResultGetEntity;
  entityCache!: EntityCache;
  consoleColor!: string;
  log: LoggerInfo = (...args: Array<any>) => {
    if (this._options.tgsnakeLog) {
      if (args.length > 1) {
        let fargs: Array<any> = new Array();
        for (let arg of args) {
          if (typeof arg == 'object') {
            fargs.push(
              NodeUtil.inspect(arg, {
                showHidden: true,
                colors: true,
              })
            );
          } else {
            fargs.push(arg);
          }
        }
        console.log(chalk[this.consoleColor](...fargs));
      } else {
        let fargs: Array<any> = new Array();
        if (typeof args[0] == 'object') {
          fargs.push(
            NodeUtil.inspect(args[0], {
              showHidden: true,
              colors: true,
            })
          );
        } else {
          fargs.push(args[0]);
        }
        console.log(chalk[this.consoleColor](...fargs));
      }
    }
    return args;
  };
  errorHandler: ErrorHandler = (error, update) => {
    this.consoleColor = 'red';
    this.log(`🐍 Snake error (${error.message}) when processing update : `);
    this.consoleColor = 'reset';
    this.log(update);
    this.consoleColor = 'red';
    this.log(`🐍 ${error.functionName}(${error.functionArgs})`);
    this.consoleColor = 'green';
    throw error;
  };
  constructor() {
    super();
  }
  get options () {
    return this._options
  }
  set options (options) {
    this._options = options
  }
  get gramjsOptions (){
    return this._gramjsOptions
  }
  set gramjsOptions(options){
    this._gramjsOptions = options
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
    let parsedUpdate: Updates.TypeUpdate;
    if (update instanceof ResultGetEntity) {
      try {
        parsed = true;
        parsedUpdate = update as ResultGetEntity;
        await run(this.middleware(), parsedUpdate as ResultGetEntity);
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
        //@ts-ignore
        return this.errorHandler(botError, parsed ? parsedUpdate : update);
      }
    } else {
      if (update.className) {
        if (Updates[update.className]) {
          try {
            let jsonUpdate = new Updates[update.className]();
            await jsonUpdate.init(update, SnakeClient);
            parsed = true;
            parsedUpdate = jsonUpdate;
            await run(this.middleware(), parsedUpdate);
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
            //@ts-ignore
            return this.errorHandler(botError, parsed ? parsedUpdate : update);
          }
        }
      }
    }
  }
  catch(errorHandler: ErrorHandler) {
    return (this.errorHandler = errorHandler);
  }
}
