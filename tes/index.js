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
bot.on("message",(ctx)=>{
  return console.log(ctx)
})
bot.cmd("start",(ctx)=>{
  ctx.reply("hai",{
    replyMarkup : {
      inlineKeyboard : [
          [{
            text : "click me",
            callbackData : "clicked"
          }]
        ]
    }
  })
})
bot.cmd("help",(ctx)=>{
  ctx.reply("help")
})

bot.run()