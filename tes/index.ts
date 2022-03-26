// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 

//import {Snake,GramJs,Composer,Updates} from "../src"
import {Snake} from "../src/Client/Snake"
import * as Medias from "../src/Utils/Medias"
import fs from "fs"
import path from "path"
interface MyContext {
  hello?:string
}
const bot = new Snake()
bot.log.setLogLevel("debug")
bot.cmd("poll",(ctx)=>{
  ctx.telegram.sendPoll(ctx.chat.id,{
    question : "something",
    options : ["A","B"]
  },{
    correctAnswers : 0,
    solution : "**here your solution**",
    solutionParseMode : "markdown",
    quiz : true
  })
})
bot.run()