// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Telegram } from '../Telegram';
import * as Update from '../Update/Update';
import { Snake } from '../client';
import EventEmiter from 'events';
import { Api } from 'telegram';
import { NewMessage } from 'telegram/events';
import { NewMessageEvent } from 'telegram/events/NewMessage';
import { MessageContext } from './MessageContext';
import { Message } from 'telegram/tl/custom/message';
export type Handler = 'use' | 'hears' | 'command';
type TypeCmd = string | string[];
type TypeHears = string | RegExp;
export interface HandlerFunction {
  (ctx: MessageContext, match: RegExpExecArray): void;
}
export interface MiddlewareFunction {
  (ctx: MessageContext | any, next: any): void;
}
export interface HandlerObject {
  type: 'command' | 'hears';
  run: MiddlewareFunction | HandlerFunction;
  key: string | RegExp | string[];
}
export class MainContext extends EventEmiter {
  private middleware: MiddlewareFunction[] = [];
  private handler: HandlerObject[] = [];
  ctx!: any;
  nowPrefix: string = '.!/';
  constructor() {
    super();
  }
  async handleUpdate(update: Api.TypeUpdate | NewMessageEvent, SnakeClient: Snake) {
    if (update instanceof NewMessageEvent) {
      update as NewMessageEvent;
      let message: Message = update.message as Message;
      let parse = new MessageContext();
      await parse.init(message, SnakeClient);
      this.emit('message', parse);
      let runHandler = (updates) => {
        this.handler.forEach(async (item) => {
          switch (item.type) {
            case 'command':
              let command = item.key as TypeCmd;
              let me = await SnakeClient.telegram.getEntity('me');
              let username = '';
              if (me.username) {
                username = me.username;
              }
              if (Array.isArray(command)) {
                let regex = new RegExp(
                  `(?<cmd>^[${this.nowPrefix}](${command
                    .join('|')
                    .replace(/\s+/gim, '')})(\@${username})?)$`,
                  ''
                );
                if (parse.text) {
                  let spl = parse.text.split(' ')[0];
                  let match = regex.exec(spl) as RegExpExecArray;
                  if (match as RegExpExecArray) {
                    return item.run(parse, match);
                  }
                }
              } else {
                let regex = new RegExp(
                  `(?<cmd>^[${this.nowPrefix}]${command.replace(/\s+/gim, '')}(\@${username})?)$`,
                  ''
                );
                if (parse.text) {
                  let spl = parse.text.split(' ')[0];
                  let match = regex.exec(spl) as RegExpExecArray;
                  if (match as RegExpExecArray) {
                    return item.run(parse, match);
                  }
                }
              }
              break;
            case 'hears':
              let key = item.key as TypeHears;
              if (key instanceof RegExp) {
                if (parse) {
                  if (parse.text) {
                    if (key.exec(parse.text)) {
                      return item.run(parse, key.exec(parse.text) as RegExpExecArray);
                    }
                  }
                }
              } else {
                let regex = new RegExp(key, '');
                if (parse) {
                  if (parse.text) {
                    if (regex.exec(parse.text)) {
                      return item.run(parse, regex.exec(parse.text) as RegExpExecArray);
                    }
                  }
                }
              }
              break;
            default:
          }
        });
        return this.handler;
      };
      if (this.middleware.length > 0) {
        let next = (updates, index: number) => {
          return () => {
            if (this.middleware[index + 1]) {
              return this.middleware[index + 1](updates, next(updates, index + 1));
            } else {
              return runHandler(updates);
            }
          };
        };
        return this.middleware[0](parse, next(update, 0));
      } else {
        return runHandler(parse);
      }
    } else {
      let parse = await this.parseUpdate(update, SnakeClient);
      this.emit(update.className, parse);
      if (this.middleware.length > 0) {
        let next = (updates, index: number) => {
          return () => {
            if (this.middleware[index + 1]) {
              return this.middleware[index + 1](updates, next(updates, index + 1));
            }
          };
        };
        return this.middleware[0](parse, next(update, 0));
      }
      return this;
    }
    return this;
  }
  private async parseUpdate(update: Api.TypeUpdate, SnakeClient: Snake) {
    if (Update[update.className]) {
      let up = new Update[update.className]();
      await up.init(update, SnakeClient);
      return up;
    } else {
      return update;
    }
  }
  use(next: MiddlewareFunction) {
    return this.middleware.push(next);
  }
  hears(key: string | RegExp, next: HandlerFunction) {
    return this.handler.push({
      type: 'hears',
      run: next,
      key: key!,
    });
  }
  command(key: string | string[], next: HandlerFunction) {
    return this.handler.push({
      type: 'command',
      run: next,
      key: key!,
    });
  }
}
