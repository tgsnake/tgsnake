
import {Snake,Filters,GenerateResult, Interface, Shortcut, GramJs} from "../src"
import fs from "fs"
import {StoreSession,StringSession} from "telegram/sessions"
const bot = new Snake()
//Snake.generateSession()
bot.catchError((reason, promise)=>{
  console.log(reason.message)
})
bot.run()
bot.onNewMessage(async (ctx:Shortcut,message)=>{
  let {telegram} = bot
  let tg = telegram 
  let filter = new Filters(ctx)
  let {cmd,hears} = filter
  tg.readHistory(message.chat.id)
  tg.readMentions(message.chat.id)
  cmd("snake",async () => {
    let msg = await ctx.reply("Hai, saya snake!")
  })
  cmd("ping",async () => {
    let d = ((Date.now() / 1000) - Number(message.date)).toFixed(3)
    ctx.reply(`🏓 **Pong!**\n\`${d} s\``)
  })
  cmd("purge",async () => {
    let now = Date.now() / 1000
    if(message.replyToMessageId){
      let cache:number[] = [message.id] 
      let abs:number = Math.abs(message.id - message.replyToMessageId)
      for(let i = 0; i < abs; i++){
        let num = message.replyToMessageId ++
        if(num == message.id) break; 
        cache.push(num)
      }
      ctx.deleteMessages(cache)
      let ping = ((Date.now() /1000) - now).toFixed(3)
      return ctx.respond(`🧹 Done. Clean Now! - \`${ping} s\``)
    }
    let ping = ((Date.now() /1000) - now).toFixed(3)
    return ctx.reply(`🧹 What should I clean? - \`${ping} s\``)
  })
  cmd("spam",async () =>{
    if(message.text){
      let split = message.text.split(" ") 
      let num = Number(split[1]) 
      split.splice(1,1)
      split.splice(0,1)
      console.log(split)
      let random = split.join(" ").split("\n%%%")
      for(let i = 0; i< num; i++){
        if(i >= 50) return; 
        ctx.respond(random[Math.floor(Math.random() * random.length)])
      }
    }
  })
})