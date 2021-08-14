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

const bot = new Snake()
const filter = new Filters()
//bot.generateSession()
bot.catchError((reason, promise)=>{
  console.log(reason.message)
})
bot.run()
bot.onNewMessage(async (ctx,message)=>{
  //ctx.telegram.readHistory(message.chat.id)
  //ctx.telegram.readMentions(message.chat.id)
  filter.init(ctx)
  //console.log(message)
  //let entity = await ctx.telegram.getEntity(ctx.message.chat.id) 
  //console.log(entity)
  //console.log(decodeFileId(String(message.from.photo?.fileId)))
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