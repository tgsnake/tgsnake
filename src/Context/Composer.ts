// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2023 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Raw } from '@tgsnake/core';
import { FilterContext, filter } from './Filters';
import { TypeUpdate } from '../TL/Updates';

export type MaybeArray<T> = T | T[];
export type MaybePromise<T> = T | Promise<T>;
export type NextFn = () => MaybePromise<void>;
export type MiddlewareFn<C> = (ctx: C, next: NextFn) => MaybePromise<any>;
export interface MiddlewareObj<C> {
  middleware: () => MiddlewareFn<C>;
}
export type ErrorHandler<T> = (
  error: Error,
  context: Combine<Raw.TypeUpdate, T>
) => MaybePromise<any>;
export type Middleware<C> = MiddlewareFn<C> | MiddlewareObj<C>;
export type Combine<T, U> = T & Partial<U>;
function flatten<C>(mw: Middleware<C>) {
  return typeof mw === 'function' ? mw : (ctx, next) => mw.middleware()(ctx, next);
}
function concat(first, andThen) {
  return async (ctx, next) => {
    let nextCalled = false;
    await first(ctx, async () => {
      if (nextCalled) throw new Error('`next` already called before!');
      else nextCalled = true;
      await andThen(ctx, next);
    });
  };
}
function pass<C>(_ctx: C, next: NextFn) {
  return next();
}
const leaf = () => Promise.resolve();
function triggerFn(trigger) {
  return toArray(trigger).map((t) =>
    typeof t === 'string' ? (txt) => (txt === t ? t : null) : (txt) => t.exec(txt)
  );
}
function match(ctx, content, triggers) {
  let match: any[] = [];
  for (const t of triggers) {
    const res = t(content);
    if (res) {
      match.push(t);
    }
  }
  return Boolean(match.length);
}
function toArray(e) {
  return Array.isArray(e) ? e : [e];
}
export async function run<C>(middleware: MiddlewareFn<C>, ctx: C) {
  await middleware(ctx, leaf);
}
export class Composer<T = {}> implements MiddlewareObj<Combine<TypeUpdate, T>> {
  /** @hidden */
  private handler!: MiddlewareFn<Combine<TypeUpdate, T>>;
  /** @hidden */
  context: Partial<T> = {};
  prefix: string = '.!/';
  constructor(...middleware: Array<MiddlewareFn<Combine<TypeUpdate, T>>>) {
    this.handler = middleware.length === 0 ? pass : middleware.map(flatten).reduce(concat);
  }
  middleware(): MiddlewareFn<Combine<TypeUpdate, T>> {
    return this.handler;
  }
  use(...middleware: Array<MiddlewareFn<Combine<TypeUpdate, T>>>): Composer<T> {
    const composer = new Composer(...middleware);
    this.handler = concat(this.handler, flatten(composer));
    return composer;
  }
  on<K extends keyof FilterContext>(
    filters: MaybeArray<K>,
    ...middleware: Array<MiddlewareFn<Combine<FilterContext[K], T>>>
  ): Composer<T> {
    return this.filter((ctx) => filter(filters, ctx), ...middleware);
  }
  filter(predicate, ...middleware): Composer<T> {
    const composer = new Composer(...middleware);
    this.branch(predicate, composer, pass);
    return composer;
  }
  drop(predicate, ...middleware): Composer<T> {
    return this.filter(async (ctx) => !(await predicate(ctx)), ...middleware);
  }
  fork(...middleware): Composer<T> {
    const composer = new Composer(...middleware);
    const fork = flatten(composer);
    //@ts-ignore
    this.use((ctx, next) => Promise.all([next(), run(fork, ctx)]));
    return composer;
  }
  lazy(middlewareFactory): Composer<T> {
    return this.use(async (context, next) => {
      const middleware = await middlewareFactory(context);
      const arr = toArray(middleware);
      await flatten(new Composer(...arr))(Object.assign(context, this.context), next);
    });
  }
  route(router, routeHandlers, fallback = pass): Composer<T> {
    return this.lazy(async (ctx) => {
      var _a;
      const route = await router(ctx);
      return route === undefined
        ? []
        : (_a = routeHandlers[route]) !== null && _a !== void 0
        ? _a
        : fallback;
    });
  }
  branch(predicate, trueMiddleware, falseMiddleware): Composer<T> {
    return this.lazy(async (ctx) => ((await predicate(ctx)) ? trueMiddleware : falseMiddleware));
  }
  [Symbol.for('nodejs.util.inspect.custom')](): { [key: string]: any } {
    const toPrint: { [key: string]: any } = {
      _: this.constructor.name,
    };
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        const value = this[key];
        if (!key.startsWith('_')) {
          toPrint[key] = value;
        }
      }
    }
    return toPrint;
  }
  toJSON(): { [key: string]: any } {
    const toPrint: { [key: string]: any } = {
      _: this.constructor.name,
    };
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        const value = this[key];
        if (!key.startsWith('_')) {
          toPrint[key] = typeof value === 'bigint' ? String(value) : value;
        }
      }
    }
    return toPrint;
  }
  toString() {
    return `[constructor of ${this.constructor.name}] ${JSON.stringify(this, null, 2)}`;
  }
  command(
    trigger: MaybeArray<string | RegExp>,
    ...middleware: Array<MiddlewareFn<Combine<TypeUpdate, T>>>
  ): Composer<T> {
    let key = toArray(trigger);
    let filterCmd = (ctx) => {
      const { text } = ctx.message;
      const { _me } = ctx.client;
      let s = text.split(' ');
      let passed: RegExpExecArray[] = [];
      for (let cmd of key) {
        if (typeof cmd == 'string') {
          cmd as string;
          let r = new RegExp(
            `^[${this.prefix}](${cmd})${_me?.username ? `(@${_me?.username})?` : ``}$`,
            'i'
          );
          if (r.test(String(s[0]))) {
            passed.push(r.exec(String(s[0]))!);
          }
        }
        if (cmd instanceof RegExp) {
          cmd as RegExp;
          if (cmd.test(String(s[0]))) {
            passed.push(cmd.exec(String(s[0]))!);
          }
        }
      }
      ctx.match = passed;
      return Boolean(passed.length);
    };
    return this.on('message.text').filter(filterCmd, ...middleware);
  }
  cmd(
    trigger: MaybeArray<string | RegExp>,
    ...middleware: Array<MiddlewareFn<Combine<TypeUpdate, T>>>
  ): Composer<T> {
    return this.command(trigger, ...middleware);
  }
  hears(
    trigger: MaybeArray<string | RegExp>,
    ...middleware: Array<MiddlewareFn<Combine<TypeUpdate, T>>>
  ): Composer<T> {
    let tgr = triggerFn(trigger);
    return this.on(['message.text']).filter((ctx) => {
      const { text } = ctx.message;
      return match(ctx, String(text), tgr);
    }, ...middleware);
  }
  hear(
    trigger: MaybeArray<string | RegExp>,
    ...middleware: Array<MiddlewareFn<Combine<TypeUpdate, T>>>
  ): Composer<T> {
    return this.hears(trigger, ...middleware);
  }
  action(
    trigger: MaybeArray<string | RegExp>,
    ...middleware: Array<MiddlewareFn<Combine<TypeUpdate, T>>>
  ): Composer<T> {
    let key = toArray(trigger);
    let filterCmd = (ctx) => {
      const { data } = ctx.callbackQuery;
      let passed: any[] = [];
      for (let cmd of key) {
        if (typeof cmd == 'string') {
          cmd as string;
          if (cmd == data) passed.push(cmd);
        }
        if (cmd instanceof RegExp) {
          cmd as RegExp;
          if (cmd.test(String(data))) passed.push(cmd);
        }
      }
      return Boolean(passed.length);
    };
    return this.on('cb.data').filter(filterCmd, ...middleware);
  }
  /*inlineQuery(
    trigger: MaybeArray<string | RegExp>,
    ...middleware: Array<MiddlewareFn<Combine<Raw.UpdateBotInlineQuery, T>>>
  ): Composer<T> {
    let key = toArray(trigger);
    let filterCmd = (ctx) => {
      const { query } = ctx;
      let passed: any[] = [];
      for (let cmd of key) {
        if (typeof cmd == 'string') {
          cmd as string;
          if (cmd == query) passed.push(cmd);
        }
        if (cmd instanceof RegExp) {
          cmd as RegExp;
          if (cmd.test(String(query))) passed.push(cmd);
        }
      }
      return Boolean(passed.length);
    };
    return this.on('inlineQuery').filter(filterCmd, ...middleware);
  }*/
}
