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
import { computeCheck } from "telegram/Password";
import {CustomFile} from "telegram/client/uploads"
import path from "path"
import fs from "fs"
import axios from "axios"
import FileType from "file-type"

export let client:any

async function getFinnalId(chat_id:number|string){
  if(typeof(chat_id) == "string"){
    let entity = await client.getEntity(chat_id)
    return Number(entity.id)
  }
  if(typeof(chat_id) == "number"){
    return Number(chat_id)
  }
}

export class tele {
  /**
   * Generate simple method from raw api gramjs 
   * parameters : 
   * tgclient : gramjs client
  */
  constructor(tgclient:any){
    client = tgclient
  }
  private async isChannel(chat_id:number|string):Promise<boolean>{
    let type = await client.getEntity(chat_id) 
    return Boolean(type.className == "Channel")
  }
  /**
   * class sendMessage 
   * Sends a message to a chat 
   * parameters :
   * chat_id : chat or channel or groups id. 
   * text : text or message to send. 
   * more : gramjs SendMessage params.
   * results : 
   * ClassResultSendMessage
  */
  async sendMessage(chat_id:number|string,text:string,more?:any|undefined){
      let parseMode = "markdown"
      if(more){
        if(more.parseMode){
          parseMode = more.parseMode.toLowerCase()
          delete more.parseMode
        }
      }
      let [parseText,entities] = await client._parseMessageText(text,parseMode)
      if(more){
        if(more.entities){
          entities = more.entities
          parseText = text
        }
      }
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
  /**
   * class deleteMessages 
   * Delete messages in a chat/channel/supergroup 
   * parameters :
   * chat_id : chat or Channel or groups id 
   * message_id : array of number message id to be deleted.
   * results :
   * ClassResultAffectedMessages
  */
  async deleteMessages(chat_id:number|string,message_id:number[]){
    let type = await client.getEntity(chat_id)
    if(type.className == "Channel"){
      return new reResults.ClassResultAffectedMessages(
         await client.invoke(
          new Api.channels.DeleteMessages({
            channel: chat_id,
            id: message_id,
          })
        )
      )
    }else{
      return new reResults.ClassResultAffectedMessages(
        await client.invoke(
          new Api.messages.DeleteMessages({
           revoke: true,
           id: message_id,
         })
        )
       )
    }
  }
  /**
   * class editMessage 
   * Edit message 
   * chat_id : chat or channel or groups id. 
   * message_id : id from message to be edited.
   * text : new message if you need to edit media you can replace this with blank string ("")
   * more : gramjs EditMessage params.
   * results : 
   * ClassResultEditMessage
  */
  async editMessage(chat_id:number|string,message_id:number,text:string,more?:any|undefined){
    let parseMode = "markdown"
      if(more){
        if(more.parseMode){
          parseMode = more.parseMode.toLowerCase()
          delete more.parseMode
        }
      }
    let [parseText,entities] = await client._parseMessageText(text||"",parseMode)
    if(more){
      if(more.entities){
        entities = more.entities
        parseText = text || ""
      }
    }
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
  /**
   * class forwardMessages.
   * Forwards messages by their IDs.
   * parameters : 
   * chat_id : chat or channel or groups id to be sending forwardMessages (receiver).
   * from_chat_id : chat or channel or groups id which will forwarding messages  (sender).
   * message_id : array of number message id to be forward. 
   * more : gramjs ForwardMessages params.
   * results : 
   * ClassResultForwardMessages
  */
  async forwardMessages(chat_id:number|string,from_chat_id:number|string,message_id:number[],more?:any|undefined){
    let randomId:any = []
    for(let i = 0; i < message_id.length;i++){
      randomId.push(BigInt(Math.floor(Math.random() * 10000000000000)))
    }
    return new reResults.ClassResultForwardMessages(
        await client.invoke(
          new Api.messages.ForwardMessages({
            fromPeer : from_chat_id,
            toPeer : chat_id,
            id : message_id,
            randomId : randomId,
            ...more
        })
      )
    )
  }
  /**
   * class getMessages 
   * Get chat/channel/supergroup messages.
   * parameters :
   * chat_id : chat or channel or groups id.
   * message_id : array of number message id. 
   * results : 
   * ClassResultGetMessages
  */
  async getMessages(chat_id:number|string,message_id:any[]){
    let type = await client.getEntity(chat_id)
    if(type.className == "Channel"){
      return new reResults.ClassResultGetMessages(
          await client.invoke(new Api.channels.GetMessages({
          channel : chat_id,
          id : message_id
        }))
      )
    }else{
      return new reResults.ClassResultGetMessages(
          await client.invoke(new Api.messages.GetMessages({
          id : message_id
        }))
      )
    }
  }
  /**
   * class getMessagesViews. 
   * Get and increase the view counter of a message sent or forwarded from a channel.
   * parameters : 
   * chat_id : channel id.
   * message_id : array of message id. 
   * increment : Whether to mark the message as viewed and increment the view counter.
   * results : 
   * ClassResultGetMessagesViews
  */
  async getMessagesViews(chat_id:number|string,message_id:number[],increment:boolean=false){
    return new reResults.ClassResultGetMessagesViews(
      await client.invoke(new Api.messages.GetMessagesViews({
        peer : chat_id,
        id : message_id,
        increment : increment
      }))
    )
  }
  /**
   * class getUserPhotos 
   * Returns the list of user photos.
   * parameters : 
   * chat_id : chat or channel or groups id. 
   * more : gramjs GetUserPhotos params.
  */
  async getUserPhotos(chat_id:number|string,more?:any|undefined){
    return client.invoke(
        new Api.photos.GetUserPhotos({
          userId : chat_id,
          ...more
        })
      )
  }
  /**
   * class readHistory 
   * Mark channel/supergroup history as read 
   * parameters : 
   * chat_id : chat or channel or groups id.
   * more : gramjs ReadHistory params.
   * results : 
   * ClassResultAffectedMessages
  */
  async readHistory(chat_id:number|string,more?:any|undefined){
    let type = await client.getEntity(chat_id)
    if(type.className == "Channel"){
      return new reResults.ClassResultAffectedMessages(
          await client.invoke(
              new Api.channels.ReadHistory({
                channel : chat_id,
                ...more
              })
            )
        )
    }else{
      return new reResults.ClassResultAffectedMessages( 
          await client.invoke(
            new Api.messages.ReadHistory({
              peer : chat_id,
              ...more
            })
          )
      )
    }
  }
  /**
   * class readMentions
   * Get unread messages where we were mentioned
   * parameters : 
   * chat_id : chat or channel or groups id.
   * results : 
   * ClassResultAffectedMessages
  */
  async readMentions(chat_id:number|string){
    return new reResults.ClassResultAffectedMessages(
        await client.invoke(
          new Api.messages.ReadMentions({
            peer : chat_id
          })
        )
      )
  }
  /**
   * class readMessageContents
   * Mark channel/supergroup message contents as read 
   * parameters : 
   * message_id : array of message id
   * results : 
   * ClassResultAffectedMessages
  */
  async readMessageContents(message_id:number[]){
    return new reResults.ClassResultAffectedMessages(
        await client.invoke(
          new Api.messages.ReadMessageContents({
            id : message_id
          })
        )
      )
  }
  /**
   * class unpinAllMessages
   * Unpin all pinned messages 
   * parameters : 
   * chat_id : chat or channel or groups id.
   * results : 
   * ClassResultAffectedMessages
  */
  async unpinAllMessages(chat_id:number|string){
    return new reResults.ClassResultAffectedMessages(
        await client.invoke(
          new Api.messages.UnpinAllMessages({
            peer : chat_id
          })
        )
      )
  }
  /**
   * class pinMessage 
   * Pin a message 
   * parameters : 
   * chat_id : chat or channel or groups id.
   * message_id : The message to pin or unpin 
   * more : gramjs UpdatePinnedMessage params.
   * results : 
   * ClassResultPinMessage
  */
  async pinMessage(chat_id:number|string,message_id:number,more?:any|undefined){
    return new reResults.ClassResultPinMessage(
        await client.invoke(
          new Api.messages.UpdatePinnedMessage({
            peer:chat_id,
            id:message_id,
            ...more
          })
        )
      )
  }
  /**
   * class deleteHistory 
   * Delete the history of a supergroup
   * parameters : 
   * chat_id : Supergroup whose history must be deleted 
   * more : gramjs DeleteHistory params.
   * results : 
   * boolean or ClassResultAffectedMessages
  */
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
      return new reResults.ClassResultAffectedMessages(
          await client.invoke(
            new Api.messages.DeleteHistory({
              peer : chat_id
            })
          )
        )
    }
  }
  /**
   * class deleteUserHistory 
   * Delete all messages sent by a certain user in a supergroup 
   * parameters : 
   * chat_id : channel or groups id. 
   * user_id : User whose messages should be deleted 
   * results : 
   * ClassResultAffectedMessages
  */
  async deleteUserHistory(chat_id:number|string,user_id:number|string){
    return new reResults.ClassResultAffectedMessages(
        await client.invoke(
          new Api.channels.DeleteUserHistory({
            channel : chat_id,
            userId : user_id
          })
        )
      )
  }
  /**
   * class editAdmin 
   * Modify the admin rights of a user in a supergroup/channel.
   * parameters : 
   * chat_id : channel or groups id 
   * user_id : id from user which will modify the admin rights
   * more : adminRights params and rank params.
   * results : 
   * ClassResultEditAdminOrBanned
  */
  async editAdmin(chat_id:number|string,user_id:number|string,more?:any|undefined){
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
    return new reResults.ClassResultEditAdminOrBanned( 
        await client.invoke(
          new Api.channels.EditAdmin({
            channel : chat_id,
            userId : user_id,
            adminRights : new Api.ChatAdminRights(permissions),
            rank : more?.rank || ""
          })
        )
      )
  }
  /**
   * class editBanned
   * Ban/unban/kick a user in a supergroup/channel.
   * parameters : 
   * chat_id : channel or groups id 
   * user_id : id from user which will banned/kicked/unbanned 
   * more : permissions given to the user 
   * results : 
   * ClassResultEditAdminOrBanned
  */
  async editBanned(chat_id:number|string,user_id:number|string,more?:any|undefined){
    let permissions = {
      untilDate: more?.untilDate || 0,
      viewMessages: more?.viewMessages || true,
      sendMessages: more?.sendMessages || true,
      sendMedia: more?.sendMedia || true,
      sendStickers: more?.sendStickers || true,
      sendGifs: more?.sendGifs || true,
      sendGames: more?.sendGames || true,
      sendInline: more?.sendInline || true,
      sendPolls: more?.sendPolls || true,
      changeInfo: more?.changeInfo || true,
      inviteUsers: more?.inviteUsers || true,
      pinMessages: more?.pinMessages || true
    }
    return new reResults.ClassResultEditAdminOrBanned(
        await client.invoke(
          new Api.channels.EditBanned({
            channel : chat_id,
            participant : user_id,
            bannedRights : new Api.ChatBannedRights(permissions)
          })
        )
      )
  }
  /**
   * class editPhoto. 
   * Change the photo of a channel/Supergroup 
   * parameters : 
   * chat_id : Channel/supergroup whose photo should be edited 
   * photo : new photo. 
   * results : 
   * ClassResultEditPhotoOrTitle
  */
  async editPhoto(chat_id:number|string,photo:string|Buffer){
    let toUpload = await this.uploadFile(photo)
    if(await this.isChannel(chat_id)){
      return new reResults.ClassResultEditPhotoOrTitle(
        await client.invoke(
          new Api.channels.EditPhoto({
            channel : chat_id,
            photo : toUpload
          })
        )
      )
    }else{
      return client.invoke(
          new Api.messages.EditChatPhoto({
            chatId : await getFinnalId(chat_id),
            photo : toUpload
          })
        )
    }
  }
  /**
   * class uploadFile 
   * upload file from url or buffer or file path 
   * parameters : 
   * file : file object 
   * results : 
   * original class uploadFile gramjs example results : ClassResultUploadFile
  */
  async uploadFile(file:string|Buffer,workers?:number|undefined,fileName?:string|undefined){
    if(Buffer.isBuffer(file)){
      let fileInfo = await FileType.fromBuffer(file)
      if(fileInfo){
        let file_name = fileName || `${Date.now()/1000}.${fileInfo.ext}`
        let toUpload = new CustomFile(
            file_name,
            Buffer.byteLength(file),
            "",
            file
          )
        return client.uploadFile({
          file : toUpload,
          workers : workers || 1
        })
      }
    }else{
      let basename = path.basename(file)
      if(/^http/i.exec(file)){
        let res = await axios.get(file,{
          responseType: "arraybuffer"
        })
        let basebuffer = Buffer.from(res.data, "utf-8")
        let file_name = fileName || basename
        let match = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi.exec(file_name)
        if(!match){
          let fileInfo = await FileType.fromBuffer(basebuffer)
          if(fileInfo){
            file_name = `${file_name}.${fileInfo.ext}`
          }
        }
        let toUpload = new CustomFile(
          file_name,
          Buffer.byteLength(basebuffer),
          "",
          basebuffer
        )
        return client.uploadFile({
          file : toUpload,
          workers : workers || 1
        })
      }
      if(/^(\/|\.\.?\/|~\/)/i.exec(file)){
        let file_name = fileName || basename
        let match = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi.exec(file_name)
        if(!match){
          let fileInfo = await FileType.fromFile(file)
          if(fileInfo){
            file_name = `${file_name}.${fileInfo.ext}`
          }
        }
        let toUpload = new CustomFile(
          file_name,
          fs.statSync(file).size,
          file
        )
        return client.uploadFile({
          file : toUpload,
          workers : workers || 1
        })
      }
    }
  }
  /**
   * class editTitle 
   * Edit the name of a channel/supergroup 
   * parameters : 
   * chat_id : chat or channel or groups id.
   * title : new title.
   * results : 
   * ClassResultEditPhotoOrTitle
  */
  async editTitle(chat_id:number|string,title:string){
    if(await this.isChannel(chat_id)){
      return new reResults.ClassResultEditPhotoOrTitle(
          await client.invoke(
              new Api.channels.EditTitle({
                channel : chat_id,
                title : title
              })
            )
        )
    }else{
      return client.invoke(
          new Api.messages.EditChatTitle({
            chatId : await getFinnalId(chat_id),
            title : title
          })
        )
    }
  }
  /**
   * class exportMessageLink 
   * Get link and embed info of a message in a channel/supergroup.
   * parameters : 
   * chat_id : chat or channel or groups id. 
   * message_id : message id 
   * more : gramjs ExportMessageLink params. 
   * results : 
   * gramjs ExportedMessageLink
  */
  async exportMessageLink(chat_id:number|string,message_id:number,more?:any|undefined){
    return client.invoke(
        new Api.channels.ExportMessageLink({
          channel : chat_id,
          id : message_id,
          ...more
        })
      )
  }
  /**
   * class getAdminedPublicChannels 
   * Get channels/supergroups/geogroups we're admin in. Usually called when the user exceeds the limit for owned public channels/supergroups/geogroups, and the user is given the choice to remove one of his channels/supergroups/geogroups. 
   * params : 
   * by_location : Get geogroups 
   * check_limit : If set and the user has reached the limit of owned public channels/supergroups/geogroups, instead of returning the channel list one of the specified errors will be returned. Useful to check if a new public channel can indeed be created, even before asking the user to enter a channel username to use in channels.checkUsername/channels.updateUsername. 
   * results : 
   * gramjs messages.Chats
  */
  async getAdminedPublicChannels(by_location:boolean=true,check_limit:boolean=true){
    return client.invoke(
        new Api.channels.GetAdminedPublicChannels({
          byLocation : by_location,
          checkLimit : check_limit
        })
      )
  }
  /**
   * class getAdminLog 
   * Get the admin log of a channel/supergroup 
   * params : 
   * chat_id : chat or channel or groups id. 
   * more : gramjs GetAdminLog param with little modification 
   * results : 
   * ClassResultGetAdminLog
  */
  async getAdminLog(chat_id:number|string,more?:any|undefined){
    let filter = {
      join: more?.join || true,
      leave: more?.leave || true,
      invite: more?.invite || true,
      ban: more?.ban || true,
      unban: more?.unban || true,
      kick: more?.kick || true,
      unkick: more?.unkick || true,
      promote: more?.promote || true,
      demote: more?.demote || true,
      info: more?.info || true,
      settings: more?.settings || true,
      pinned: more?.pinned || true,
      groupCall: more?.groupCall || true,
      invites: more?.invites || true
    }
    return new reResults.ClassResultGetAdminLog(
        await client.invoke(
          new Api.channels.GetAdminLog({
            channel : chat_id,
            eventsFilter : new Api.ChannelAdminLogEventsFilter(filter),
            q : more?.q || "",
            maxId: more?.maxId || undefined,
            minId: more?.minId || undefined,
            limit: more?.limit || undefined
          })
        )
      )
  }
}
