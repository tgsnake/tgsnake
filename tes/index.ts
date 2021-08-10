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
  filter.init(ctx)
  //let entity = await ctx.telegram.getEntity(ctx.message.chat.id) 
  //console.log(entity)
  //console.log(decodeFileId("AQADBAADwawxGxMjtgcACDvytxsABAMAAxMjtgcABPqM9f80seQ8JbwHAAEeBA"))
  /*let {telegram} = bot
  let tg = telegram 
  let filter = new Filters(ctx) 
  let {cmd,hears} = filter
  tg.readHistory(message.chat.id)
  tg.readMentions(message.chat.id)
  //console.log(message,JSON.stringify(message,null,2))
  cmd("snake",async () => {
    let msg = await ctx.reply("Hai, saya snake!")
  })
  cmd("ping",async () => {
    let d = ((Date.now() / 1000) - Number(message.date)).toFixed(3)
    ctx.reply(`🏓 **Pong!**\n\`${d} s\``)
  })
  cmd("purge",async () => {
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
  cmd("spam",async () =>{
    if(message.text){
      let split = message.text.split(" ") 
      let num = Number(split[1]) 
      split.splice(1,1)
      split.splice(0,1)
      console.log(split)
      let random = split.join(" ").split("\n%%%")
      for(let i = 0; i< num; i++){
        if(i >= 50) return; 
        ctx.respond(random[Math.floor(Math.random() * random.length)])
      }
    }
  })*/
})
filter.hears("!snake help",(ctx)=>{
  ctx.reply("hears")
})
filter.cmd("snake",(ctx)=>{
  ctx.reply("i am snake!")
})