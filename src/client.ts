// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Logger } from 'telegram/extensions';
import { TelegramClient } from 'telegram';
import { StringSession, StoreSession } from 'telegram/sessions';
import { Telegram } from './Telegram';
import { MainContext } from './Context/MainContext';
import prompts from 'prompts';
import { Api } from 'telegram';
import fs from 'fs';
import { Options } from './Interface/Options';
import { CatchError } from './Interface/CatchError';
import { ResultGetEntity } from './Telegram/Users/GetEntity';
import BotError from './Context/Error';
let api_hash: string;
let api_id: number;
let session: string;
let bot_token: string;
let connectionRetries: number;
let appVersion: string;
let sessionName: string = 'tgsnake';
let storeSession: boolean = true;
let isBot: boolean = false;
let connectTime: number = 0;
let intervalCT: any;
function makeApiHash(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function makeApiId(length) {
  var result = '';
  var characters = '0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export class Snake extends MainContext {
  client!: TelegramClient;
  telegram!: Telegram;
  version: string = '2.0.0-beta.2';
  logger: string = 'none';
  options!: Options;
  constructor(options?: Options) {
    super();
    console.log(
      '\x1b[31m',
      `Warning\nYou are using tgsnake ${
        this.version
      } which is still in the testing phase. Some update events may not be available. Please use the version below (2.0.0-beta.${
        Number(this.version.replace('2.0.0-beta.', '')) - 1
      }) or above (2.0.0.beta.${Number(this.version.replace('2.0.0-beta.', '')) + 1}).\n`,
      '\x1b[0m'
    );
    if (!options) {
      let dir = fs.readdirSync(process.cwd());
      // tgsnake.config.js
      if (dir.includes('tgsnake.config.js')) {
        let config = require(`${process.cwd()}/tgsnake.config.js`);
        options = config;
      }
      // tgsnake.config.json
      else if (dir.includes('tgsnake.config.json')) {
        let config = fs.readFileSync(`${process.cwd()}/tgsnake.config.js`, 'utf8');
        options = JSON.parse(config);
      }
    }
    //default options
    session = '';
    connectionRetries = 5;
    // custom options
    if (options) {
      if (options.logger) {
        this.logger = options.logger;
        delete options.logger;
      }
      if (options.apiHash) {
        api_hash = String(options.apiHash);
        delete options.apiHash;
      }
      if (options.apiId) {
        api_id = Number(options.apiId);
        delete options.apiId;
      }
      if (options.session) {
        session = options.session;
        delete options.session;
      }
      if (options.botToken) {
        bot_token = options.botToken;
        delete options.botToken;
      }
      if (options.connectionRetries) {
        connectionRetries = options.connectionRetries;
        delete options.connectionRetries;
      }
      if (options.appVersion) {
        appVersion = options.appVersion;
        delete options.appVersion;
      }
      if (String(options.tgSnakeLog).toLowerCase() == 'false') {
        this.tgSnakeLog = Boolean(options.tgSnakeLog);
        delete options.tgSnakeLog;
      }
      if (options.tgSnakeLog) {
        delete options.tgSnakeLog;
      }
      if (options.sessionName) {
        sessionName = options.sessionName;
        delete options.sessionName;
      }
      if (String(options.storeSession).toLowerCase() !== 'true') {
        storeSession = Boolean(options.storeSession);
        delete options.storeSession;
      }
      if (!options.useWSS) {
        options.useWSS = false;
      }
      this.options = options;
    }
    Logger.setLevel(this.logger);
  }
  private async _convertString() {
    let stringsession = new StringSession(session);
    if (storeSession && session !== '') {
      let storesession = new StoreSession(sessionName);
      await stringsession.load();
      storesession.setDC(stringsession.dcId, stringsession.serverAddress!, stringsession.port!);
      storesession.setAuthKey(stringsession.authKey);
      return storesession;
    } else {
      return stringsession;
    }
  }
  private async _createClient() {
    try {
      if (!api_hash) {
        if (session == '') {
          throw new Error('api_hash required!');
        } else {
          api_hash = makeApiHash(32);
        }
      }
      if (!api_id) {
        if (session == '') {
          throw new Error('api_id required!');
        } else {
          api_id = Number(makeApiId(7));
        }
      }
      if (!bot_token && session == '') {
        throw new Error(
          'bot_token required if you login as bot, session required if you login as user. To get session run generateSession function.'
        );
      }
      this.client = new TelegramClient(
        await this._convertString(),
        Number(api_id),
        String(api_hash),
        {
          connectionRetries: connectionRetries,
          appVersion: appVersion || this.version,
          ...this.options,
        }
      );
      return this.client;
    } catch (error) {
      let botError = new BotError();
      botError.error = error;
      botError.functionName = '_createClient';
      botError.functionArgs = ``;
      throw botError;
    }
  }
  async run() {
    try {
      process.once('SIGINT', () => {
        this.consoleColor = 'reset';
        this.log('🐍 Killing..');
        if (this.client) this.client.disconnect();
        process.exit(0);
      });
      process.once('SIGTERM', () => {
        this.consoleColor = 'reset';
        this.log('🐍 Killing..');
        if (this.client) this.client.disconnect();
        process.exit(0);
      });
      this.consoleColor = 'reset';
      this.log(`🐍 Welcome To TGSNAKE ${this.version}.`);
      this.log(`🐍 Setting Logger level to "${this.logger}"`);
      this.consoleColor = 'green';
      if (bot_token) {
        if (session == '') {
          storeSession = false;
        }
      }
      if (!this.client) {
        await this._createClient();
      }
      this.telegram = new Telegram(this);
      if (bot_token) {
        if (session == '') {
          await this.client.start({
            botAuthToken: bot_token,
          });
        } else {
          await this.client.connect();
        }
      } else {
        await this.client.connect();
      }
      let me = await this.telegram.getMe();
      isBot = me.bot!;
      this.aboutMe = me;
      let name = me.lastName
        ? me.firstName + ' ' + me.lastName + ' [' + me.id + ']'
        : me.firstName + ' [' + me.id + ']';
      if (!isBot) {
        await this.client.getDialogs({});
      }
      // new event
      this.client.addEventHandler((update: Api.TypeUpdate) => {
        return this.handleUpdate(update, this);
      });
      this.connected = true;
      this.handleUpdate(me, this);
      intervalCT = setInterval(() => {
        connectTime++;
      }, 1000);
      this.consoleColor = 'reset';
      this.log('🐍 Connected as ', name);
      return (this.consoleColor = 'green');
    } catch (error) {
      let botError = new BotError();
      botError.error = error;
      botError.functionName = 'run';
      botError.functionArgs = ``;
      throw botError;
    }
  }
  async generateSession() {
    try {
      process.once('SIGINT', () => {
        this.consoleColor = 'reset';
        this.log('🐍 Killing..');
        if (this.client) this.client.disconnect();
        process.exit(0);
      });
      process.once('SIGTERM', () => {
        this.consoleColor = 'reset';
        this.log('🐍 Killing..');
        if (this.client) this.client.disconnect();
        process.exit(0);
      });
      this.consoleColor = 'reset';
      this.log(`🐍 Welcome To TGSNAKE ${this.version}.`);
      this.log(`🐍 Setting Logger level to "${this.logger}"`);
      this.consoleColor = 'green';
      if (!api_hash) {
        let input_api_hash = await prompts({
          type: 'text',
          name: 'value',
          message: '🐍 Input your api_hash',
        });
        api_hash = input_api_hash.value;
      }
      if (!api_id) {
        let input_api_id = await prompts({
          type: 'text',
          name: 'value',
          message: '🐍 Input your api_id',
        });
        api_id = input_api_id.value;
      }
      this.client = new TelegramClient(
        new StringSession(session),
        Number(api_id),
        String(api_hash),
        {
          connectionRetries: connectionRetries,
          appVersion: appVersion || this.version,
          ...this.options,
        }
      );
      this.telegram = new Telegram(this);
      if (session == '') {
        if (!bot_token) {
          let loginAsBot = await prompts({
            type: 'confirm',
            name: 'value',
            initial: false,
            message: '🐍 Login as bot?',
          });
          if (!loginAsBot.value) {
            await this.client.start({
              phoneNumber: async () => {
                let value = await prompts({
                  type: 'text',
                  name: 'value',
                  message: '🐍 Input your international phone number',
                });
                return value.value;
              },
              password: async () => {
                let value = await prompts({
                  type: 'text',
                  name: 'value',
                  message: '🐍 Input your 2FA password',
                });
                return value.value;
              },
              phoneCode: async () => {
                let value = await prompts({
                  type: 'text',
                  name: 'value',
                  message: '🐍 Input Telegram verifications code',
                });
                return value.value;
              },
              onError: (err: any) => {
                console.log(err);
              },
            });
            session = String(await this.client.session.save());
            console.log(`🐍 Your string session : ${session}`);
            let me = await this.telegram.getMe();
            this.aboutMe = me;
            await this.telegram.sendMessage(
              me.id,
              `🐍 Your string session : <code>${session}</code>`,
              { parseMode: 'HTML' }
            );
          } else {
            let value = await prompts({
              type: 'text',
              name: 'value',
              message: '🐍 Input your bot_token',
            });
            await this.client.start({
              botAuthToken: value.value,
            });
            session = String(await this.client.session.save());
            console.log(`🐍 Your string session : ${session}`);
          }
        } else {
          await this.client.start({
            botAuthToken: bot_token,
          });
          session = String(await this.client.session.save());
          console.log(`🐍 Your string session : ${session}`);
        }
      } else {
        this.consoleColor = 'reset';
        this.log(`🐍 You should use the \`Snake.run()\`!`);
      }
      this.consoleColor = 'reset';
      this.log('🐍 Killing...');
      if (this.client) this.client.disconnect();
      process.exit(0);
    } catch (error) {
      let botError = new BotError();
      botError.error = error;
      botError.functionName = 'generateSession';
      botError.functionArgs = ``;
      throw botError;
    }
  }
  get connectTime() {
    let date = new Date(connectTime * 1000).toISOString().substr(9, 10).replace(/t/i, ':');
    let spl = date.split(':');
    // days:hours:minutes:seconds
    return `${Number(spl[0]) - 1}:${spl[1]}:${spl[2]}:${spl[3]}`;
  }
  async restart() {
    let d = Date.now();
    this.consoleColor = 'reset';
    await this.log(`🐍 Restarting after [${this.connectTime}] connected.`);
    this.consoleColor = 'green';
    connectTime = 0;
    this.connected = false;
    await clearInterval(intervalCT);
    await this.client.disconnect();
    await this.run();
    let p = Date.now();
    let ping = Number((p - d) / 1000).toFixed(3);
    return `${ping} s`;
  }
}
