import {snake} from "tgsnake"
import {Filters} from "tgsnake/filters"

// create client 
const Snake = new snake({
  api_hash : "you api hash here", // replace this with your api hash
  api_id : 123456, // replace this with your api id 
  // more options.
})
Snake.run()
Snake.onNewMessage((bot:any,message:any)=>{
  let filter = new Filters(bot) // generate new filter every event coming.
  // working with string
  filter.hears("snake",()=>{
    let ping = ((Date.now() / 1000) - message.date).toFixed(3)
    return bot.reply(`🐍 **Hi, I am Snake from TgSnake**\nPing : \`${ping} s\``)
  })
  // working with regex 
  filter.hears(/ping/,()=>{
    let ping = ((Date.now() / 1000) - message.date).toFixed(3)
    return bot.reply(`🐍 **Hi, I am Snake from TgSnake**\nPing : \`${ping} s\``)
  })
  // working with string and regex 
  filter.hears("^[!/]start$",()=>{
    let ping = ((Date.now() / 1000) - message.date).toFixed(3)
    return bot.reply(`🐍 **Hi, I am Snake from TgSnake**\nPing : \`${ping} s\``)
  })
})

/***
 * FAQ : 
 * Q : How To Handle message "/snake help" if i have command "/snake" ? 
 * A : You can use if else and return. for example : 
Snake.onNewMessage((bot:any,message:any)=>{
  let filter = new Filters(bot)
  
  if(
    filter.hears("/snake help",()=>{...})
  ) return
  
  filter.cmd("snake",()=>{...})
})
  * Q : Can i use filter outside from onNewMessage? 
  * A : No, You only can use inside onNewMessage.
  * Q : How to get match from regex? 
  * A : in filters callback function add match parameter.
filter.hears("snake",(match)=>{}) 
  * more question you can join my groups.
*/