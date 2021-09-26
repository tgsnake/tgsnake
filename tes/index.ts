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
interface Data {
  value?:number;
}
const session = new Wizard.Session<Data>("tester",
  async (ctx) => {
    session.state = {}
    return ctx.reply("Hi! Please Choose The Number.\n1. Check my Id\n2.Check my Username.\n3. Check my dcId.")
  },
  async (ctx) => {
    session.state.value = String(ctx.text)[0] 
    return ctx.reply(`Your choice (${session.state.value})`)
  }
)
const state = new Wizard.State([session])
const bot = new Snake() 
bot.use((ctx,next)=> state.init(ctx,next))
state.use(async (ctx,next) => {
  if(/^\/cancel/i.exec(String(ctx.text))){ 
    await ctx.reply("Okay!")
    return state.quit()
  }
  return next()
})
bot.on("message",(ctx)=>{
  if("media" in ctx){
    console.log(ctx.media)
  }
  ctx.telegram.readHistory(ctx.chat.id) 
  ctx.telegram.readMentions(ctx.chat.id)
  console.log(ctx)
})
bot.command("hi",(ctx)=>{
  ctx.reply("Hi")
})
bot.command("info",(ctx)=>{
  state.launch("tester")
})
bot.command("mycommand",(ctx)=>{
  console.log(ctx)
})
bot.run()