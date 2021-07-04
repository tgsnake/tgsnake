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
  cmd("ambil",async () => {
    if(message.replyToMessageId){
      let remsg = await tg.getMessages(message.chat.id,[message.replyToMessageId])
      let reply = remsg.messages[0]
      bot.reply(`${message.from.first_name} ${message.from.last_name ? message.from.last_name : ""} mengambil ${message.text.replace(/^[!\/]ambil/i,"").trim()} dari ${reply.from.first_name} ${reply.from.last_name ? reply.from.last_name : ""}`)
    }
  })
  cmd("editPhoto",async ()=> {
    console.log(await tg.editPhoto(message.chat.id,fs.readFileSync("./tgsnake-compress-square.jpg")))
  })
})