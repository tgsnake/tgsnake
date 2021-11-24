// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import * as Updates from '../Update';
import { Context } from '../Update';
import { MessageContext } from './MessageContext';
import { ResultGetEntity } from '../Telegram/Users/GetEntity';
import BotError from './Error';
type MaybeArray<T> = T | T[];
type MaybePromise<T> = T | Promise<T>;
type NextFn = () => MaybePromise<void>;
type MiddlewareFn<C> = (ctx: C, next: NextFn) => MaybePromise<any>;
interface MiddlewareObj<C> {
  middleware: () => MiddlewareFn<C>;
}
export type ErrorHandler = (
  error: BotError,
  context: Updates.TypeUpdate
) => MaybePromise<any>;
type Middleware<C> = MiddlewareFn<C> | MiddlewareObj<C>;
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
  for (const t of triggers) {
    const res = t(content);
    if (res) {
      return true;
    }
  }
  return false;
}
function toArray(e) {
  return Array.isArray(e) ? e : [e];
}
export async function run<C>(middleware: MiddlewareFn<C>, ctx: C) {
  await middleware(ctx, leaf);
}
export class Composer implements MiddlewareObj<Updates.TypeUpdate> {
  private handler!: MiddlewareFn<Updates.TypeUpdate>;
  prefix: string = '.!/';
  constructor(...middleware: Array<MiddlewareFn<Updates.TypeUpdate>>) {
    this.handler = middleware.length === 0 ? pass : middleware.map(flatten).reduce(concat);
  }
  middleware() {
    return this.handler;
  }
  use(...middleware: Array<MiddlewareFn<Updates.TypeUpdate>>) {
    const composer = new Composer(...middleware);
    this.handler = concat(this.handler, flatten(composer));
    return composer;
  }
  on<K extends keyof Context>(filter: K, ...middleware: Array<MiddlewareFn<Context[K]>>):Composer{
    return this.filter((ctx) => {
      let filters = toArray(filter);
      let h: Array<string> = [];
      h.push('*');
      if (ctx instanceof ResultGetEntity) h.push('connected');
      if (ctx instanceof MessageContext) {
        ctx as MessageContext
        h.push('message');
        if(ctx.action){
          h.push(ctx.action["_"])
        }
      }
      let msg = [
        'updateNewMessage',
        'updateShortMessage',
        'updateShortChatMessage',
        'updateNewChannelMessage',
      ];
      if (ctx['_']) {
        if (msg.includes(ctx['_'])){ 
          h.push('message');
          if(ctx.message){
            ctx.message as MessageContext 
            if(ctx.message.action){
              h.push(ctx.message.action["_"])
            }
          }
        }
        h.push(ctx['_']);
        let logger = ['info', 'debug'];
        if (logger.includes(ctx.SnakeClient.logger)) {
          console.log(
            '\x1b[31m',
            `[${ctx.SnakeClient.connectTime}] - [${new Date().toLocaleString()}] - Receive ${
              ctx['_']
            }`,
            '\x1b[0m'
          );
        }
      } 
      for (let f of filters) {
        return h.includes(f);
      }
    }, ...middleware);
  }
  filter(predicate, ...middleware):Composer{
    const composer = new Composer(...middleware);
    this.branch(predicate, composer, pass);
    return composer;
  }
  drop(predicate, ...middleware) {
    return this.filter(async (ctx) => !(await predicate(ctx)), ...middleware);
  }
  fork(...middleware) {
    const composer = new Composer(...middleware);
    const fork = flatten(composer);
    //@ts-ignore
    this.use((ctx, next) => Promise.all([next(), run(fork, ctx)]));
    return composer;
  }
  lazy(middlewareFactory) {
    return this.use(async (context, next) => {
      let ctx = context 
      let msg = [
        'updateNewMessage',
        'updateShortMessage',
        'updateShortChatMessage',
        'updateNewChannelMessage',
      ];
      if(context["_"]){
        if(msg.includes(context["_"])){ 
          //@ts-ignore
          ctx = context.message as MessageContext
        }
      } 
      const middleware = await middlewareFactory(ctx);
      const arr = toArray(middleware);
      await flatten(new Composer(...arr))(ctx, next);
    });
  }
  route(router, routeHandlers, fallback = pass) {
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
  branch(predicate, trueMiddleware, falseMiddleware) {
    return this.lazy(async (ctx) => ((await predicate(ctx)) ? trueMiddleware : falseMiddleware));
  }
  command(
    trigger: MaybeArray<string | RegExp>,
    ...middleware: Array<MiddlewareFn<MessageContext>>
  ):Composer {
    let key = toArray(trigger); 
    let filterCmd = (ctx) => {
      const {text} = ctx
      const {aboutMe} = ctx.SnakeClient 
      for(let cmd of key){
        if(typeof cmd == 'string'){
          cmd as string 
          let r = new RegExp(
            `^[${this.prefix}](${cmd})${aboutMe.username ? `(@${aboutMe.username})?` : ``}$`,
            'i'
          ); 
          return r.test(String(text))
        } 
        if(cmd instanceof RegExp){
          cmd as RegExp 
          return cmd.test(String(text))
        } 
      }
      return false
    }
    return this.on("message").filter(filterCmd,...middleware)
  }
  cmd(trigger: MaybeArray<string | RegExp>, ...middleware: Array<MiddlewareFn<MessageContext>>):Composer {
    return this.command(trigger, ...middleware);
  }
  hears(trigger: MaybeArray<string | RegExp>, ...middleware: Array<MiddlewareFn<MessageContext>>):Composer {
    let tgr = triggerFn(trigger);
    return this.on("message").filter((ctx)=>{
      const { text } = ctx.message; 
      return match(ctx, String(text), tgr)
    },...middleware)
  }
  hear(trigger: MaybeArray<string | RegExp>, ...middleware: Array<MiddlewareFn<MessageContext>>):Composer{
    return this.hears(trigger, ...middleware);
  }
}
