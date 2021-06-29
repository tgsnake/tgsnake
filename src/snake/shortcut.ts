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
  async respond(text:string,more?:any|undefined){
    return tg.sendMessage(this.message.chat.id,text,more)
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
  async getUserPhotos(chat_id:number|string,more?:any|undefined){
    return tg.getUserPhotos(chat_id,more)
  }
  async readHistory(more?:any|undefined){
    return tg.readHistory(this.message.chat.id,more)
  }
  async readMentions(){
    return tg.readMentions(this.message.chat.id)
  }
  async readMessageContents(message_id:number[]){
    return tg.readMessageContents(message_id)
  }
  async unpinAllMessages(){
    return tg.unpinAllMessages(this.message.chat.id)
  }
  async pinMessage(message_id:number,more?:any|undefined){
    return tg.pinMessage(this.message.chat.id,Message,more)
  }
  async unpinMessage(message_id:number){
    return tg.pinMessage(this.message.chat.id,message_id,{
      unpin : true
    })
  }
  async deleteHistory(more?:any|undefined){
    return tg.deleteMessages(this.message.chat.id,more)
  }
  async deleteUserHistory(user_id:number|string){
    return tg.deleteUserHistory(this.message.chat.id,user_id)
  }
  async editAdmin(user_id:number|string,more?:any|undefined){
    return tg.editAdmin(this.message.chat.id,user_id,more)
  }
  async editBanned(user_id:number|string,more?:any|undefined){
    return tg.editBanned(this.message.chat.id,user_id,more)
  }
}