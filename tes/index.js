// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 

const {Snake,GramJs} = require("../lib")
const bigInt = require("big-integer")
const bot = new Snake()
bot.log.setLogLevel("debug")
bot.cmd("start",async (ctx)=>{
  let c = await ctx.reply("test",{
    replyMarkup : {
      inlineKeyboard : [[{
        text : "hello",
        url : `tg://user?id=${ctx.from.id}`
      }]]
    }
  });
  /*console.log(await c.message.click({
    filter : (btn, row,col) => {
      console.log(true,btn,row,col) 
      return true
    }
  }))*/
  console.log(await c.message.click({
    filter : (btn, row,col) => {
      console.log(false,btn,row,col) 
      return false
    }
  }))
});
bot.run()