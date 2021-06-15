require("dotenv").config()
import {snake,Api} from "../src"

const Snake = new snake({
  api_hash : String(process.env.api_hash),
  api_id : Number(process.env.api_id),
  //bot_token : String(process.env.bot_token),
  session : String(process.env.session),
  logger : "none"
})

Snake.run()
Snake.onNewMessage(async (bot:any,message:any)=>{
  //console.log(message)
  if(message.text == "!snake"){
    //await bot.deleteMessages([message.id])
    let msg = await bot.reply("🐍 Hi, I am Snake from TGSNAKE.")
    //console.log(await bot.getMessages([message.id]))
    //bot.forwardMessages(message.chat.id,message.chat.id,[message.id])
    /*let results = await Snake.telegram.getMessagesViews(message.chat.id,[message.id])
    console.log(results)*/
  }
})