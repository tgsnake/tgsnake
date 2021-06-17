import {Logger} from 'telegram/extensions';
import {TelegramClient} from 'telegram';
import {StringSession} from 'telegram/sessions';
import {NewMessage} from 'telegram/events';
import {NewMessageEvent} from 'telegram/events/NewMessage';
import {Message} from 'telegram/tl/custom/message';
import {Api} from "telegram"
import * as define from "telegram/define"
import * as reResults from "./rewriteresults"
const BigInt = require("big-integer")

let client:any

export class tele {
  constructor(tgclient?:any){
    client = tgclient
  }
  async sendMessage(chat_id:number|string,text:string,more?:any|undefined){
      let parseMode = "markdown"
      if(more){
        if(more.parseMode){
          parseMode = more.parseMode.toLowerCase()
          delete more.parseMode
        }
      }
      let [parseText,entities] = await client._parseMessageText(text,parseMode)
      return new reResults.ClassResultSendMessage(
        await client.invoke(
          new Api.messages.SendMessage({
              peer : chat_id,
              message : parseText,
              randomId : BigInt(-Math.floor(Math.random() * 10000000000000)),
              entities : entities,
              ...more
            })
        )
       )
    }
  async deleteMessages(chat_id:number,message_id:number[]){
    if(String(chat_id).match(/^\-100/)){
      return client.invoke(
        new Api.channels.DeleteMessages({
          channel: chat_id,
          id: message_id,
        })
      );
    }else{
      return client.invoke(
        new Api.messages.DeleteMessages({
         revoke: true,
         id: message_id,
       }));
    }
  }
  async editMessage(chat_id:number,message_id:number,text:string,more?:any|undefined){
    let parseMode = "markdown"
      if(more){
        if(more.parseMode){
          parseMode = more.parseMode.toLowerCase()
          delete more.parseMode
        }
      }
    let [parseText,entities] = await client._parseMessageText(text||"",parseMode)
    return new reResults.ClassResultEditMessage(
      await client.invoke(
        new Api.messages.EditMessage({
          peer: chat_id,
          id: message_id,
          message: parseText,
          entities : entities,
          ...more
        })
      )
    )
  }
  async forwardMessages(chat_id:number,from_chat_id:number,message_id:number[],more?:any|undefined){
    let randomId:any = []
    for(let i = 0; i < message_id.length;i++){
      randomId.push(BigInt(Math.floor(Math.random() * 10000000000000)))
    }
    return client.invoke(new Api.messages.ForwardMessages({
      fromPeer : from_chat_id,
      toPeer : chat_id,
      id : message_id,
      randomId : randomId,
      ...more
    }))
  }
  async getMessages(chat_id:number,message_id:any[]){
    if(String(chat_id).match(/^\-100/)){
      return client.invoke(new Api.channels.GetMessages({
        channel : chat_id,
        id : message_id
      }))
    }else{
      return client.invoke(new Api.messages.GetMessages({
        id : message_id
      }))
    }
  }
  async getMessagesViews(chat_id:number,message_id:number[],more?:any|undefined){
    return client.invoke(new Api.messages.GetMessagesViews({
      peer : chat_id,
      id : message_id,
      ...more
    }))
  }
  async getUserPhotos(chat_id:number|string,more?:any|undefined){
    return client.invoke(
        new Api.photos.GetUserPhotos({
          userId : chat_id,
          ...more
        })
      )
  }
}