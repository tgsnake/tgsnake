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

export class MainContext extends Composer {
  connected: Boolean = false;
  aboutMe!: ResultGetEntity;
  entityCache: Map<number, ResultGetEntity> = new Map();
  errorHandler: ErrorHandler = (error, update) => {
    console.log(`🐍 Snake error (${error.message}) when processing update : `);
    console.log(update);
    console.log(`🐍 ${error.functionName}(${error.functionArgs})`);
    throw error;
  };
  constructor() {
    super();
  }
  async handleUpdate(update: Api.TypeUpdate | ResultGetEntity, SnakeClient: Snake) {
    if (update instanceof ResultGetEntity) {
      try {
        return run(this.middleware(), update as ResultGetEntity);
      } catch (error) {
        let botError = new BotError();
        botError.error = error;
        botError.functionName = 'handleUpdate';
        botError.functionArgs = `[update data]`;
        //@ts-ignore
        return this.errorHandler(botError, update);
      }
    } else {
      if (Updates[update.className]) {
        try {
          let jsonUpdate = new Updates[update.className]();
          await jsonUpdate.init(update, SnakeClient);
          return run(this.middleware(), jsonUpdate);
        } catch (error) {
          let botError = new BotError();
          botError.error = error;
          botError.functionName = 'handleUpdate';
          botError.functionArgs = `[update data]`;
          //@ts-ignore
          return this.errorHandler(botError, update);
        }
      }
    }
  }
  catch(errorHandler: ErrorHandler) {
    this.errorHandler = errorHandler;
  }
}
