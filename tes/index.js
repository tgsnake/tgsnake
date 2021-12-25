// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 

const {Snake,Wizard,GramJs,Composer} = require("../lib")
const {Api} = GramJs
const bot = new Snake() 
bot.cmd("start",(ctx)=>{
  console.log(ctx)
  return ctx.reply("Hi!")
})
bot.run()