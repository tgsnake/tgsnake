require("dotenv").config()
import {snake} from "../src"

const Snake = new snake({
  api_hash : String(process.env.api_hash),
  api_id : Number(process.env.api_id),
  bot_token : String(process.env.bot_token),
  session : String(process.env.session),
  logger : "none"
})

Snake.run()
Snake.onNewMessage(async (bot:any,message:any)=>{
  if(message.text == "!snake"){
    //console.log("BOT",bot,"MESSAGE",message)
    await bot.deleteMessages([message.id])
    bot.reply("🐍 Hi, Iam Snake ...")
    //bot.reply("**Hi!**") //markdown
    //bot.replyHTML("<code>HI!</code>") //html
    //Snake.telegram.sendMessage(message.chat.id,"hai")
    //console.log(bot.event)
    //console.log(message.chat.id)
    //Snake.telegram.deleteMessages(message.chat.id,[message.id])
  }
})