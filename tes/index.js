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
bot.command("start",async (ctx) => {
  console.log(ctx)
  const msg = await ctx.reply("123456")
  await ctx.telegram.editMessage(ctx.chat.id,msg.message.id,"**78901**234",{
    parseMode : "markdown"
    /*entities : [{
      type : "bold",
      offset : 0,
      length : 4
    }]*/
  })
})
bot.run()