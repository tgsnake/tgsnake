// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Telegram } from '../Telegram';
import { ResultGetEntity } from '../Telegram/Users/GetEntity';
import * as Updates from '../Update';
import { Snake } from '../client';
import { Api } from 'telegram';
import { MessageContext } from './MessageContext';
import { Composer, run, ErrorHandler } from './Composer';
import BotError from './Error';
import { Cleaning } from '../Utils/CleanObject';
import chalk from 'chalk';
export type LoggerInfo = (...args: Array<any>) => void;
import * as NodeUtil from 'util';
export class MainContext extends Composer {
  connected: Boolean = false;
  aboutMe!: ResultGetEntity;
  entityCache: Map<bigint, ResultGetEntity> = new Map();
  tgSnakeLog: boolean = true;
  consoleColor!: string;
  log: LoggerInfo = (...args: Array<any>) => {
    if (this.tgSnakeLog) {
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
  async handleUpdate(update: Api.TypeUpdate | ResultGetEntity, SnakeClient: Snake) {
    if (!update) return false;
    update = await Cleaning(update);
    this.use = () => {
      let botError = new BotError();
      botError.error = new Error(
        `bot.use is unavailable when bot running. so kill bot first then add bot.use in your source code then running again.`
      );
      botError.functionName = 'Composer';
      botError.functionArgs = ``;
      throw botError;
    };
    let parsed: boolean = false;
    let parsedUpdate: Updates.TypeUpdate;
    if (update instanceof ResultGetEntity) {
      try {
        parsed = true;
        parsedUpdate = update as ResultGetEntity;
        await run(this.middleware(), update as ResultGetEntity);
        return update;
      } catch (error) {
        if (error instanceof BotError) {
          //@ts-ignore
          return this.errorHandler(error as BotError, parsed ? parsedUpdate : update);
        }
        let botError = new BotError();
        botError.error = error;
        botError.functionName = `handleUpdate`;
        botError.functionArgs = `[Update]`;
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
            await run(this.middleware(), jsonUpdate);
            return jsonUpdate;
          } catch (error) {
            if (error instanceof BotError) {
              //@ts-ignore
              return this.errorHandler(error as BotError, parsed ? parsedUpdate : update);
            }
            let botError = new BotError();
            botError.error = error;
            botError.functionName = `handleUpdate`;
            botError.functionArgs = `[Update]`;
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
