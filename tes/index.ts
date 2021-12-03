// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 

import {Snake,Wizard,GramJs,Composer} from "../src" 
import { TypeReplyMarkup, BuildReplyMarkup } from '../src/Utils/ReplyMarkup';
import { ParseMessage } from '../src/Utils/ParseMessage'
import * as fs from "fs"
import BigInt from "big-integer"
import {ResultGetEntity} from "../src/Telegram/Users/GetEntity"
import Util from 'tg-file-id/dist/Util';
const {Api} = GramJs
const bot = new Snake() 
/*bot.catch((error,ctx)=>{
  console.log(error)
  let file = Buffer.from(`Update :\n${JSON.stringify(ctx,null,2)}\n\nError :\n${error.message}\n${JSON.stringify(error,null,2)}`) 
  bot.telegram.sendDocument(-1001467257798,file,{
    fileName : `${Date.now()}.txt`,
    mimeType : `text/plain`,
    caption : `**New Error!**`,
    parseMode : `markdown`
  })
})*/
bot.on("inlineQuery",async (ctx)=>{
  console.log(ctx) 
  let [text,entities] = await ParseMessage(bot,"**Testing inline callback query and answerInlineQuery.**","markdown")
  await ctx.telegram.answerInlineQuery(ctx.id,[
    new Api.InputBotInlineResult({
      id : `${Date.now()}`,
      type : "article",
      title : "tester",
      sendMessage : new Api.InputBotInlineMessageText({
        message : text,
        replyMarkup : await BuildReplyMarkup({
          inlineKeyboard : [
              [{
                text : "click me",
                callbackData : "clicked"
              }]
            ]
        }),
        entities : entities
      })
    })
  ])
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
