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
export class Snake extends MainContext {
  private _options!: Options;
  private _gramjsOptions!: Options;
  private _client!: TelegramClient;
  private _telegram!: Telegram;
  private _version: string = '2.0.0-beta.11';
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
    this._gramjsOptions = Object.assign(
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
    this._options = Object.assign(
      {
        tgSnakeLog: true,
        logger: 'none',
        sessionName: 'tgsnake',
        storeSession: true,
        session: '',
      },
      _options
    );
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
    return String(this._options.logger);
  }
  get connectTime() {
    let date = new Date(this._connectTime * 1000).toISOString().substr(9, 10).replace(/t/i, ':');
    let spl = date.split(':');
    // days:hours:minutes:seconds
    return `${Number(spl[0]) - 1}:${spl[1]}:${spl[2]}:${spl[3]}`;
  }
  async restart() {
    let d = Date.now();
    this.consoleColor = 'reset';
    await this.log(`🐍 Restarting after [${this.connectTime}] connected.`);
    this.consoleColor = 'green';
    this._connectTime = 0;
    this.connected = false;
    await clearInterval(this.intervalCT);
    await this.client.disconnect();
    await this.run();
    let p = Date.now();
    let ping = Number((p - d) / 1000).toFixed(3);
    return `${ping} s`;
  }
  private async _createSession() {
    if (this._options.storeSession) {
      if (this._options.session !== '') {
        return await ConvertString(this._options.session!, this._options.sessionName!);
      }
      let session = new StoreSession(this._options.sessionName!);
      await session.load();
      if (!session.authKey) {
        this._freshStore = true;
      }
      return session;
    }
    return new StringSession(this._options.session!);
  }
  private async _start() {
    this.log(`🐍 Welcome To TGSNAKE ${this.version}.`);
    this.log(`🐍 Setting Logger level to "${this._options.logger}"`);
    this.consoleColor = 'green';
    let _ask = async () => {
      let loginAsBot = await prompts({
        type: 'confirm',
        name: 'value',
        initial: false,
        message: '🐍 Login as bot?',
      });
      if (loginAsBot.value) {
        this._options.botToken = (
          await prompts({
            type: 'text',
            name: 'value',
            message: '🐍 Input your bot token',
          })
        ).value;
        await this._client.start({
          botAuthToken: String(this._options.botToken),
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
    if (this._options.sessionName !== '' && this._options.storeSession) {
      if (this._freshStore) {
        return _ask();
      }
      await this._client.connect();
      this.connected = true;
      return this;
    }
    if (this._options.botToken) {
      await this._client.start({
        botAuthToken: String(this._options.botToken),
      });
      this.connected = true;
      return this;
    }
    if (!this._options.session || this._options.session == '') {
      return _ask();
    } else if (this._options.session !== '') {
      await this._client.connect();
      this.connected = true;
      return this;
    }
    return this;
  }
  async _createClient() {
    process.once('SIGINT', () => {
      this.consoleColor = 'reset';
      this.log('🐍 Killing..');
      if (this._client) this._client.disconnect();
      process.exit(0);
    });
    process.once('SIGTERM', () => {
      this.consoleColor = 'reset';
      this.log('🐍 Killing..');
      if (this._client) this._client.disconnect();
      process.exit(0);
    });
    this.consoleColor = 'reset';
    if (!this._options.apiHash) {
      this._options.apiHash = (
        await prompts({
          type: 'text',
          name: 'value',
          message: '🐍 Input your api_hash',
        })
      ).value;
    }
    if (!this._options.apiId) {
      this._options.apiId = (
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
        Number(this._options.apiId),
        String(this._options.apiHash),
        this._gramjsOptions
      );
    }
    this._client.setLogLevel(LogLevel[String(this._options.logger).toUpperCase()]);
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
    await this._client.disconnect();
    this.connected = false;
    return this;
  }
  async run() {
    await this.start();
    this._client.addEventHandler((update: Api.TypeUpdate) => {
      return this.handleUpdate(update, this);
    });
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
    this.log('🐍 Connected as ', name);
    this.consoleColor = 'green';
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
    if (this._client.session instanceof StringSession) {
      return await this._client.session.save();
    }
    if (this._client.session instanceof StoreSession) {
      let session = await ConvertStore(this._options.sessionName!);
      if (!session) {
        throw new BotError("can't converting StoreSession to StringSession", 'Snake.save', '');
      }
      return await session.save();
    }
    return '';
  }
  async generateSession() {
    this._options.storeSession = false;
    await this.start();
    await this.save();
    process.exit(0);
    return this;
  }
}
