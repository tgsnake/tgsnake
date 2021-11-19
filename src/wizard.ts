// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { MessageContext } from './Context/MessageContext';
export class State {
  private current: { chatId: number; now: number; running: boolean; wizard: string }[] = [];
  private wizard!: Session<any>[];
  //todo
  //change the ctx:any with TypeContext
  private middleware: { (ctx: MessageContext, next: any): void }[] = [];
  private ctx!: MessageContext;
  constructor(wizard: Session<any>[]) {
    this.wizard = wizard;
  }
  //todo
  //change the any type with next context type
  private running(next: any) {
    this.current.forEach((e, i) => {
      if (e.chatId == this.ctx.from.id) {
        if (e.running) {
          this.wizard.forEach(async (wzrd, indx) => {
            if (wzrd.name == e.wizard) {
              await wzrd.find(e.chatId);
              let runHand = (update) => {
                this.current.forEach(async (user) => {
                  if (user.chatId == update.from.id) {
                    if (user.running) {
                      await wzrd.wizard[user.now](update);
                      await wzrd.save(user.chatId);
                      user.now = user.now + 1;
                      if (wzrd.wizard[user.now]) {
                        return (user.running = true);
                      } else {
                        user.running = false;
                        return this.current.splice(i, 1);
                      }
                    }
                  }
                });
              };
              if (this.middleware.length > 0) {
                let runMid = (update: MessageContext, index: number) => {
                  return () => {
                    if (this.middleware[index + 1]) {
                      return this.middleware[index + 1](update, runMid(update, index + 1));
                    } else {
                      return runHand(update);
                    }
                  };
                };
                return this.middleware[0](this.ctx, runMid(this.ctx, 0));
              } else {
                return runHand(this.ctx);
              }
            }
          });
        }
      }
    });
    return next();
  }
  launch(name: string) {
    this.wizard.forEach((wzrd, indx) => {
      if (wzrd.name == name) {
        if (this.current.length == 0) {
          this.current.push({
            chatId: this.ctx.from.id,
            now: 0,
            running: true,
            wizard: wzrd.name,
          });
        } else {
          let index = this.current.findIndex((e) => {
            return e.chatId == this.ctx.from.id;
          });
          if (index == -1) {
            this.current.push({
              chatId: this.ctx.from.id,
              now: 0,
              running: true,
              wizard: wzrd.name,
            });
          }
        }
        return this.running(() => {
          return true;
        });
      }
    });
    return;
  }
  init(ctx: any, next: any) {
    if (!(ctx instanceof MessageContext)) return;
    this.ctx = ctx;
    return this.running(next);
  }
  use(func: { (ctx: MessageContext, next: any): void }) {
    return this.middleware.push(func);
  }
  quit() {
    this.current.forEach((e, i) => {
      if (e.chatId == this.ctx.from.id) {
        if (e.running) {
          e.running = false;
          return this.current.splice(i, 1);
        }
      }
    });
  }
}
export class Session<StateInterface> {
  state!: StateInterface;
  name!: string;
  //todo
  //change any type with TypeContext
  wizard!: { (ctx: MessageContext): void }[];
  private database: { chatId: number; data: StateInterface }[] = [];
  constructor(wizardName: string, ...wizardFunc: { (ctx: MessageContext): void }[]) {
    this.name = wizardName;
    this.wizard = wizardFunc;
  }
  save(chatId: number) {
    let index: number = this.database.findIndex((item) => {
      return item.chatId === chatId;
    });
    if (index === -1) {
      this.database.push({
        chatId: chatId,
        data: this.state,
      });
    } else {
      this.database[index].data = this.state;
    }
    return this.database;
  }
  find(chatId: number) {
    let index: number = this.database.findIndex((item) => {
      return item.chatId === chatId;
    });
    if (index != -1) {
      this.state = this.database[index].data;
    }
    return this.state;
  }
}
