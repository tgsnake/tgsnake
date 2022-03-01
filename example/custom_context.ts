// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 
import {Snake} from "tgsnake"; 

interface MyContext {
  hello : string,
  isMessage : boolean
}
// declare the custom context in Composer.
const bot = new Snake<MyContext>() 
// Create the context. 
// You can use the Composer.use()
let myContext:MyContext = {
  hello : "hello",
  isMessage : false
}
// create from the root context to make sure that custom context is effected globally.
bot.context = myContext 
// the example using Composer.use()
bot.use((ctx,next)=>{
  myContext.isMessage = true 
  // re create the custom context from root.
  bot.context = myContext
  return next()
})
bot.cmd("start",(ctx)=>{
  // get the custom context
  console.log(ctx)
  ctx.reply(ctx.hello)
})

/**
 * FAQ : 
 * Q: Why we must create from root context not from ctx? 
 * A: Because we have a different context from Composer.use and Composer.on, so if you custom from ctx, the custom context maybe not appears in other ctx like MessageContext, ResultsGetEntity.
*/