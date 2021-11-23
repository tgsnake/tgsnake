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
    if(!update) return false
    this.use = () => {
      let botError = new BotError() 
      botError.error = new Error(`bot.use is unavailable when bot running. so kill bot first then add bot.use in your source code then running again.`)
      botError.functionName = "Composer" 
      botError.functionArgs = ``
      throw botError
    }
    let parsed:boolean = false 
    let parsedUpdate:Updates.TypeUpdate
    if (update instanceof ResultGetEntity) {
      try {
        parsed = true 
        parsedUpdate = update as ResultGetEntity
        await run(this.middleware(), update as ResultGetEntity); 
        return update
      } catch (error) {
        if(error instanceof BotError){ 
          //@ts-ignore
          return this.errorHandler(error as BotError, parsed ? parsedUpdate : update);
        }
        let botError = new BotError() 
        botError.error = error 
        botError.functionName = `handleUpdate`
        botError.functionArgs = `[Update]` 
        //@ts-ignore
        return this.errorHandler(botError,parsed ? parsedUpdate : update);
      }
    } else { 
      if(update.className){
        if (Updates[update.className]) {
          try {
            let jsonUpdate = new Updates[update.className]();
            await jsonUpdate.init(update, SnakeClient);
            parsed = true 
            parsedUpdate = jsonUpdate
            await run(this.middleware(), jsonUpdate); 
            return jsonUpdate
          } catch (error) { 
            if(error instanceof BotError){ 
              //@ts-ignore
              return this.errorHandler(error as BotError, parsed ? parsedUpdate : update);
            }
            let botError = new BotError() 
            botError.error = error 
            botError.functionName = `handleUpdate`
            botError.functionArgs = `[Update]` 
            //@ts-ignore
            return this.errorHandler(botError,parsed ? parsedUpdate : update);
          }
        } 
      }
    }
  }
  catch(errorHandler: ErrorHandler) {
    this.errorHandler = errorHandler;
  }
}
