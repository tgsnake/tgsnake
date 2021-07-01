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
//console.log(Snake)
const {telegram} = Snake
const tg = telegram
Snake.onNewMessage(async (bot:any,message:any)=>{
  let filter = new Filters(bot)
  let {cmd,hears} = filter
  tg.readHistory(message.chat.id)
  tg.readMentions(message.chat.id)
  cmd(["snake","ping","start"],async ()=>{
    let ping = ((Date.now() / 1000) - message.date).toFixed(3)
    return bot.reply(`🐍 **Hi, I am Snake from TgSnake**\n🏓 Ping : \`${ping} s\``)
  })
  cmd("dme",async () => {
    tg.deleteUserHistory(message.chat.id,message.from.id)
    return bot.respond("Done!")
  })
  cmd("promote",async () => {
    if(message.replyToMessageId){
      let remsg = await tg.getMessages(message.chat.id,[message.replyToMessageId])
      await tg.editAdmin(remsg.messages[0].chat.id,remsg.messages[0].from.id,{
        rank : `@${remsg.messages[0].from.id}`
      })
      return bot.respond("Done!")
    }
  })
  cmd("dban",async () => {
    if(message.replyToMessageId){
      let remsg = await tg.getMessages(message.chat.id,[message.replyToMessageId])
      bot.deleteMessages([message.replyToMessageId,message.id])
      await tg.editBanned(remsg.messages[0].chat.id,remsg.messages[0].from.id)
      return bot.respond("Done!")
    }
  })
})