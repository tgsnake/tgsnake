
import {snake,Filters,generateResult, Interface, shortcut, generateJson} from "../src"
import fs from "fs"
import {StoreSession,StringSession} from "telegram/sessions"

const Snake = new snake()
//Snake.generateSession()
Snake.catchError((reason, promise)=>{
  console.log(reason)
})
Snake.run()
Snake.onNewMessage(async (bot:shortcut,message)=>{
//  console.log(bot.event)
  console.log(Snake)
  console.log(bot.event,message) 
  let {telegram} = Snake
  let tg = telegram
  let filter = new Filters(bot)
  let {cmd,hears} = filter
  tg.readHistory(message.chat.id)
  tg.readMentions(message.chat.id)
  cmd("snake",async () => {
    bot.reply("Hai, saya snake!")
  })
})