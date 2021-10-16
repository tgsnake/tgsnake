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
  ctx.reply(`[🐍 Error] ${error.message}`)
})
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
  let tes = await ctx.telegram.getChatMembersCount(ctx.chat.id) 
  console.log("_tes.index",tes) 
  return ctx.reply(`🐍 Members in this chat - ${tes}`)
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
bot.command("pic",async (ctx)=>{
  ctx.telegram.sendPhoto(ctx.chat.id,"https://raw.githubusercontent.com/butthx/tgsnake/master/media/tgsnake.jpg")
})
bot.run()