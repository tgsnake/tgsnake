import * as Interface from "./interface"
import {Api} from "telegram"
import BigInt,{BigInteger} from "big-integer"
export class ClassResultSendMessage {
  /**
   * Message Id where message successfully sent.
  */
  id!:number
  /**
   * ChatId where message sent. 
   * ``ChatId`` only showing where sending message in channel/supergroups.
  */
  chatId!:number
  /**
   * Date the message sending.
  */
  date:Date|number = Math.floor(Date.now()/1000)
  /**
   * Original JSON Update from telegram where typeof not match with Api.UpdateShortSentMessage or Api.Updates
  */
  original?:Api.TypeUpdates
  constructor(resultSendMessage:Api.TypeUpdates){
    if(resultSendMessage instanceof Api.UpdateShortSentMessage){
      this.id = resultSendMessage.id
      this.date = resultSendMessage.date
    }else if(resultSendMessage instanceof Api.Updates){
      if(resultSendMessage.updates?.length > 0){
        for(let i = 0; i< resultSendMessage.updates.length; i++){
          if(resultSendMessage.updates[i].className == "UpdateNewChannelMessage"){
            let js = resultSendMessage.updates[i] as Api.UpdateNewChannelMessage
            let msg = (js.message) as Api.Message 
            this.id = msg.id 
            this.date = msg.date
            if((msg.peerId) instanceof Api.PeerChannel){
              let peer = (msg.peerId) as Api.PeerChannel
              this.chatId = peer.channelId
            }
          }
          if(resultSendMessage.updates[i].className == "UpdateNewMessage"){
            let js = resultSendMessage.updates[i] as Api.UpdateNewMessage
            let msg = (js.message) as Api.Message 
            this.id = msg.id 
            this.date = msg.date
            if((msg.peerId) instanceof Api.PeerUser){
              let peer = (msg.peerId) as Api.PeerUser
              this.chatId = peer.userId
            }
            if((msg.peerId) instanceof Api.PeerChat){
              let peer = (msg.peerId) as Api.PeerChat 
              this.chatId = peer.chatId 
            }
          }
        }
      }
    }else{
      this.original = resultSendMessage
    }
  }
}
export class ClassResultEditMessage {
  /** 
   * The message id where message successfully edited.
  */
  id!:number 
  /**
   * ChatId where message successfully edited. 
  */
  chatId!:number 
  /**
   * Date message edited
  */
  date:Date|number = Math.floor(Date.now()/1000) 
  /**
   * Original JSON Update.
  */
  original?:Api.TypeUpdates
  constructor(resultEditMessage:Api.TypeUpdates){
    if(resultEditMessage instanceof Api.Updates){
      if(resultEditMessage.updates?.length > 0){
        for(let i = 0; i < resultEditMessage.updates.length; i++){
          if(resultEditMessage.updates[i].className == "UpdateEditChannelMessage"){
            let js = resultEditMessage.updates[i] as Api.UpdateEditChannelMessage
            let msg = (js.message) as Api.Message
            this.id = msg.id
            this.date = msg.date
            if((msg.peerId) instanceof Api.PeerChannel){
              let peer = (msg.peerId) as Api.PeerChannel 
              this.chatId = peer.channelId
            }
          }else{
            if(resultEditMessage.updates[i].className == "UpdateEditMessage"){
              let js = resultEditMessage.updates[i] as Api.UpdateEditMessage
              let msg = (js.message) as Api.Message
              this.id = msg.id
              this.date = msg.date
              if((msg.peerId) instanceof Api.PeerUser){
                let peer = (msg.peerId) as Api.PeerUser 
                this.chatId = peer.userId
              }
              if((msg.peerId) instanceof Api.PeerChat){
                let peer = (msg.peerId) as Api.PeerChat 
                this.chatId = peer.chatId
              }
            }
          }
        }
      }
    }else{
      this.original = resultEditMessage
    }
  }
}
export class ClassResultForwardMessages { 
  /**
   * Array of message id where message successfully forwarded.
  */
  id!:number[]
  /**
   * ChatId where message forwarded.
  */
  chatId!:number 
  /**
   * Date where message forwarded.
  */
  date:Date|number = Math.floor(Date.now()/1000)
  /**
   * Original Json from gramjs
  */
  original?:Api.TypeUpdates
  constructor(resultForwardMessages:Api.TypeUpdates){
    if(resultForwardMessages instanceof Api.Updates){
      if(resultForwardMessages?.updates.length > 0){
        let tempId:any = new Array()
        for(let i = 0; i< resultForwardMessages.updates.length; i++){
          if(resultForwardMessages.updates[i] instanceof Api.UpdateNewChannelMessage){
            let js = resultForwardMessages.updates[i] as Api.UpdateNewChannelMessage 
            let msg = (js.message) as Api.Message 
            tempId.push(msg.id)
            this.date = msg.date
            if((msg.peerId) instanceof Api.PeerChannel){
              let peer = (msg.peerId) as Api.PeerChannel 
              this.chatId = peer.channelId 
            }
          }
          if(resultForwardMessages.updates[i] instanceof Api.UpdateNewMessage){
            let js = resultForwardMessages.updates[i] as Api.UpdateNewMessage 
            let msg = (js.message) as Api.Message 
            tempId.push(msg.id) 
            this.date = msg.date
            if((msg.peerId) instanceof Api.PeerUser){
              let peer = (msg.peerId) as Api.PeerUser 
              this.chatId = peer.userId 
            }
            if((msg.peerId) instanceof Api.PeerChat){
              let peer = (msg.peerId) as Api.PeerChat
              this.chatId = peer.chatId 
            }
          }
        }
       this.id = tempId
      }
    }else{
      this.original = resultForwardMessages
    }
  }
}
export class ClassResultGetMessages {
  /**
   * Array from message.
  */
  messages?:GetMessagesClassMessages[]
  /**
   * Date where results created.
  */
  date:Date|number = Math.floor(Date.now()/1000)
  /**
   * Original JSON from gramjs.
  */
  original?:Api.messages.TypeMessages
  constructor(resultGetMessages:Api.messages.TypeMessages){
    let tempMessages:any = new Array()
    if(resultGetMessages instanceof Api.messages.ChannelMessages){
      for(let i = 0; i < resultGetMessages.messages.length; i++){
        let msg = resultGetMessages.messages[i] as Api.Message 
        tempMessages.push(
            new GetMessagesClassMessages(
                msg,
                resultGetMessages
              )
          )
      }
    }
    if(resultGetMessages instanceof Api.messages.Messages){
      for(let i = 0; i < resultGetMessages.messages.length; i++){
        let msg = resultGetMessages.messages[i] as Api.Message 
        tempMessages.push(
            new GetMessagesClassMessages(
                msg,
                resultGetMessages
              )
          )
      }
    }
    this.messages = tempMessages
  }
}
class GetMessagesClassMessages {
  /**
   * Message Id
  */
  id!:number 
  /**
   * MessageFwdHeader
  */
  fwdFrom?:Api.MessageFwdHeader
  /**
   * Date from message
  */
  date:Date|number = Math.floor(Date.now()/1000) 
  /**
   * Text
  */
  text?:string|undefined 
  /**
   * replyToMessageId
  */
  replyToMessageId?:number 
  /**
   * Messahe Entities
  */
  entities?:Api.TypeMessageEntity[] 
  /**
   * Message Media
  */
  media?:Api.TypeMessageMedia 
  /**
   * GetMessagesClassFrom
  */
  from?:GetMessagesClassFrom 
  /**
   * GetMessagesClassChat
  */
  chat?:GetMessagesClassChat
  constructor(message:Api.Message,resultGetMessages:Api.messages.ChannelMessages|Api.messages.Messages){
    if(message){
      this.from = new GetMessagesClassFrom(message,resultGetMessages)
      this.chat = new GetMessagesClassChat(message,resultGetMessages)
      if(message.id){
        this.id = message.id
      }
      if(message.message){
        this.text = message.message
      }
      if(message.media){
        this.media = message.media
      }
      if(message.entities){
        this.entities = message.entities
      }
      if(message.fwdFrom){
        this.fwdFrom = message.fwdFrom
      }
      if(message.replyTo){
       if(message.replyTo.replyToMsgId){
        this.replyToMessageId = message.replyTo.replyToMsgId
       }
     }
     if(message.date){
       this.date = message.date
     }
    }
  }
}
class GetMessagesClassChat {
  /**
   * ChatId
  */
  id!:number 
  /**
   * Chat Title
  */
  title?:string 
  /**
   * Chat Username
  */
  username?:string 
  /**
   * Chat FirstName
  */
  first_name?:string 
  /**
   * Chat LastName
  */
  last_name?:string 
  /**
   * Is PrivateChat
  */
  private?:boolean
  constructor(message:Api.Message,resultGetMessages:Api.messages.ChannelMessages|Api.messages.Messages){
    if((message.peerId) instanceof Api.PeerChannel){
      let peer = (message.peerId) as Api.PeerChannel 
      this.id = peer.channelId
    }
    if((message.peerId) instanceof Api.PeerChat){
      let peer = (message.peerId) as Api.PeerChat
      this.id = peer.chatId 
    }
    if((message.peerId) instanceof Api.PeerUser){
      let peer = (message.peerId) as Api.PeerUser 
      this.id = peer.userId
    }
    if(resultGetMessages.chats?.length > 0){
      for(let i = 0; i < resultGetMessages.chats.length; i++){
        if(resultGetMessages.chats[i] instanceof Api.Channel){
          let chat = resultGetMessages.chats[i] as Api.Channel 
          if(chat.id == this.id){
            if(chat.title){
              this.title = chat.title 
            }
            if(chat.username){
              this.username = chat.username 
            }
            this.private = false
          }
        }
        if(resultGetMessages.chats[i] instanceof Api.Chat){
          let chat = resultGetMessages.chats[i] as Api.Chat 
          if(chat.id == this.id){
            if(chat.title){
              this.title = chat.title 
            }
            this.private = false
          }
        }
        if(resultGetMessages.chats[i] instanceof Api.User){
          let chat = resultGetMessages.chats[i] as Api.User 
          if(chat.id == this.id){
            if(chat.username){
              this.username = chat.username 
            }
            if(chat.firstName){
              this.first_name = chat.firstName
            }
            if(chat.lastName){
              this.last_name = chat.lastName
            }
            this.private = true
          }
        }
      }
    }else{
      if(resultGetMessages.users?.length > 0){
        for(let i = 0; i < resultGetMessages.users.length; i++){
          if(resultGetMessages.users[i] instanceof Api.Channel){
            let chat = resultGetMessages.users[i] as Api.Channel 
            if(chat.id == this.id){
              if(chat.title){
                this.title = chat.title 
              }
              if(chat.username){
                this.username = chat.username 
              }
              this.private = false
            }
          }
          if(resultGetMessages.users[i] instanceof Api.Chat){
            let chat = resultGetMessages.users[i] as Api.Chat 
            if(chat.id == this.id){
              if(chat.title){
                this.title = chat.title 
              }
              this.private = false
            }
          }
          if(resultGetMessages.users[i] instanceof Api.User){
            let chat = resultGetMessages.users[i] as Api.User 
            if(chat.id == this.id){
              if(chat.username){
                this.username = chat.username 
              }
              if(chat.firstName){
                this.first_name = chat.firstName
              }
              if(chat.lastName){
                this.last_name = chat.lastName
              }
              this.private = true
            }
          }
        }
      }
    }
  }
}
class GetMessagesClassFrom { 
  /** 
   * User Id
  */
  id!:number 
  /**
   * User Title
  */
  title?:string 
  /**
   * UserName
  */
  username?:string 
  /**
   * User FirstName
  */
  first_name?:string 
  /**
   * User LastName
  */
  last_name?:string 
  /**
   * Is PrivateChat
  */
  private?:boolean
  constructor(message:Api.Message,resultGetMessages:Api.messages.ChannelMessages|Api.messages.Messages){
    if(message.fromId !== null){
      if((message.fromId) instanceof Api.PeerChannel){
        let peer = (message.fromId) as Api.PeerChannel 
        this.id = peer.channelId
      }
      if((message.fromId) instanceof Api.PeerChat){
        let peer = (message.fromId) as Api.PeerChat
        this.id = peer.chatId 
      }
      if((message.fromId) instanceof Api.PeerUser){
        let peer = (message.fromId) as Api.PeerUser 
        this.id = peer.userId
      }
    }else{
      if((message.peerId) instanceof Api.PeerChannel){
        let peer = (message.peerId) as Api.PeerChannel 
        this.id = peer.channelId
      }
      if((message.peerId) instanceof Api.PeerChat){
        let peer = (message.peerId) as Api.PeerChat
        this.id = peer.chatId 
      }
      if((message.peerId) instanceof Api.PeerUser){
        let peer = (message.peerId) as Api.PeerUser
        this.id = peer.userId
      }
    }
    if(resultGetMessages.users?.length > 0){
      for(let i = 0; i < resultGetMessages.users.length; i++){
        if(resultGetMessages.users[i] instanceof Api.Channel){
          let chat = resultGetMessages.users[i] as Api.Channel 
          if(chat.id == this.id){
            if(chat.title){
              this.title = chat.title 
            }
            if(chat.username){
              this.username = chat.username 
            }
            this.private = false
          }
        }
        if(resultGetMessages.users[i] instanceof Api.Chat){
          let chat = resultGetMessages.users[i] as Api.Chat 
          if(chat.id == this.id){
            if(chat.title){
              this.title = chat.title 
            }
            this.private = false
          }
        }
        if(resultGetMessages.users[i] instanceof Api.User){
          let chat = resultGetMessages.users[i] as Api.User 
          if(chat.id == this.id){
            if(chat.username){
              this.username = chat.username 
            }
            if(chat.firstName){
              this.first_name = chat.firstName
            }
            if(chat.lastName){
              this.last_name = chat.lastName
            }
            this.private = true
          }
        }
      }
    }else{
      if(resultGetMessages.chats?.length > 0){
        for(let i = 0; i < resultGetMessages.chats.length; i++){
          if(resultGetMessages.chats[i] instanceof Api.Channel){
            let chat = resultGetMessages.chats[i] as Api.Channel 
            if(chat.id == this.id){
              if(chat.title){
                this.title = chat.title 
              }
              if(chat.username){
                this.username = chat.username 
              }
              this.private = false
            }
          }
          if(resultGetMessages.chats[i] instanceof Api.Chat){
            let chat = resultGetMessages.chats[i] as Api.Chat 
            if(chat.id == this.id){
              if(chat.title){
                this.title = chat.title 
              }
              this.private = false
            }
          }
          if(resultGetMessages.chats[i] instanceof Api.User){
            let chat = resultGetMessages.chats[i] as Api.User 
            if(chat.id == this.id){
              if(chat.username){
                this.username = chat.username 
              }
              if(chat.firstName){
                this.first_name = chat.firstName
              }
              if(chat.lastName){
                this.last_name = chat.lastName
              }
              this.private = true
            }
          }
        }
      }
    }
  }
}
export class ClassResultGetMessagesViews {
  views:any[]|undefined 
  date:Date|number|undefined 
  /**
   * Generate new json result from getMessagesViews.
  */
  constructor(resultGetMessagesViews:any){
    if(resultGetMessagesViews){
      if(resultGetMessagesViews.views){
        let tempViews:any = new Array()
        for(let i = 0; i< resultGetMessagesViews.views.length; i++){
          tempViews.push(new GetMessagesViewsClassViews(resultGetMessagesViews.views[i]))
        }
        this.views = tempViews
      }
    }
    this.date = Math.floor(Date.now()/1000)
  }
}
class GetMessagesViewsClassViews {
  views:number|undefined 
  forwards:any|undefined 
  replies:any|undefined 
  flags:number|undefined 
  constructor(getMessagesViews:any){
    if(getMessagesViews){
      if(getMessagesViews.flags){
        this.flags = getMessagesViews.flags
      }
      if(getMessagesViews.views){
        this.views = getMessagesViews.views
      }
      if(getMessagesViews.forwards){
        this.forwards = getMessagesViews.forwards
      }
      if(getMessagesViews.replies){
        this.replies = getMessagesViews.replies
      }
    }
  }
}
export class ClassResultAffectedMessages {
  pts:number|undefined 
  ptsCount:number|undefined 
  offset:number|undefined  
  date:Date|number|undefined
  constructor(resultReadHistory:any){
    if(resultReadHistory){
      if(resultReadHistory.pts){
        this.pts = resultReadHistory.pts
      }else{
        this.pts = 0
      }
      if(resultReadHistory.ptsCount){
        this.ptsCount = resultReadHistory.ptsCount
      }else{
        this.ptsCount = 0
      }
      if(resultReadHistory.offset){
        this.offset = resultReadHistory.offset
      }else{
        this.offset = 0
      }
    }
    this.date = Math.floor(Date.now()/1000)
  }
}
export class ClassResultPinMessage {
  chatId:number|undefined 
  id:number|undefined 
  date:Date|number|undefined 
  messages:number[]|undefined
  constructor(ResutPinMessage:any){
    if(ResutPinMessage){
      if(ResutPinMessage.updates.length > 0){
        for(let i = 0; i< ResutPinMessage.updates.length; i++){
          let msg = ResutPinMessage.updates[i]
          if(msg.className == "UpdatePinnedChannelMessages"){
            if(msg.messages){
              this.messages = msg.messages
            }
            if(msg.channelId){
              this.chatId = msg.channelId
            }
          }else{
            if(msg.className == "UpdatePinnedMessages"){
              if(msg.messages){
                this.messages = msg.messages
              }
              if(msg.peer.userId){
                this.chatId = msg.peer.userId
              }
            }
          }
          if(msg.className == "UpdateNewChannelMessage"){
            if(msg.message.action){
              if(msg.message.action.className == "MessageActionPinMessage"){
                this.id = msg.message.id
              }
            }
          }else{
            if(msg.className == "UpdateNewMessage"){
              if(msg.message.action){
                if(msg.message.action.className == "MessageActionPinMessage"){
                  this.id = msg.message.id
                }
              }
            }
          }
        }
      }
    }
    this.date = Math.floor(Date.now()/1000)
  }
}
export class ClassResultEditAdminOrBanned {
  chatId:number|undefined 
  fromId:number|undefined
  date:Date|number|undefined 
  id:number|undefined
  constructor(resultEditAdminOrBanned:any){
    if(resultEditAdminOrBanned){
      if(resultEditAdminOrBanned.chats.length > 0){
        this.chatId = resultEditAdminOrBanned.chats[0].id
      }
      if(resultEditAdminOrBanned.updates.length > 0){
        for(let i = 0; i< resultEditAdminOrBanned.updates.length; i++){
          if(resultEditAdminOrBanned.updates[i].className == "UpdateNewChannelMessage"){
            this.id = resultEditAdminOrBanned.updates[i].message.id
          }
        }
      }
      if(resultEditAdminOrBanned.users.length > 0){
        if(!this.fromId){
          for(let i = 0; i< resultEditAdminOrBanned.users.length; i++){
            if(!resultEditAdminOrBanned.users[i].self){
              this.fromId = resultEditAdminOrBanned.users[i].id
            }
          }
        }
      }
      this.date = resultEditAdminOrBanned.date || Math.floor(Date.now()/1000)
    }
  }
}
export class ClassResultEditPhotoOrTitle {
  id:number|undefined 
  chatId:number|undefined 
  date:Date|number|undefined
  constructor(resultEditPhoto:any){
    if(resultEditPhoto){
      if(resultEditPhoto.updates.length > 0){
        for(let i = 0; i < resultEditPhoto.updates.length; i++){
          if(resultEditPhoto.updates[i].className == "UpdateNewChannelMessage"){
            this.id = resultEditPhoto.updates[i].message.id
            this.date = resultEditPhoto.updates[i].message.date
            if(resultEditPhoto.updates[i].message.peerId){
              this.chatId = resultEditPhoto.updates[i].message.peerId.channelId
            }
          }
        }
      }
    }
    if(!this.date){
      this.date = Math.floor(Date.now()/1000)
    }
  }
}
export class ClassResultGetAdminLog {
  log:any[] = new Array()
  constructor(resultGetAdminLog:any){
    if(resultGetAdminLog){
      console.log(JSON.stringify(resultGetAdminLog,null,2))
      if(resultGetAdminLog.events.length > 0){
        let tempLog:any = new Array() 
        for(let i = 0; i < resultGetAdminLog.events.length ; i++){
          let event = resultGetAdminLog.events[i]
          tempLog.push(new ClassLogGetAdminLog(event))
        }
        this.log = tempLog
      }
    }
  }
}
class ClassLogGetAdminLog {
  id:number|string|undefined 
  date:Date|number|undefined 
  action:any|undefined 
  userId:number|undefined 
  constructor(event){
    if(event){
      if(event.id) this.id = event.id 
      if(event.date) this.date = event.date 
      if(event.userId) this.userId = event.userId 
      if(event.action) {
        let tempAction = {...event.action}
        delete tempAction.CONSTRUCTOR_ID
        delete tempAction.SUBCLASS_OF_ID 
        delete tempAction.classType 
        tempAction.actionName = String(tempAction.className).replace(/^(ChannelAdminLogEventAction|AdminLogEventAction)/i,"") 
        delete tempAction.className 
        this.action = tempAction
      }
    }
  }
}
export class ClassResultMessageChat {
  chats:any[] = new Array()
  constructor(resultMessageChat:any){
    if(resultMessageChat){
      if(resultMessageChat.chats.length > 0){
        this.chats = resultMessageChat.chats
      }
    }
  }
}
export class ClassResultUploadFile {
  id:Api.long;
  parts:number;
  name:string;
  md5Checksum:string;
  constructor(resultUploadFile:Api.InputFile|Api.InputFileBig){
    this.id = resultUploadFile.id
    this.parts = resultUploadFile.parts
    this.name = resultUploadFile.name
    this.md5Checksum = ""
    if(resultUploadFile instanceof Api.InputFile ){
      this.md5Checksum = resultUploadFile.md5Checksum
    }
  }
}