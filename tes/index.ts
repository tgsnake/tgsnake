
import {Snake,Filters,GenerateResult, Interface, Shortcut, GramJs} from "../src"
import fs from "fs"
import {StoreSession,StringSession} from "telegram/sessions"
const bot = new Snake()
//Snake.generateSession()
bot.catchError((reason, promise)=>{
  console.log(reason)
})
bot.run()
bot.onNewMessage(async (ctx:Shortcut,message)=>{
//console.log(ctx.event)
//  console.log(Snake)
 // console.log(message) 
  //console.log(await ctx.event.message.getSender())
  let {telegram} = bot
  let tg = telegram 
//  console.log(await Snake.client.getMe())
  let filter = new Filters(ctx)
  let {cmd,hears} = filter
  tg.readHistory(message.chat.id)
  tg.readMentions(message.chat.id)
  cmd("snake",async () => {
    let msg = await ctx.reply("Hai, saya snake!")
    console.log(msg)
  })
})