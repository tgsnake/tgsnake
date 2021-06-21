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

Snake.run()
//console.log(Snake)
Snake.onNewMessage(async (bot:any,message:any)=>{
  console.log(message)
  if(message.text == "!snake" || message.text == ".snake"){
    let ping = ((Date.now() / 1000) - message.date).toFixed(3)
    await bot.reply(`🐍 **Hi, I am Snake from TgSnake**\nPing : \`${ping} s\``)
    await bot.deleteMessages([message.id])
    //console.log(await Snake.client.getEntity(message.chat.id))
    //console.log(await bot.reply(`Have A Nice Day!`))
  }
  /*if(bot.event.message.media){
    console.log(JSON.stringify(bot.event.message.media,null,2))
  }*/
})