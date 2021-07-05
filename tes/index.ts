require("dotenv").config()
import {snake,Api} from "../src"
import {Filters} from "../src/filters"
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
  console.log(reason,promise)
})
Snake.run()
const {telegram} = Snake
const tg = telegram
Snake.onNewMessage(async (bot:any,message:any)=>{
//  console.log(bot.event)
  let filter = new Filters(bot)
  let {cmd,hears} = filter
  tg.readHistory(message.chat.id)
  tg.readMentions(message.chat.id)
  cmd("snake",async () => {
    console.log(
        JSON.stringify(await tg.getAdminLog(message.chat.id),null,2)
      )
  })
})