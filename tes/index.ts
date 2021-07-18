
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
    let edit = await ctx.editMessage(msg.id!,"Ho Ho Ho.")
    console.log(msg,edit,message.chat.id)
  })
  cmd("ping",async () => {
    let d = ((Date.now() / 1000) - Number(message.date)).toFixed(3)
    ctx.reply(`🏓 **Pong!**\n\`${d} s\``)
  })
})