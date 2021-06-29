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
  if(
    await hears("^[!/]snake help",()=>{
      return bot.reply("here you go!")
    })
  ) return

  cmd("snake",async ()=>{
    let ping = ((Date.now() / 1000) - message.date).toFixed(3)
    return bot.reply(`🐍 **Hi, I am Snake from TgSnake**\nPing : \`${ping} s\``)
  })
  cmd("deleteHistory",async ()=>{
    return tg.deleteHistory(message.chat.id)
  })
  cmd("deleteUserHistory",async () => {
    return tg.deleteUserHistory(message.chat.id,message.from.id)
  })
  cmd("editAdmin",async () => {
    let remsg = await tg.getMessages(message.chat.id,[message.replyToMessageId])
    return tg.editAdmin(remsg.messages[0].chat.id,remsg.messages[0].from.id)
  })
  cmd("editBanned",async () => {
    let remsg = await tg.getMessages(message.chat.id,[message.replyToMessageId])
    console.log(
      await tg.editBanned(remsg.messages[0].chat.id,remsg.messages[0].from.id)
      )
  })
})