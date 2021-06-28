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
  if(
    await filter.hears("^[!/]snake help",()=>{
      return bot.reply("here you go!")
    })
  ) return

  filter.cmd("snake",async (bot,message)=>{
    let ping = ((Date.now() / 1000) - message.date).toFixed(3)
    return bot.reply(`🐍 **Hi, I am Snake from TgSnake**\nPing : \`${ping} s\``)
  })
})