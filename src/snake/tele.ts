import {Logger} from 'telegram/extensions';
import {TelegramClient} from 'telegram';
import {StringSession} from 'telegram/sessions';
import {NewMessage} from 'telegram/events';
import {NewMessageEvent} from 'telegram/events/NewMessage';
import {Message} from 'telegram/tl/custom/message';
import {Api} from "telegram"
import * as define from "telegram/define"
import * as reResults from "./rewriteresults"
import BigInt from "big-integer"

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
  async deleteMessages(chat_id:number|string,message_id:number[]){
    let type = await client.getEntity(chat_id)
    if(type.className == "Channel"){
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
  async editMessage(chat_id:number|string,message_id:number,text:string,more?:any|undefined){
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
  async forwardMessages(chat_id:number|string,from_chat_id:number|string,message_id:number[],more?:any|undefined){
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
  async getMessages(chat_id:number|string,message_id:any[]){
    let type = await client.getEntity(chat_id)
    if(type.className == "Channel"){
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
  async getMessagesViews(chat_id:number|string,message_id:number[],more?:any|undefined){
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
  async readHistory(chat_id:number|string,more?:any|undefined){
    return client.invoke(
        new Api.messages.ReadHistory({
          peer : chat_id,
          ...more
        })
      )
  }
  async readMentions(chat_id:number|string){
    return client.invoke(
        new Api.messages.ReadMentions({
          peer : chat_id
        })
      )
  }
  async readMessageContents(message_id:number[]){
    return client.invoke(
        new Api.messages.ReadMessageContents({
          id : message_id
        })
      )
  }
  async receivedMessages(max_id:number){
    return client.invoke(
        new Api.messages.ReceivedMessages({
          maxId : max_id
        })
      )
  }
  async search(chat_id:number|string,query:string,more?:any|undefined){
    return client.invoke(
        new Api.messages.Search({
          peer : chat_id,
          q : query,
          ...more
        })
      )
  }
  async searchGlobal(query:string,more?:any|undefined){
    return client.invoke(
        new Api.messages.SearchGlobal({
          q : query,
          ...more
        })
      )
  }
  async unpinAllMessages(chat_id:number|string){
    return client.invoke(
        new Api.messages.UnpinAllMessages({
          peer : chat_id
        })
      )
  }
  async pinMessage(chat_id:number|string,message_id:number,more?:any|undefined){
    return client.invoke(
        new Api.messages.UpdatePinnedMessage({
          peer:chat_id,
          id:message_id,
          ...more
        })
      )
  }
  async createChannel(title:string,about:string,more?:any|undefined){
    return client.invoke(
        new Api.channels.CreateChannel({
          title : title,
          about : about,
          ...more
        })
      )
  }
  async deleteChannel(chat_id:number|string){
    return client.invoke(
        new Api.channels.DeleteChannel({
          channel : chat_id
        })
      )
  }
  async deleteHistory(chat_id:number|string,more?:any|undefined){
    let type = await client.getEntity(chat_id)
    if(type.className == "Channel"){
      return client.invoke(
        new Api.channels.DeleteHistory({
          channel : chat_id,
          ...more
        })
      )
    }else{
      return client.invoke(
          new Api.messages.DeleteHistory({
            peer : chat_id
          })
        )
    }
  }
  async deleteUserHistory(chat_id:number|string,user_id:number){
    return client.invoke(
        new Api.channels.DeleteUserHistory({
          channel : chat_id,
          userId : user_id
        })
      )
  }
  async editAdmin(chat_id:number|string,user_id:number,more?:any|undefined){
    let permissions = {
      changeInfo: more?.changeInfo || true,
      postMessages: more?.postMessages || true,
      editMessages: more?.editMessages || true,
      deleteMessages: more?.deleteMessages || true,
      banUsers: more?.banUsers || true,
      inviteUsers: more?.inviteUsers || true,
      pinMessages: more?.pinMessages || true,
      addAdmins: more?.addAdmins || false,
      anonymous: more?.anonymous || false,
      manageCall: more?.manageCall ||true
    }
    return client.invoke(
        new Api.channels.EditAdmin({
          channel : chat_id,
          userId : user_id,
          adminRights : new Api.ChatAdminRights(permissions),
          rank : more?.rank || false
        })
      )
  }
}