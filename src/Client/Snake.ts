// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { LogLevel } from 'telegram/extensions/Logger';
import { TelegramClient } from 'telegram';
import { StringSession, StoreSession } from 'telegram/sessions';
import { Telegram } from '../Telegram';
import { MainContext } from '../Context/MainContext';
import { Options } from '../Interface/Options';
import { ConvertString, ConvertStore } from './ConvertSession';
import BotError from '../Context/Error';
import prompts from 'prompts';
import { Api } from 'telegram';
import fs from 'fs';
import { EntityCache } from '../Context/EntityCache';
import { SnakeEvent, InterfaceSnakeEvent } from '../Events';
import { SnakeSession } from './SnakeSession';
import { Logger } from '../Context/Logger';
export class Snake<T = {}> extends MainContext<T> {
  private _client!: TelegramClient;
  private _telegram!: Telegram;
  private _version: string = '2.0.0-beta.17';
  private _connectTime: number = 0;
  private _freshStore: boolean = false;
  private intervalCT!: any;
  constructor(options?: Options) {
    super();
    let _options: Options = {};
    if (options) {
      _options = options;
    } else {
      let dir = fs.readdirSync(process.cwd());
      if (dir.includes('tgsnake.config.js')) {
        let config = require(`${process.cwd()}/tgsnake.config.js`);
        _options = config;
      } else if (dir.includes('tgsnake.config.json')) {
        let config = JSON.parse(fs.readFileSync(`${process.cwd()}/tgsnake.config.js`, 'utf8'));
        _options = config;
      }
    }
    let version = _options.appVersion || this._version;
    let str: RegExpExecArray = /^(\d+\.)?(\d+\.)?(\*|\d+)/gm.exec(version) as RegExpExecArray;
    let go: Options = {};
    for (let [key, value] of Object.entries(_options)) {
      let purge = [
        'logger',
        'apiHash',
        'apiId',
        'session',
        'storeSession',
        'botToken',
        'tgSnakeLog',
        'sessionName',
      ];
      if (!purge.includes(key)) {
        go[key] = value;
        delete _options[key];
      }
    }
    this.gramjsOptions = Object.assign(
      {
        requestRetries: 5,
        connectionRetries: 5,
        downloadRetries: 5,
        retryDelay: 1000,
        autoReconnect: true,
        floodSleepThreshold: 60,
        useWSS: false,
        appVersion: str[0] || '1.0.0',
      },
      go
    );
    this.options = Object.assign(
      {
        tgsnakeLog: true,
        logger: 'error',
        sessionName: 'tgsnake',
        storeSession: true,
        session: '',
      },
      _options
    );
    this.log = new Logger(this.options.logger!, this.options.tgsnakeLog!);
    this.entityCache = new EntityCache(this.options.sessionName!);
    this.log.debug('Load Entities from local cache');
    this.entityCache.load();
  }
  get telegram() {
    return this._telegram;
  }
  get client() {
    return this._client;
  }
  get version() {
    return this._version;
  }
  get logger() {
    return String(this.options.logger);
  }
  get connectTime() {
    let date = new Date(this._connectTime * 1000).toISOString().substr(9, 10).replace(/t/i, ':');
    let spl = date.split(':');
    // days:hours:minutes:seconds
    return `${Number(spl[0]) - 1}:${spl[1]}:${spl[2]}:${spl[3]}`;
  }
  async restart() {
    let d = Date.now();
    this.log.debug(`Restarting after [${this.connectTime}] connected.`);
    this._connectTime = 0;
    this.connected = false;
    await clearInterval(this.intervalCT);
    if (this.entityCache) this.entityCache.save();
    await this.client.disconnect();
    await this.run();
    let p = Date.now();
    let ping = Number((p - d) / 1000).toFixed(3);
    return `${ping} s`;
  }
  private async _createSession() {
    this.log.debug('Creating session');
    if (this.options.storeSession) {
      if (this.options.session !== '') {
        return await ConvertString(this.options.session!, this.options.sessionName!, this);
      }
      let session = new SnakeSession(this.options.sessionName!, this);
      await session.load();
      if (!session.authKey) {
        this._freshStore = true;
      }
      return session;
    }
    return new StringSession(this.options.session!);
  }
  private async _start() {
    this.log.log(`🐍 Welcome To TGSNAKE ${this.version}.`);
    this.log.log(`🐍 Setting Logger level to "${this.options.logger}"`);
    let _ask = async () => {
      let loginAsBot = await prompts({
        type: 'confirm',
        name: 'value',
        initial: false,
        message: '🐍 Login as bot?',
      });
      if (loginAsBot.value) {
        this.options.botToken = (
          await prompts({
            type: 'text',
            name: 'value',
            message: '🐍 Input your bot token',
          })
        ).value;
        await this._client.start({
          botAuthToken: String(this.options.botToken),
        });
        this.connected = true;
        return this;
      } else {
        await this._client.start({
          phoneNumber: async () => {
            return (
              await prompts({
                type: 'text',
                name: 'value',
                message: '🐍 Input your international phone number',
              })
            ).value;
          },
          password: async () => {
            return (
              await prompts({
                type: 'text',
                name: 'value',
                message: '🐍 Input your 2FA password',
              })
            ).value;
          },
          phoneCode: async () => {
            return (
              await prompts({
                type: 'text',
                name: 'value',
                message: '🐍 Input Telegram verifications code',
              })
            ).value;
          },
          onError: (error: any) => {
            console.log(error);
          },
        });
        this.connected = true;
        return this;
      }
    };
    if (!this._client) {
      throw new BotError('client is missing', 'Snake._start', '');
    }
    if (this.options.sessionName !== '' && this.options.storeSession) {
      if (this._freshStore) {
        if (this.options.botToken && this.options.botToken !== '') {
          await this._client.start({
            botAuthToken: String(this.options.botToken),
          });
          this.connected = true;
          return this;
        }
        return _ask();
      }
      await this._client.connect();
      this.connected = true;
      return this;
    }
    if (!this.options.session || this.options.session == '') {
      if (this.options.botToken && this.options.botToken !== '') {
        await this._client.start({
          botAuthToken: String(this.options.botToken),
        });
        this.connected = true;
        return this;
      }
      return _ask();
    } else if (this.options.session !== '') {
      await this._client.connect();
      this.connected = true;
      return this;
    }
    return this;
  }
  async _createClient() {
    this.log.debug('Creating client');
    process.once('SIGINT', () => {
      this.log.log('🐍 Killing..');
      this.log.debug('Saving Entities to local cache');
      if (this.entityCache) this.entityCache.save();
      if (this._client) this._client.disconnect();
      process.exit(0);
    });
    process.once('SIGTERM', () => {
      this.log.log('🐍 Killing..');
      this.log.debug('Saving Entities to local cache');
      if (this.entityCache) this.entityCache.save();
      if (this._client) this._client.disconnect();
      process.exit(0);
    });
    if (!this.options.apiHash) {
      this.options.apiHash = (
        await prompts({
          type: 'text',
          name: 'value',
          message: '🐍 Input your api_hash',
        })
      ).value;
    }
    if (!this.options.apiId) {
      this.options.apiId = (
        await prompts({
          type: 'text',
          name: 'value',
          message: '🐍 Input your api_id',
        })
      ).value;
    }
    if (!this._client) {
      this._client = new TelegramClient(
        await this._createSession(),
        Number(this.options.apiId),
        String(this.options.apiHash),
        this.gramjsOptions
      );
    }
    this._client.setLogLevel(LogLevel[String(this.options.logger).toUpperCase()]);
    return this;
  }
  async connect() {
    if (!this._client) {
      throw new BotError('client is missing', 'Snake.connect', '');
    }
    if (this.connected) {
      throw new BotError('you already connected.', 'Snake.connect', '');
    }
    await this._client.connect();
    return this;
  }
  async disconnect() {
    if (!this._client) {
      throw new BotError('client is missing', 'Snake.disconnect', '');
    }
    if (!this.connected) {
      throw new BotError('you not connected.', 'Snake.disconnect', '');
    }
    if (this.entityCache) this.entityCache.save();
    await this._client.disconnect();
    this.connected = false;
    return this;
  }
  async run(params?: InterfaceSnakeEvent) {
    await this.start();
    this._client.addEventHandler((update: Api.TypeUpdate) => {
      return this.handleUpdate(update, this);
    }, new SnakeEvent(this, params || {}));
    return this;
  }
  async start() {
    await this._createClient();
    await this._start();
    this._telegram = new Telegram(this);
    this.aboutMe = await this._telegram.getMe();
    let name = this.aboutMe.lastName
      ? this.aboutMe.firstName + ' ' + this.aboutMe.lastName + ' [' + this.aboutMe.id + ']'
      : this.aboutMe.firstName + ' [' + this.aboutMe.id + ']';
    if (!this.aboutMe.bot) {
      await this.client.getDialogs({});
    }
    this.handleUpdate(this.aboutMe, this);
    this.log.log('🐍 Connected as ', name);
    this.connected = true;
    this.intervalCT = setInterval(() => {
      this._connectTime++;
    }, 1000);
    return this;
  }
  async save() {
    if (!this._client) {
      throw new BotError('client is missing', 'Snake.save', '');
    }
    if (!this._client.session) {
      throw new BotError('session is missing. i think you not connected.', 'Snake.save', '');
    }
    if (!this.connected) {
      throw new BotError('you not connected.', 'Snake.save', '');
    }
    this.log.debug('Saving Session');
    if (this._client.session instanceof StringSession) {
      return await this._client.session.save();
    }
    if (this._client.session instanceof SnakeSession) {
      return await this._client.session.save();
    }
    if (this._client.session instanceof StoreSession) {
      let session = await ConvertStore(this.options.sessionName!, this);
      if (!session) {
        throw new BotError("can't converting StoreSession to StringSession", 'Snake.save', '');
      }
      return await session.save();
    }
    return '';
  }
  async generateSession() {
    this.options.storeSession = false;
    this.log.debug('Generating session');
    await this.start();
    await this.save();
    process.exit(0);
    return this;
  }
}
