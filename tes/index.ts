// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
// 
// This file is part of Tgsnake
// 
// Tgsnake is a free software : you can redistribute it and/or modify
// it under the terms of the MIT License as published.

import {Snake,LegacyFilters,Filters,GenerateResult, Interface, Shortcut, GramJs,GenerateJson} from "../src"
const {Api} = GramJs
import fs from "fs"
import {StoreSession,StringSession} from "telegram/sessions" 
import BigInt from "big-integer"
import {decodeFileId} from "tg-file-id" 
import * as Utils from "../src/snake/utils"
import * as Wizard from "../src/snake/wizard"
const bot = new Snake()
const filter = new Filters()
//bot.generateSession()
bot.catchError((reason, promise)=>{
  console.log(reason.message)
})
bot.run()
/*class WizardState {
  private current:{chatId:number;now:number;running:boolean;}[] = []
  private wizard!:WizardSession<any>
  constructor(wizard:WizardSession<any>){
    this.wizard = wizard
  }
  async run(filters:Filters,event:Shortcut){
    if(this.current.length == 0){
      this.current.push({chatId:event.message.chat.id,now:0,running:true})
    }else{
      let index = this.current.findIndex((e)=>{return e.chatId == event.message.chat.id})
      if(index == -1){
        this.current.push({chatId:event.message.chat.id,now:0,running:true})
      }
    }
    this.current.forEach(async (e,i)=>{
      console.log(e)
      if(e.chatId == event.message.chat.id){
        if(e.running){
          await this.wizard.wizard[e.now](event)
          e.now = e.now+1
          if(this.wizard.wizard[e.now]){
            return e.running = true
          }else{
            this.current.splice(i,1)
            return e.running = false
          }
        }
        if(!e.running){
          return filters.init(event)
        }
      }
    })
  }
}
class WizardSession<T>{ 
  state!:T
  name!:string
  wizard!:{(ctx:Shortcut):void}[]
  constructor(wizardName:string,...wizardFunc:{(ctx:Shortcut):void}[]){
    this.wizard = wizardFunc 
    this.name = wizardName
  }
}

let session = new WizardSession<{id:number}>("testing",
  (ctx) => {
    session.state = {id:0}
    session.state.id = ctx.message.chat.id 
    ctx.reply("please input your number")
  },
  (ctx) => {
    ctx.reply(`your number is ${ctx.message.text}`)
  }
)
let state = new WizardState(session)*/
let session = new Wizard.Session<{id?:number}>("testing",
  (ctx) => {
    session.state = {}
    session.state.id = ctx.message.chat.id 
    ctx.reply("Silakan masukan nomor anda")
  },
  (ctx) => {
    ctx.reply("nomor anda adalah "+ctx.message.text)
    ctx.reply("silakan masukan pin anda")
  },
  (ctx) => {
    ctx.reply("oke selesai.")
  }
)
let state = new Wizard.State([session])
bot.onNewMessage(async (ctx,message)=>{
  //ctx.telegram.readHistory(message.chat.id)
  //ctx.telegram.readMentions(message.chat.id)
  filter.init(ctx)
})
filter.use((ctx)=>{
  state.init(ctx)
})
state.use((ctx)=>{
  if(/^[\!\/]leave/.exec(String(ctx.message.text))){
    return state.quit()
  }
})
filter.cmd("login",async (ctx,msg)=>{
  state.launch("testing")
})
filter.cmd("snake",async (ctx,message) => {
  let msg = await ctx.reply("Hai, saya snake!")
})
filter.cmd("ping",async (ctx,message) => {
  let d = ((Date.now() / 1000) - Number(message.date)).toFixed(3)
  ctx.reply(`🏓 **Pong!**\n\`${d} s\``)
})
filter.cmd("purge",async (ctx,message) => {
  let now = Date.now() / 1000
  if(message.replyToMessageId){
    let cache:number[] = [message.id] 
    let abs:number = Math.abs(message.id - message.replyToMessageId)
    for(let i = 0; i < abs; i++){
      let num = message.replyToMessageId ++
      if(num == message.id) break; 
      cache.push(num)
    }
    ctx.deleteMessages(cache)
    let ping = ((Date.now() /1000) - now).toFixed(3)
    return ctx.respond(`🧹 Done. Clean Now! - \`${ping} s\``)
  }
  let ping = ((Date.now() /1000) - now).toFixed(3)
  return ctx.reply(`🧹 What should I clean? - \`${ping} s\``)
})
filter.cmd("spam",async (ctx,message) =>{
  if(message.text){
    let split = message.text.split(" ") 
    let num = Number(split[1]) 
    split.splice(1,1)
    split.splice(0,1)
    let random = split.join(" ").split("\n%%%")
    for(let i = 0; i< num; i++){
      if(i >= 50) return; 
      ctx.respond(random[Math.floor(Math.random() * random.length)])
    }
  }
})
/*let state = new WizardState<{id:number}>()
console.log(new WizardSession("tester",(ctx)=>{
  ctx.reply("whats your name")
}))*/