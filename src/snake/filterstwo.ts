// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Telegram } from './tele';
import { Shortcut } from './shortcut';
import { Message } from './rewritejson';
let event: any;
let msg: Message;
let bots: Shortcut;
let nowPrefix:string 

interface Handler {
  type : "command" | "hears",
  run : {(ctx:Shortcut,msg:Message,match:RegExpExecArray):void},
  key : string | RegExp | string[]
}
type TypeCmd = string | string[] 
type TypeHears = string | RegExp
export class Filters {
  private handler:Handler[] = []
  constructor () {}
  init(bot:Shortcut,prefix:string="!/"){
    if(prefix){
      nowPrefix = prefix
    }
    if(bot){
      bots = bot;
      if (bot.event) {
        event = bot.event;
        if (bot.event.message) {
          msg = bot.message;
        }
        if(this.handler.length !== 0){
          return this.run()
        }
      }
    }
  }
  /** @hidden */
  private async run (){
    this.handler.forEach(async (item,index)=>{
      let next:{(ctx:Shortcut,msg:Message,match:RegExpExecArray):void} = item.run
      switch (item.type){
        case "command" : 
          let command = (item.key) as TypeCmd
          let me = await event.client.getMe();
          let username = '';
          if (me.username) {
            username = me.username;
          }
          if (Array.isArray(command)) {
            let regex = new RegExp(
              `(?<cmd>^[${nowPrefix}](${command.join('|').replace(/\s+/gim, '')})(\@${username})?)$`,
              ''
            );
            if (msg.text) {
              let spl = msg.text.split(' ')[0];
              let match = regex.exec(spl) as RegExpExecArray;
              if (match as RegExpExecArray) {
                next(bots,msg,match);
                return true;
              }
            }
          } else {
            let regex = new RegExp(
              `(?<cmd>^[${nowPrefix}]${command.replace(/\s+/gim, '')}(\@${username})?)$`,
              ''
            );
            if (msg.text) {
              let spl = msg.text.split(' ')[0];
              let match = regex.exec(spl) as RegExpExecArray;
              if (match as RegExpExecArray) {
                return next(bots,msg,match);
              }
            }
          }
          break; 
        case "hears" : 
          let key = (item.key) as TypeHears
          if (key instanceof RegExp) {
            if (msg) {
              if (msg.text) {
                if (key.exec(msg.text)) {
                  return next(bots,msg,key.exec(msg.text) as RegExpExecArray);
                }
              }
            }
          } else {
            let regex = new RegExp(key, '');
            if (msg) {
              if (msg.text) {
                if (regex.exec(msg.text)) {
                  return next(bots,msg,regex.exec(msg.text) as RegExpExecArray);
                }
              }
            }
          }
          break; 
        default : 
      }
    })
  }
  cmd(command: string | string[], next: {(ctx:Shortcut,msg:Message,match:RegExpExecArray) : void}){
    this.handler.push({
      type : "command",
      run : next,
      key : command!
    })
    return true
  }
  hears(key: string | RegExp, next: {(ctx:Shortcut,msg:Message,match:RegExpExecArray) : void}){
    this.handler.push({
      type : "hears",
      run : next,
      key : key!
    })
    return true
  }
}