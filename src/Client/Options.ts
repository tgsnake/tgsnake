/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { Clients, Storages } from '@tgsnake/core';
import { TypeLogLevel } from '@tgsnake/log';
import type { Snake } from './Snake';
export interface Options {
  /**
   * App id, you can create one from my.telegram.org
   */
  apiId: number;
  /**
   * App hash, you can create one from my.telegram.org
   */
  apiHash: string;
  /**
   * Login session, you can use custom session class in here.
   */
  login: LoginWithSession;
  /**
   * The logger level, it should be "debug" | "verbose" | "info" | "error" | "warn" | "none". <br/>
   *
   * default is "debug"
   */
  logLevel?: TypeLogLevel | Array<TypeLogLevel>;
  /**
   * Options for @tgsnake/core. It will be using for connection options.
   */
  clientOptions?: Clients.Client.ClientOptions;
  /**
   * Use a special plugin. The plugin must be a function that returns a boolean. For session, it won't work if you put it here, put at login options.
   */
  plugins?: Array<{ (snake: Snake): boolean | Promise<boolean> }>;
}
export interface LoginWithSession {
  /**
   * String session or import your session class.
   */
  session?: string | Storages.AbstractSession;
  /**
   * Login as bot using bot auth token from bot father. <br/>
   * Only effected when selected session is blank.
   */
  botToken?: string;
  /**
   * Force session to .session file, If session field passed as string. <br/>
   *
   * default is true.
   */
  forceDotSession?: boolean;
  /**
   * The name of session, it will be using to read .session file. <br/>
   *
   * default is "tgsnake"
   */
  sessionName?: string;
}
