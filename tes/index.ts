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
/*bot.catch((error,ctx)=>{
  if(ctx.reply){
    ctx.reply(`[🐍 Error] ${error.message}`)
  }else{
    console.log(error)
  }
})*/
bot.on("UpdateEditChannelMessage",(update)=>{
  //@ts-ignore
  //console.log(new Date().toLocaleString(),(update.className ? update.className : update["_"] ? update["_"] : "undefined")) 
  console.log(update)
})
/*bot.on("message",(ctx)=>{
//  if(bot.connected){
    if("media" in ctx){
      console.log(ctx.media)
    }
    ctx.telegram.readHistory(ctx.chat.id) 
    ctx.telegram.readMentions(ctx.chat.id)
    console.log(ctx)
  //}
})*/ 
bot.on("message",(ctx)=>{
  ctx.telegram.readHistory(ctx.chat.id) 
  console.log(ctx)
})
bot.run()