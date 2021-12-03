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
bot.cmd("start",(ctx)=>{
  return ctx.reply("Working..")
})
bot.run()
