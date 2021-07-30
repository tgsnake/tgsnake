// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
// 
// This file is part of Tgsnake
// 
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import {Telegram} from "./tele"
import {NewMessage} from 'telegram/events';
import {NewMessageEvent} from 'telegram/events/NewMessage';
import {Api} from "telegram"
import {Message} from "./rewritejson"
import {TelegramClient} from 'telegram';
import * as Interface from "./interface"
let client:TelegramClient
let tg:Telegram

export class Shortcut {
  /**
   * Original Event from gramjs.
  */
  event:NewMessageEvent 
  /**
   * New JSON Message.
  */
  message:Interface.Message
  /**
   * @param tgclient - Telegram Client 
   * @param event - Incomming new Event (NewMessageEvent)
  */
  constructor(tgclient:TelegramClient,event:NewMessageEvent){
    client = tgclient
    tg = new Telegram(tgclient)
    this.event = event
    this.message = new Message(event)
  }
  /**
   * reply 
   * shortcut from {@link Telegram.sendMessage} with replying message and markdown parse. 
   * @example 
   * ```ts 
   * ctx.reply("**Hello World!**")
   * ```
  */
  async reply(text:string,more?:Interface.replyMoreParams){
    return tg.sendMessage(this.message.chat.id,text,{
      replyToMsgId : this.message.id,
      parseMode : more?.parseMode || "markdown",
      ...more
    })
  }
  /**
   * replyHTML 
   * shortcut from {@link Telegram.sendMessage} with replying message and HTML parse
  */
  async replyHTML(text:string,more?:Interface.replyMoreParams){
    return tg.sendMessage(this.message.chat.id,text,{
      replyToMsgId : this.message.id,
      parseMode : "html",
      ...more
    })
  }
  /**
   * respond 
   * shortcut from telegram.sendMessage without replying message and without parse mode
  */
  async respond(text:string,more?:Interface.sendMessageMoreParams){
    return tg.sendMessage(this.message.chat.id,text,more)
  }
  /**
   * deleteMessages 
   * shortcut from telegram.deleteMessages
  */
  async deleteMessages(message_id:number[]){
    return tg.deleteMessages(this.message.chat.id,message_id)
  }
  /**
   * editMessage 
   * shortcut from telegram.editMessage
  */
  async editMessage(message_id:number,text:string,more?:Interface.editMessageMoreParams){
    return tg.editMessage(this.message.chat.id,message_id,text,more)
  }
  /**
   * forwardMessages 
   * shortcut from telegram.forwardMessages
  */
  async forwardMessages(chat_id:number,from_chat_id:number,message_id:number[],more?:Interface.forwardMessageMoreParams){
    return tg.forwardMessages(chat_id,from_chat_id,message_id,more)
  }
  /**
   * getMessages 
   * shortcut from telegram.getMessages
  */
  async getMessages(message_id:any[]){
    return tg.getMessages(this.message.chat.id,message_id)
  }
  /**
   * getMessagesViews 
   * shortcut from telegram.getMessagesViews
  */
  async getMessagesViews(message_id:number[],increment:boolean=false){
    return tg.getMessagesViews(this.message.chat.id,message_id,increment)
  }
  /**
   * getUserPhotos 
   * shortcut from telegram.getUserPhotos
  */
  async getUserPhotos(chat_id:number|string,more?:Interface.getUserPhotosMoreParams){
    return tg.getUserPhotos(chat_id,more)
  }
  /**
   * readHistory 
   * shortcut from telegram.readHistory
  */
  async readHistory(more?:Interface.readHistoryMoreParams){
    return tg.readHistory(this.message.chat.id,more)
  }
  /**
   * readMentions 
   * shortcut from telegram.readMentions
  */
  async readMentions(){
    return tg.readMentions(this.message.chat.id)
  }
  /**
   * readMessageContents 
   * shortcut from telegram.readMessageContents
  */
  async readMessageContents(message_id:number[]){
    return tg.readMessageContents(message_id)
  }
  /**
   * unpinAllMessages 
   * shortcut from telegram.unpinAllMessage
  */
  async unpinAllMessages(){
    return tg.unpinAllMessages(this.message.chat.id)
  }
  /**
   * pinMessage 
   * shortcut from telegram.pinMessage
  */
  async pinMessage(message_id:number,more?:Interface.pinMessageMoreParams){
    return tg.pinMessage(this.message.chat.id,message_id,more)
  }
  /**
   * unpinMessage
   * to unpin message you can use this method. this class is shortcut from pinMessage
  */
  async unpinMessage(message_id:number){
    return tg.pinMessage(this.message.chat.id,message_id,{
      unpin : true
    })
  }
  /**
   * deleteHistory 
   * shortcut from telegram.deleteHistory
  */
  async deleteHistory(more?:Interface.deleteHistoryMoreParams){
    return tg.deleteHistory(this.message.chat.id,more)
  }
  /**
   * deleteUserHistory 
   * shortcut from telegram.deleteUserHistory
  */
  async deleteUserHistory(user_id:number|string){
    return tg.deleteUserHistory(this.message.chat.id,user_id)
  }
  /**
   * editAdmin 
   * shortcut from telegram.editAdmin
  */
  async editAdmin(user_id:number|string,more?:Interface.editAdminMoreParams){
    return tg.editAdmin(this.message.chat.id,user_id,more)
  }
  /**
   * editBanned 
   * shortcut from telegram.editBanned
  */
  async editBanned(user_id:number|string,more?:Interface.editBannedMoreParams){
    return tg.editBanned(this.message.chat.id,user_id,more)
  }
}