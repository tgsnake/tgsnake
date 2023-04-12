/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import {
  Raw,
  Client,
  Storages,
  Clients,
  Sessions,
  TypeLogLevel,
  path,
  cwd,
  isDeno,
} from '../platform.deno.ts';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { SnakeSession, generateName } from './SnakeSession.ts';
import { Options, LoginWithSession } from './Options.ts';
import { LoginWithCLI } from './Login/Cli.ts';
import * as Version from '../Version.deno.ts';
import { Logger, MainContext } from '../Context/index.ts';
import { Telegram } from '../Methods/Telegram.ts';
import type { Message } from '../TL/Messages/Message.ts';

export class Snake extends MainContext {
  _options!: Options;
  _client!: Client;
  _cacheMessage!: Map<bigint, Map<number, Message>>;
  _me!: Raw.User;
  _rndMsgId!: Sessions.MsgId;
  api!: Telegram;
  constructor(options?: Options) {
    super();
    Logger.log(`Welcome to tgsnake!`);
    Logger.log(`Using version: ${Version.version} - ${Version.getType()}`);
    Logger.log(`Thanks for using tgsnake`);
    if (isDeno) {
    }
    if (!options) {
      if (fs.existsSync(path.join(cwd(), 'tgsnake.config.js'))) {
        Logger.info(`Found config file: ${path.join(cwd(), 'tgsnake.config.js')}`);
        if (isDeno) {
          const require = createRequire(import.meta.url);
          options = require(path.join(cwd(), 'tgsnake.config.js'));
        } else {
          options = require(path.join(cwd(), 'tgsnake.config.js'));
        }
      } else {
        // @ts-ignore
        options = {};
      }
    }
    if (options) {
      // assign field of _options.
      this._options = Object.assign(
        {
          logLevel: ['debug'],
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
    this._cacheMessage = new Map();
    this.api = new Telegram(this);
    this._rndMsgId = new Sessions.MsgId();
  }
  async run() {
    if (isDeno) {
      // @ts-ignore
      Deno.addSignalListener('SIGINT', async () => {
        Logger.info('Saving session before killed.');
        // @ts-ignore
        await this._options.login.session.save();
        // @ts-ignore
        return Deno.exit();
      });
      // @ts-ignore
      Deno.addSignalListener('SIGTERM', async () => {
        Logger.info('Saving session before killed.');
        // @ts-ignore
        await this._options.login.session.save();
        // @ts-ignore
        return Deno.exit();
      });
    } else {
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
    }
    let hasLoginPlugin = false;
    if (this._options.plugins && this._options.plugins?.length) {
      for (const plugin of this._options.plugins) {
        if (typeof plugin === 'function') {
          if (/^Login/.test(plugin.name)) {
            if (!hasLoginPlugin) {
              // prevent multiple plugin with same function
              hasLoginPlugin = true;
              try {
                let user = await plugin(this);
                if (user) {
                  this._me = (user as unknown as Raw.users.UserFull).users[0] as Raw.User;
                }
              } catch (error: any) {
                Logger.error(`Failed to running ${plugin.name}`, error);
              }
            }
          } else {
            try {
              await plugin(this);
            } catch (error: any) {
              Logger.error(`Failed to running ${plugin.name}`, error);
            }
          }
        }
      }
    }
    if (!hasLoginPlugin) {
      let user = await LoginWithCLI(this);
      if (user) {
        this._me = (user as Raw.users.UserFull).users[0] as Raw.User;
      }
    }
    this._client.addHandler((update) => this.handleUpdate(update, this));
    Logger.info('Client is running');
    if (this._me) {
      Logger.log(
        `Loggined as : ${
          this._me.lastName ? `${this._me.firstName} ${this._me.lastName}` : this._me.firstName
        } - ${this._me.id}`
      );
    }
    return true;
  }
}
