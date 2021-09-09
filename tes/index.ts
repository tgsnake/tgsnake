// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 

import {Snake,Wizard} from "../src" 
const session = new Wizard.Session("tester",(ctx)=>{
  ctx.reply("hello")
},(ctx)=>{
  ctx.reply("wow")
})
const state = new Wizard.State([session])
const bot = new Snake() 
bot.use((ctx, next)=> state.init(ctx,next))
bot.command("hi",(ctx)=>{
  console.log(ctx)
  ctx.reply("Hi")
})
bot.command("login",(ctx)=>{
  state.launch("tester")
})
bot.run()