/**
 * Class Filters. 
 * Makes it easy for you to filter incoming messages and do what you want with them. 
 * First you must import it.
*/
import {Filters,Snake} from "tgsnake"
/**
 * Create new client.
 * you can place the options in ``tgsnake.config.js`` file.see ``tgsnake.config.js`` example.
 */

const bot = new Snake() 
/**
 * Handle new message. 
 * Class Filters only working with onNewMessage for now.
*/
/**
 * Create new filters. 
*/
let filter = new Filters()
bot.onNewMessage((ctx,message)=>{
  filter.init(ctx) 
})
/**
 * handle message "/start help"
 * to makesure the command "start" not executed then do like this :
*/
filter.hears(/^[!\/]start help/,(match)=>{
  ctx.reply("Help?")
})
/**
 * handle message "hi" 
*/
filter.hears("hi",(match)=>{
  ctx.reply("Oh Hi!")
})
/**
 * handle command "start"
*/
filter.cmd("start",(match)=>{
  ctx.reply("Hello Filters Working!")
})
/**
 * handle command "help" or "getHelp"
*/
filter.cmd(["help","getHelp"],(match) => {
  ctx.reply("No one wants to help you, Just Kidding.")
})

bot.run()