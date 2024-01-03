/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2024 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { ErrorHandler } from '../Context/Composer.ts';

export type TypeApi =
  | 'beforeStart'
  | 'afterStart'
  | 'beforeLogin'
  | 'onLogin'
  | 'afterLogin'
  | 'onError'
  | 'beforeClose'
  | 'afterClose'
  | 'beforeParseUpdate'
  | 'onParseUpdate'
  | 'afterParseUpdate';
export type OnErrorFunction<T> = (error: any, update, next: ErrorHandler<T>) => any;
export class TgsnakeApi<T = {}> {
  _beforeStartHandler!: Array<any>;
  _afterStartHandler!: Array<any>;
  _beforeLoginHandler!: Array<any>;
  _onLoginHandler!: Array<any>;
  _afterLoginHandler!: Array<any>;
  _onErrorHandler!: Array<any>;
  _beforeCloseHandler!: Array<any>;
  _afterCloseHandler!: Array<any>;
  _beforeParseUpdateHandler!: Array<any>;
  _onParseUpdateHandler!: Array<any>;
  _afterParseUpdateHandler!: Array<any>;
  constructor() {}
  addEventHandler() {}
}
