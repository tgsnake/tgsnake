require("dotenv").config()
import snake from "../src"

const Snake = new snake({
  api_hash : String(process.env.api_hash),
  api_id : Number(process.env.api_id),
  bot_token : String(process.env.bot_token),
  logger : "none"
})

Snake.run()

Snake.onNewMessage((bot:any,message:any)=>{
  //if(message.chat.private){
    console.log("BOT",bot,"MESSAGE",message)
    bot.reply("Hi!")
    bot.replyHTML("<b>HI!</b>")
  //}
})