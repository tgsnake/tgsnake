import {tele} from "./tele"
import {NewMessage} from 'telegram/events';
import {NewMessageEvent} from 'telegram/events/NewMessage';
import {Message} from 'telegram/tl/custom/message';
import {Api} from "telegram"
import {message} from "./rewritejson"

let tgMessage:any
let client:any
let tg:any

export class shortcut {
  event:NewMessageEvent
  message:any
  constructor(tgclient:any,event:NewMessageEvent){
    client = tgclient
    tg = new tele(tgclient)
    this.event = event
    tgMessage = event.message as Message
    this.message = new message(tgMessage,event)
  }
  async reply(text:string,more?:any|undefined){
    return tg.sendMessage(this.message.chat.id,text,{
      replyToMsgId : this.message.id,
      ...more
    })
  }
  async replyHTML(text:string,more?:any|undefined){
    return tg.sendMessage(this.message.chat.id,text,{
      replyToMsgId : this.message.id,
      parseMode : "html",
      ...more
    })
  }
  async deleteMessages(message_id:number[]){
    return tg.deleteMessages(this.message.chat.id,message_id)
  }
  async editMessage(message_id:number,text:string,more?:any|undefined){
    return tg.editMessage(this.message.chat.id,message_id,text,more)
  }
  async forwardMessages(chat_id:number,from_chat_id:number,message_id:number[],more?:any|undefined){
    return tg.forwardMessages(chat_id,from_chat_id,message_id,more)
  }
  async getMessages(message_id:any[]){
    return tg.getMessages(this.message.chat.id,message_id)
  }
  async getMessagesViews(message_id:number[],more?:any|undefined){
    return tg.getMessagesViews(this.message.chat.id,message_id,more)
  }
}