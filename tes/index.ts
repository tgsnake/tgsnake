require("dotenv").config()
import {snake,Filters,generateResult, Interface} from "../src"
import fs from "fs"

const Snake = new snake({
  api_hash : String(process.env.api_hash),
  api_id : Number(process.env.api_id),
  //bot_token : String(process.env.bot_token),
  session : String(process.env.session),
  logger : "none",
  tgSnakeLog : true
})
//Snake.generateSession()
Snake.catchError((reason, promise)=>{
  console.log(reason)
})
Snake.run()
const {telegram} = Snake
const tg = telegram!
Snake.onNewMessage(async (bot,message)=>{
//  console.log(bot.event)
//  console.log(bot.event,message)
  let filter = new Filters(bot)
  let {cmd,hears} = filter
  tg.readHistory(message.chat.id)
  tg.readMentions(message.chat.id)
  cmd("snake",async () => {
    bot.reply("Hai, saya snake!")
  })
  cmd("ping",async () => {
    let ping = Date.now() / 1000
    let msg = await bot.reply("Pong!")
    bot.editMessage(msg.id,`Pong!\n${(Date.now()/1000 - ping).toFixed(3)}`)
    /*Snake.client.editMessage(msg.chatId,{
      message : msg.id,
      text : "edited"
    })*/
  })
})
/*Snake.onNewEvent((update)=>{
  console.log(`New Event`,update)
})*/