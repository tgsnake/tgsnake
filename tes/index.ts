// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 

import {Snake,Wizard,GramJs} from "../src" 
import * as fs from "fs"
import BigInt from "big-integer"
const {Api} = GramJs
const bot = new Snake() 
bot.catch((error,ctx)=>{
  if(ctx.reply){
    ctx.reply(`[🐍 Error] ${error.message}`)
  }else{
    console.log(error)
  }
})
//bot.on("*",(update)=>{
//  console.log(update)
//})
bot.on("message",(ctx)=>{
//  if(bot.connected){
    if("media" in ctx){
      console.log(ctx.media)
    }
    ctx.telegram.readHistory(ctx.chat.id) 
    ctx.telegram.readMentions(ctx.chat.id)
    console.log(ctx)
  //}
})
bot.hears("tes",async (ctx)=>{
  let tes = await ctx.telegram.getParticipants(ctx.chat.id)
  return ctx.telegram.sendDocument(
      ctx.chat.id,
      Buffer.from(
          JSON.stringify(tes,null,2)
        ),
      {
        fileName : "results.txt",
        mimeType : "text/plain"
      }
    )
})
bot.command("ct",(ctx)=>{
  ctx.reply(bot.connectTime)
})
bot.command("aboutme",async (ctx)=>{
  let userInfo = await ctx.telegram.getParticipant(ctx.chat.id,ctx.from.id) 
  ctx.reply(`--- User Info ---\nId : ${userInfo.user.id}\nDcId : ${userInfo.user.dcId}\nName : ${userInfo.user.lastName ? userInfo.user.firstName + " " + userInfo.user.lastName : userInfo.user.firstName}\nStatus : ${userInfo.status}\nLastSeen : ${userInfo.user.status}`)
})
bot.command("restart",async (ctx)=>{
  await ctx.reply(`Restarting after ${bot.connectTime} s connected.`) 
  let ping = await bot.restart() 
  return ctx.reply(`Took ${ping}`)
})
bot.command("parseMd",(ctx)=>{
  //@ts-ignore
  let spl = ctx.text.split(" ") 
  //@ts-ignore
  let text = ctx.text.replace(spl[0],"").trim()
  console.log()
  return ctx.replyWithMarkdown(text)
})
bot.run()