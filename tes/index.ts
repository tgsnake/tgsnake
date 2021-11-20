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
bot.on("message",(ctx)=>{ 
  //console.log(ctx.SnakeClient.entityCache)
  return ctx.telegram.readHistory(ctx.message.chat.id)
})
bot.cmd("start",(ctx)=>{
  ctx.reply("hai")
})
bot.run()