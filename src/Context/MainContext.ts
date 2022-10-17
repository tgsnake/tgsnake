// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Raw } from '@tgsnake/core';
import { Composer, run, ErrorHandler, Combine } from './Composer';
import { Logger } from './Logger';
import type { Snake } from '../Client/Snake';

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
    try {
      // @ts-ignore
      await run<Raw.TypeUpdate>(this.middleware(), update);
    } catch (error: any) {
      // @ts-ignore
      return this._errorHandler(error, update);
    }
  }
  catch(errorHandler: ErrorHandler<T>) {
    if (typeof errorHandler === 'function') {
      this._errorHandler = errorHandler;
    }
    return;
  }
}
