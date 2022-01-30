// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 

//import {Snake,GramJs,Composer,Updates} from "../src"
import {Snake} from "../src/Client/Snake"
const bot = new Snake({
  tgSnakeLog: true,
  logger: 'debug',
  sessionName: 'tgsnake_dua',
  storeSession: true,
  apiHash: 'c01a12e7105d58f0dcb914bb273aabae',
  apiId: 6855509
})
/*bot.on("connected",(ctx)=>{
  console.log(await bot.save())
})*/
/*bot.on("*",(ctx)=>{
  console.log(ctx)
})*/
bot.cmd("start",(ctx)=>{
  ctx.reply("Running..")
})
bot.run()