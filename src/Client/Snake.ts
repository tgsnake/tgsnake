/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { Raw, Client, Storages } from '@tgsnake/core';
import { TypeLogLevel } from '@tgsnake/log';
import fs from 'fs';
import path from 'path';
import { SnakeSession, generateName } from './SnakeSession';
import { Options } from './Options';
import { LoginWithCLI } from './Login/Cli';
import { LoginWithWebPage } from './Login/WebPage';
import * as Version from '../Version';
import { Logger, MainContext } from '../Context';

export class Snake extends MainContext {
  _options!: Options;
  _client!: Client;
  constructor(options?: Options) {
    super();
    Logger.log(`Welcome to the jungle!`);
    Logger.log(`Using version: ${Version.version} - ${Version.getType()}`);
    Logger.log(`Thanks for using tgsnake`);
    if (!options) {
      if (fs.existsSync(path.join(process.cwd(), 'tgsnake.config.js'))) {
        Logger.info(`Found config file: ${path.join(process.cwd(), 'tgsnake.config.js')}`);
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
          useWebPage: {
            port: 8000,
            autoOpen: true,
          },
          logLevel: ['debug'],
        },
        options
      );
      if (typeof options.useWebPage === 'boolean') {
        if (options.useWebPage) {
          this._options.useWebPage = {
            port: 8000,
            autoOpen: true,
          };
        }
      }
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
              if (!options.login.sessionName) {
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
      if (typeof this._options.logLevel === 'string') {
        this._options.logLevel = String(this._options?.logLevel).split('|') as Array<TypeLogLevel>;
      }
      // @ts-ignore
      Logger.setLogLevel(this._options.logLevel);
    }
  }
  async run() {
    process.on('SIGINT', async () => {
      Logger.info('Saving session before killed.');
      // @ts-ignore
      await this._options.login.session.save();
      return process.exit();
    });
    process.on('SIGTERM', async () => {
      Logger.info('Saving session before killed.');
      // @ts-ignore
      await this._options.login.session.save();
      return process.exit();
    });
    console.log(this._options);
    if (this._options.useWebPage) {
      await LoginWithWebPage(this);
    } else {
      await LoginWithCLI(this);
    }
    return true;
  }
}
