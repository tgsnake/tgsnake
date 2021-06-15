import {tele} from "./tele"
import {NewMessage} from 'telegram/events';
import {NewMessageEvent} from 'telegram/events/NewMessage';
import {Message} from 'telegram/tl/custom/message';
import {Api} from "telegram"
import {message} from "./rewritejson"

export class shortcut {
  client:any
  event:NewMessageEvent
  message:any
  constructor(client:any,event:NewMessageEvent){
    this.client = client
    this.event = event
    this.message = event.message as Message
  }
  async reply(text:string,more:any|undefined){
    let msg = new message(this.message,this.event)
    return new tele(this.client).sendMessage(msg.chat.id,text,{
      replyToMsgId : msg.id,
      ...more
    })
  }
  async replyHTML(text:string,more:any|undefined){
    let msg = new message(this.message,this.event)
    return new tele(this.client).sendMessage(msg.chat.id,text,{
      replyToMsgId : msg.id,
      parseMode : "html",
      ...more
    })
  }
  async deleteMessages(message_id:number[]){
    let msg = new message(this.message,this.event)
    return new tele(this.client).deleteMessages(msg.chat.id,message_id)
  }
  async editMessage(message_id:number,text:string,more:any|undefined){
    let msg = new message(this.message,this.event)
    return new tele(this.client).editMessage(msg.chat.id,message_id,text,more)
  }
  async forwardMessages(chat_id:number,from_chat_id:number,message_id:number[],more:any|undefined){
    return new tele(this.client).forwardMessages(chat_id,from_chat_id,message_id,more)
  }
}