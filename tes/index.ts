require("dotenv").config()
import {snake,Api} from "../src"
import {Filters} from "../src/filters"
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
  let filter = new Filters(bot)
  tg.readHistory(message.chat.id)
  tg.readMentions(message.chat.id)
  // introduction filters
  filter.cmd("ping",()=>{
    bot.reply("pong!")
  })
  /*if(message.text == "!snake" || message.text == ".snake"){
    let ping = ((Date.now() / 1000) - message.date).toFixed(3)
    let msg = await bot.reply(`🐍 **Hi, I am Snake from TgSnake**\nPing : \`${ping} s\``)
    //let me = await bot.event.client.getMe()
    //console.log(me)
  }*/
})