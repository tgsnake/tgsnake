require("dotenv").config()
import {snake,Api} from "../src"
import fs from "fs"

const Snake = new snake({
  api_hash : String(process.env.api_hash),
  api_id : Number(process.env.api_id),
  //bot_token : String(process.env.bot_token),
  session : String(process.env.session),
  logger : "none"
})
//Snake.generateSession()
Snake.run()
//console.log(Snake)
const {telegram} = Snake
const tg = telegram
Snake.onNewMessage(async (bot:any,message:any)=>{
  //console.log(bot.event.message)
  if(message.text == "!snake" || message.text == ".snake"){
    let ping = ((Date.now() / 1000) - message.date).toFixed(3)
    let msg = await bot.reply(`🐍 **Hi, I am Snake from TgSnake**\nPing : \`${ping} s\``)
    if(message.replyToMessageId){
      console.log(
        JSON.stringify(await tg.getMessagesViews(message.chat.id,[message.replyToMessageId]),null,2)
        )
    }
  }
})