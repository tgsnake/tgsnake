// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 

import {Snake,GramJs,Composer,Updates} from "../src"
import { TypeReplyMarkup, BuildReplyMarkup } from '../src/Utils/ReplyMarkup';
import * as fs from "fs"
import bigInt from "big-integer"
import {ResultGetEntity} from "../src/Telegram/Users/GetEntity"
import Util from 'tg-file-id/dist/Util';
import Parser from "@tgsnake/parser"
import {Api} from "telegram"
const bot = new Snake() 
/*bot.use((ctx,next)=>{
  console.log(ctx)
  //console.log(bot.entityCache)
  return next()
})*/
const parser = new Parser(Api)
bot.command("start",(ctx)=>{
  return ctx.reply(`||spoiler||`,{
    parseMode : "markdown"
  })
})
bot.catch(error => {
  console.log(error)
})
bot.run()
//bot.generateSession()