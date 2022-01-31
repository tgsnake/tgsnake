// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 

//import {Snake,GramJs,Composer,Updates} from "../src"
import {Snake} from "../src/Client/Snake"
import {StringSession} from "telegram/sessions";
const bot = new Snake({
  tgSnakeLog: true,
  logger: 'error',
  sessionName: 'tgsnake',
  storeSession: true,
  apiHash: 'c01a12e7105d58f0dcb914bb273aabae',
  apiId: 6855509
})
bot.cmd("restrict",async (ctx)=>{
  console.log(await ctx.telegram.restrictChatMember(ctx.chat.id,BigInt(5007180833),{
    sendMessages : true
  }))
})
bot.cmd("kick",async (ctx)=>{
  console.log(await ctx.telegram.kickChatMember(ctx.chat.id,BigInt(5007180833)))
})
bot.cmd("ban",async (ctx)=>{
  console.log(await ctx.telegram.banChatMember(ctx.chat.id,BigInt(5007180833)))
})
bot.cmd("unban",async (ctx)=>{
  console.log(await ctx.telegram.unbanChatMember(ctx.chat.id,BigInt(5007180833)))
})
bot.run()