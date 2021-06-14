import {Logger} from 'telegram/extensions';
import {TelegramClient} from 'telegram';
import {StringSession} from 'telegram/sessions';
import {NewMessage} from 'telegram/events';
import {NewMessageEvent} from 'telegram/events/NewMessage';
import {Message} from 'telegram/tl/custom/message';
import {Api} from "telegram"
const BigInt = require("big-integer")

export class tele {
  client:any
  constructor(client:any){
    this.client = client
  }
  async sendMessage(chat_id:number|string,text:string,more:any|undefined){
      let parseMode = "markdown"
      if(more){
        if(more.parseMode){
          parseMode = more.parseMode.toLowerCase()
          delete more.parseMode
        }
      }
      let [parseText,entities] = await this.client._parseMessageText(text,parseMode)
      return this.client.invoke(
          new Api.messages.SendMessage({
              peer : chat_id,
              message : parseText,
              randomId : BigInt(-Math.floor(Math.random() * 10000000000000)),
              entities : entities,
              ...more
            })
        )
    }
  async deleteMessages(chat_id:number,message_id:number[]){
    if(String(chat_id).match(/^\-100/)){
      return this.client.invoke(
        new Api.channels.DeleteMessages({
          channel: chat_id,
          id: message_id,
        })
      );
    }else{
      return this.client.invoke(
        new Api.messages.DeleteMessages({
         revoke: true,
         id: message_id,
       }));
    }
  }
}