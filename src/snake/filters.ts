import {tele} from "./tele"
import {shortcut} from "./shortcut"
import {Message} from "./rewritejson"
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
          msg = new Message(bot.event)
        }
      }
    }
  }
  /**
   * class cmd or command
   * handle new message (text) with specific text. 
  */
  async cmd(command:string|string[],next:any){
    if(event){
      let me = await event.client.getMe()
      let username = ""
      if(me.username){
        username = me.username
      }
      if(Array.isArray(command)){
        let regex = new RegExp(`(?<cmd>^[/!](${command.join("|").replace(/\s+/gmi,"")})(\@${username})?)$`,"")
        if(msg.text){
          let spl = msg.text.split(" ")[0]
          let match = regex.exec(spl) as RegExpExecArray
          if(match as RegExpExecArray){
            next(match)
            return true
          }
        }
      }else{
        let regex = new RegExp(`(?<cmd>^[/!]${command.replace(/\s+/gmi,"")}(\@${username})?)$`,"")
        if(msg.text){
          let spl = msg.text.split(" ")[0]
          let match = regex.exec(spl) as RegExpExecArray
          if(match as RegExpExecArray){
            next(match)
            return true
          }
        }
      }
    }
    return false
  }
  /**
   * class cmd or command
   * handle new message (text) with specific text. 
  */
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