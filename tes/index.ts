// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 

import {Snake,GramJs,Composer,Updates} from "../src"
import { TypeReplyMarkup, BuildReplyMarkup } from '../src/Utils/ReplyMarkup';
import { ParseMessage } from '../src/Utils/ParseMessage'
import * as fs from "fs"
import bigInt from "big-integer"
import {ResultGetEntity} from "../src/Telegram/Users/GetEntity"
import Util from 'tg-file-id/dist/Util';
const {Api} = GramJs
const bot = new Snake() 
/*bot.use((ctx,next)=>{
  console.log(ctx)
  //console.log(bot.entityCache)
  return next()
})*/
bot.catch(error => {
  console.log(error)
})
bot.cmd("start",(ctx)=>{
  //console.log(ctx)
  return ctx.reply("Hi!",{
    replyMarkup : {
      inlineKeyboard : [[{
        text : "test",
        callbackData : "test"
      }]]
    }
  })
})
bot.action("test",(ctx)=>{
  console.log(ctx)
})
bot.run()
//bot.generateSession()