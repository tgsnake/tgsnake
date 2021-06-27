import {tele} from "./snake/tele"
import {shortcut} from "./snake/shortcut"
import {message} from "./snake/rewritejson"

let event:any 
let msg:any 
export class Filters {
  constructor(bot:any){
    if(bot){
      if(bot.event){
        event = bot.event
        if(bot.event.message){
          msg = new message(bot.event.message,bot.event)
        }
      }
    }
  }
  async cmd(command:string,next:any){
    let me = await event.client.getMe()
    let username = ""
    if(me.username){
      username = me.username
    }
    let regex = new RegExp(`^[/!]${command}(\@${username})?`,"")
    if(msg.text){
      if(regex.exec(msg.text)){
        return next(regex.exec(msg.text))
      }
    }
  }
}