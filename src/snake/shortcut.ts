import {tele} from "./tele"
import {NewMessage} from 'telegram/events';
import {NewMessageEvent} from 'telegram/events/NewMessage';
import {Api} from "telegram"
import {Message} from "./rewritejson"
import {TelegramClient} from 'telegram';
import * as Interface from "./interface"
let client:any
let tg:any

export class shortcut {
  event:NewMessageEvent
  message:Interface.Message
  constructor(tgclient:TelegramClient,event:NewMessageEvent){
    client = tgclient
    tg = new tele(tgclient)
    this.event = event
    this.message = new Message(event)
  }
  /**
   * class reply 
   * shortcut from telegram.sendMessage with replying message and markdown parse
  */
  async reply(text:string,more?:Interface.replyMoreParams){
    return tg.sendMessage(this.message?.chat?.id,text,{
      replyToMsgId : this.message.id,
      ...more
    })
  }
  /**
   * class replyHTML 
   * shortcut from telegram.sendMessage with replying message and HTML parse
  */
  async replyHTML(text:string,more?:Interface.replyMoreParams){
    return tg.sendMessage(this.message?.chat?.id,text,{
      replyToMsgId : this.message.id,
      parseMode : "html",
      ...more
    })
  }
  /**
   * class respond 
   * shortcut from telegram.sendMessage without replying message and parse mode. 
  */
  async respond(text:string,more?:Interface.sendMessageMoreParams){
    return tg.sendMessage(this.message?.chat?.id,text,more)
  }
  /**
   * class deleteMessages 
   * shortcut from telegram.deleteMessages
  */
  async deleteMessages(message_id:number[]){
    return tg.deleteMessages(this.message?.chat?.id,message_id)
  }
  /**
   * class editMessage 
   * shortcut from telegram.editMessage
  */
  async editMessage(message_id:number,text:string,more?:Interface.editMessageMoreParams){
    return tg.editMessage(this.message?.chat?.id,message_id,text,more)
  }
  /**
   * class forwardMessages 
   * shortcut from telegram.forwardMessages
  */
  async forwardMessages(chat_id:number,from_chat_id:number,message_id:number[],more?:Interface.forwardMessageMoreParams){
    return tg.forwardMessages(chat_id,from_chat_id,message_id,more)
  }
  /**
   * class getMessages 
   * shortcut from telegram.getMessages
  */
  async getMessages(message_id:any[]){
    return tg.getMessages(this.message?.chat?.id,message_id)
  }
  /**
   * class getMessagesViews 
   * shortcut from telegram.getMessagesViews
  */
  async getMessagesViews(message_id:number[],increment:boolean=false){
    return tg.getMessagesViews(this.message?.chat?.id,message_id,increment)
  }
  /**
   * clase getUserPhotos 
   * shortcut from telegram.getUserPhotos
  */
  async getUserPhotos(chat_id:number|string,more?:Interface.getUserPhotosMoreParams){
    return tg.getUserPhotos(chat_id,more)
  }
  /**
   * class readHistory 
   * shortcut from telegram.readHistory
  */
  async readHistory(more?:Interface.readHistoryMoreParams){
    return tg.readHistory(this.message?.chat?.id,more)
  }
  /**
   * class readMentions 
   * shortcut from telegram.readMentions
  */
  async readMentions(){
    return tg.readMentions(this.message?.chat?.id)
  }
  /**
   * class readMessageContents 
   * shortcut from telegram.readMessageContents
  */
  async readMessageContents(message_id:number[]){
    return tg.readMessageContents(message_id)
  }
  /**
   * class unpinAllMessages 
   * shortcut from telegram.unpinAllMessage
  */
  async unpinAllMessages(){
    return tg.unpinAllMessages(this.message?.chat?.id)
  }
  /**
   * class pinMessage 
   * shortcut from telegram.pinMessage
  */
  async pinMessage(message_id:number,more?:Interface.pinMessageMoreParams){
    return tg.pinMessage(this.message?.chat?.id,message_id,more)
  }
  /**
   * class unpinMessage
   * to unpin message you can use this method. this class is shortcut from pinMessage
  */
  async unpinMessage(message_id:number){
    return tg.pinMessage(this.message?.chat?.id,message_id,{
      unpin : true
    })
  }
  /**
   * class deleteHistory 
   * shortcut from telegram.deleteHistory
  */
  async deleteHistory(more?:Interface.deleteHistoryMoreParams){
    return tg.deleteMessages(this.message?.chat?.id,more)
  }
  /**
   * class deleteUserHistory 
   * shortcut from telegram.deleteUserHistory
  */
  async deleteUserHistory(user_id:number|string){
    return tg.deleteUserHistory(this.message?.chat?.id,user_id)
  }
  /**
   * class editAdmin 
   * shortcut from telegram.editAdmin
  */
  async editAdmin(user_id:number|string,more?:Interface.editAdminMoreParams){
    return tg.editAdmin(this.message?.chat?.id,user_id,more)
  }
  /**
   * class editBanned 
   * shortcut from telegram.editBanned
  */
  async editBanned(user_id:number|string,more?:Interface.editBannedMoreParams){
    return tg.editBanned(this.message?.chat?.id,user_id,more)
  }
}