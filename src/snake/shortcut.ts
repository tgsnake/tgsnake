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
    return new tele(this.client).sendMessage(this.message.chat.id,text,{
      replyToMsgId : msg.id,
      ...more
    })
  }
  async replyHTML(text:string,more:any|undefined){
    let msg = new message(this.message,this.event)
    return new tele(this.client).sendMessage(this.message.chat.id,text,{
      replyToMsgId : msg.id,
      parseMode : "html",
      ...more
    })
  }
  async deleteMessages(message_id:number[]){
    let msg = new message(this.message,this.event)
    return new tele(this.client).deleteMessages(msg.chat.id,message_id)
  }
}