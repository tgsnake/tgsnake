import {tele} from "./snake/tele"
import {shortcut} from "./snake/shortcut"
import {message} from "./snake/rewritejson"
let event:any 
let msg:any 
let bots:any
export class Filters {
  constructor(bot?:any){
    if(bot){
      bots = bot
      if(bot.event){
        event = bot.event
        if(bot.event.message){
          msg = new message(bot.event.message,bot.event)
        }
      }
    }
  }
  async cmd(command:string,next:any){
    if(event){
      let me = await event.client.getMe()
      let username = ""
      if(me.username){
        username = me.username
      }
      let regex = new RegExp(`(?<cmd>^[/!]${command.replace(/\s+/gmi,"")}(\@${username})?)$`,"")
      if(msg.text){
        let spl = msg.text.split(" ")[0]
        let match = regex.exec(spl) as RegExpExecArray
        if(match){
          next(bots,msg)
          return true
        }
      }
    }
    return false
  }
  async hears(key:string|RegExp,next:any){
    if(event){
      if(key instanceof RegExp){
        if(msg){
          if(msg.text){
            if(key.exec(msg.text)){
              next(key.exec(msg.text) as RegExpExecArray)
              return true
            }
          }
        }
      }else{
        let regex = new RegExp(key,"")
        if(msg){
          if(msg.text){
            if(regex.exec(msg.text)){
              next(regex.exec(msg.text) as RegExpExecArray)
              return true
            }
          }
        }
      }
    }
    return false
  }
}