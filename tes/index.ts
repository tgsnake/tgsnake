// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 

//import {Snake,GramJs,Composer,Updates} from "../src"
import {Snake} from "../src/Client/Snake"
interface MyContext {
  hello?:string
}
const bot = new Snake()
bot.log.setLogLevel("debug")
bot.use(async (ctx,next)=>{
  console.log(ctx)
  console.log(JSON.stringify(ctx,null,2))
  //@ts-ignore
  if(ctx.message?.media){
    //@ts-ignore
    if(ctx.message.media["_"] == "videoNote"){
      //@ts-ignore
      console.log(await ctx.message.media.download())
    }
  }
  return next()
})
bot.cmd("start",(ctx)=>{
  console.log(ctx)
  ctx.telegram.sendMessage(Number(ctx.chat.id),"hello")
})
bot.run()