// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 

import {Snake,Wizard,GramJs,Composer} from "../src" 
import * as fs from "fs"
import BigInt from "big-integer"
const {Api} = GramJs
const bot = new Snake() 
bot.action("clicked",(ctx)=>{
  return ctx.message.reply("callbackQuery now supported.")
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