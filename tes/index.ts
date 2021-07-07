require("dotenv").config()
import {snake,Filters} from "../src"
import fs from "fs"

const Snake = new snake({
  api_hash : String(process.env.api_hash),
  api_id : Number(process.env.api_id),
  //bot_token : String(process.env.bot_token),
  session : String(process.env.session),
  logger : "debug",
  tgSnakeLog : true
})
//Snake.generateSession()
Snake.catchError((reason, promise)=>{
  console.log(reason,promise)
})
Snake.run()
const {telegram} = Snake
const tg = telegram
Snake.onNewMessage(async (bot:any,message:any)=>{
//  console.log(bot.event)
  console.log(message)
  let filter = new Filters(bot)
  let {cmd,hears} = filter
  tg.readHistory(message.chat.id)
  tg.readMentions(message.chat.id)
  cmd("snake",async () => {
    bot.replyHTML("<b>BOLD - HTML</b>\n<code>CODE - HTML</code>")
    bot.reply("**BOLD - MD**\n\`CODE - MD\`")
  })
  cmd("ping",async () => {
    let msg = await bot.reply("Pong!")
    bot.editMessage(msg.id,`Pong!\n${(Date.now()/1000 - msg.date).toFixed(3)}`)
  })
})