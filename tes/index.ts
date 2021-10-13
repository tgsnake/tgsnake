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
  let tes = await ctx.telegram.getParticipant(ctx.chat.id,ctx.from.id) 
  console.log("_tes.index",tes)
})
bot.command("ct",(ctx)=>{
  ctx.reply(bot.connectTime)
})
bot.command("restart",async (ctx)=>{
  await ctx.reply(`Restarting after ${bot.connectTime} s connected.`) 
  let ping = await bot.restart() 
  return ctx.reply(`Took ${ping}`)
})
bot.run()