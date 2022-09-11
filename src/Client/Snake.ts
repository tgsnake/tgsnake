/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { Logger, MainContext } from '../Context';
import { Raw, Client, Storages } from '@tgsnake/core';
import { SnakeSession, generateName } from './SnakeSession';
import { Options } from './Options';
import { LoginWithCLI } from './Login/Cli';
import fs from 'fs';
import path from 'path';
import * as Version from "../Version"

export class Snake extends MainContext {
  _options!: Options;
  _client!: Client;
  constructor(options?: Options) {
    super();
    Logger.log(`Welcome to the jungle!`)
    Logger.log(`Using version: ${Version.version} - ${Version.getType()}`);
    Logger.log(`Thanks for using tgsnake`)
    if (!options) {
      if (fs.existsSync(path.join(process.cwd(), 'tgsnake.config.js'))) {
        Logger.info('Found config file: tgsnake.config.js');
        options = require(path.join(process.cwd(), 'tgsnake.config.js'));
      } else {
        // @ts-ignore
        options = {};
      }
    }
    if (options) {
      // assign field of _options.
      this._options = Object.assign(
        {
          useWebPage: true,
          logLevel: 'debug',
        },
        options
      );
      // assign default app version.
      this._options.clientOptions = Object.assign(
        {
          appVersion: '3.0.0',
        },
        this._options.clientOptions
      );
      // assign default login options
      this._options.login = Object.assign(
        {
          session: '',
          forceDotSession: true,
          sessionName: 'tgsnake',
        },
        this._options.login
      );
      // validate session.
    if (this._options.login.session !== undefined) {
      if (typeof this._options.login.session === 'string') {
        this._options.login.session as string;
        if (this._options.login.session === '') {
          if (this._options.login.forceDotSession) {
            if(!options.login.sessionName){
              this._options.login.sessionName = generateName(this._options.login.sessionName!);
              Logger.info(
                `Creating \`${this._options.login.sessionName}\` dot session. Change default sessionName to \`${this._options.login.sessionName}\` for login in next time.`
              );
            }
            this._options.login.session = new SnakeSession(this._options.login.sessionName!);
          } else {
            this._options.login.session = new Storages.StringSession(this._options.login.session);
          }
        } else {
          const _session = new Storages.StringSession(this._options.login.session);
          if (this._options.login.forceDotSession) {
            this._options.login.sessionName = generateName(this._options.login.sessionName!);
            Logger.info(
              `Creating \`${this._options.login.sessionName}\` dot session. Change default sessionName to \`${this._options.login.sessionName}\` for login in next time.`
            );
            this._options.login.session = new SnakeSession(this._options.login.sessionName!);
            _session.move(this._options.login.session);
          } else {
            this._options.login.session = _session;
          }
        }
      }
    }
      // setting up a log level
      // @ts-ignore
      Logger.setLogLevel(String(this._options.logLevel).toLowerCase());
    }
  }
  async run() {
    if (this._options.useWebPage) {
    } else {
      await LoginWithCLI(this);
    }
    return true;
  }
}
