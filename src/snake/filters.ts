import {Telegram} from "./tele"
import {Shortcut} from "./shortcut"
import {Message} from "./rewritejson"
let event:any 
let msg:any 
let bots:any
/**
 * This class to filter new message text. 
 * This class is beta!
*/
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
   * handle new message (text) with specific text. <br/> 
   * prefix : !/ <br/> 
   * @param key - some key like array of text or text 
   * @param next - a callbacm function when message match with key
   * @example 
   * ```ts 
   * import {Filters} from "tgsnake" 
   * // onNewMessage 
   * const filter = new Filters(ctx) 
   * filter.cmd("hi",(match)=>{
      ctx.reply("Hi!")
    })
   * ```
  */
  async cmd(command:string|string[],next:{(math:RegExpExecArray):void}){
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
   * handle new message (text) with specific text.
   * @param key - some key like regex or string. 
   * @param next - a callbacm function when message match with key.
   * @example 
   * ```ts 
   * import {Filters} from "tgsnake" 
   * // onNewMessage 
   * const filter = new Filters(ctx) 
   * filter.hears("hi",(match)=>{
      ctx.reply("Hi!")
    })
     filter.hears(/hello/i,(match)=>{
       ctx.reply("Oh Hi!")
     })
   * ```
  */
  async hears(key:string|RegExp,next:{(math:RegExpExecArray):void}){
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