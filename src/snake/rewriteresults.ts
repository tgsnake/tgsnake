export class ClassResultSendMessage {
  id:number|undefined
  chatId:number|undefined
  date:Date|number|undefined
  /**
   * Generate new class result from sendMessage
  */
  constructor(resultSendMessage:any){
    if(resultSendMessage.updates){
      /**
       * Generate Message Id
      */
      if(resultSendMessage.updates[0] && resultSendMessage.updates[0].id){
        this.id = resultSendMessage.updates[0].id 
      }
      /**
       * Generate Chat Id
      */
      if(resultSendMessage.chats[0]){
        this.chatId = resultSendMessage.chats[0].id
      }
    }else{
      /**
       * Generate Message id
      */
      this.id = resultSendMessage.id
    }
    /**
     * Generate Date.
    */
    this.date = resultSendMessage.date || Math.floor(Date.now()/1000)
  }
}
export class ClassResultEditMessage {
  id:number|undefined
  chatId:number|undefined
  date:Date|number|undefined
  /**
   * Generate new class result from editMessage 
  */
  constructor(resultEditMessage:any){
    /**
     * Generate Message Id.
    */
    if(resultEditMessage.updates){
      if(resultEditMessage.updates[0] && resultEditMessage.updates[0].message.id){
        this.id = resultEditMessage.updates[0].message.id
      }
    }
    /**
     * Generate Chat Id.
    */
    if(resultEditMessage.chats.length > 0){
      if(resultEditMessage.chats[0] && resultEditMessage.chats[0].id){
        this.chatId = resultEditMessage.chats[0].id
      }
    }else{
      if(resultEditMessage.users.length > 0){
        let index = 1 
        for(let i = 0; i< resultEditMessage.users.length; i++){
          if(resultEditMessage.users[i].self){
            index = i
          }
        }
        this.chatId = resultEditMessage.users[index].id
      }
    }
    /**
     * Generate Date
    */
    this.date = resultEditMessage.date || Math.floor(Date.now()/1000)
  }
}
export class ClassResultForwardMessages { 
  id:number[]|undefined
  chatId:number|undefined 
  date:Date|number|undefined
  /**
   * Generate new class result from forwardMessages
  */
  constructor(resultForwardMessages:any){
    /**
     * Generate message id
    */
    if(resultForwardMessages.updates){
      let tempId:any = new Array()
      for(let i = 0; i< resultForwardMessages.updates.length; i++){
        let msg = resultForwardMessages.updates[i]
        if(msg.className == "UpdateNewChannelMessage" || msg.className == "UpdateNewMessage"){
          if(msg.message){
            tempId.push(msg.message.id)
            if(msg.message.peerId){
              if(msg.message.peerId.channelId){
                this.chatId = msg.message.peerId.channelId
              }else{
                if(msg.message.peerId.userId){
                  this.chatId = msg.message.peerId.userId
                }
              }
            }
          }
        }
      }
     this.id = tempId
    }
    /**
     * Generate Date.
    */
    this.date = resultForwardMessages.date || Math.floor(Date.now()/1000)
  }
}
export class ClassResultGetMessages {
  messages:any[]|undefined 
  date:Date|number|undefined 
  /**
   * Generate new json result from getMessages
  */
  constructor(resultGetMessages:any){
    /**
     * Generate message list
    */
    if(resultGetMessages){
      let tempMessages:any = new Array()
      if(resultGetMessages.messages){
        let msg = resultGetMessages.messages
        for(let i = 0; i< msg.length; i++){
          tempMessages.push(
              new GetMessagesClassMessages(msg[i],resultGetMessages)
            )
        }
      }
      this.messages = tempMessages
    }
    /**
     * Generate new Date.
    */
    this.date = Math.floor(Date.now()/1000)
  }
}
class GetMessagesClassMessages {
  id:number|undefined 
  fwdFrom:any|undefined 
  date:Date|number|undefined 
  text:string|undefined 
  replyToMessageId:number|undefined 
  entities:any[]|undefined 
  media:any|undefined 
  from:any|undefined 
  chat:any|undefined 
  constructor(message:any,resultGetMessages:any){
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
    }
    this.date = message.date || Math.floor(Date.now()/1000)
  }
}
class GetMessagesClassChat {
  id:number|undefined 
  title:string|undefined 
  username:string|undefined 
  first_name:string|undefined 
  last_name:string|undefined
  constructor(message:any,resultGetMessages:any){
    if(message){
      if(message._chatPeer){
        if(message._chatPeer.channelId){
          this.id = message._chatPeer.channelId
        }else{
          if(message._chatPeer.userId){
            this.id = message._chatPeer.userId
          }
        }
      }else{
        if(message.peerId){
          if(message.peerId.channelId){
            this.id = message.peerId.channelId
          }else{
            if(message.peerId.userId){
              this.id = message.peerId.channelId
            }
          }
        }
      }
    }
    if(resultGetMessages){
      if(resultGetMessages.chats.length > 0){
        for(let i = 0; i < resultGetMessages.chats.length; i++){
          if(resultGetMessages.chats[i].id == this.id){
            let sc = resultGetMessages.chats[i]
            if(sc.title){
              this.title = sc.title
            }
            if(sc.firstName){
              this.first_name = sc.firstName
            }
            if(sc.lastName){
              this.last_name = sc.lastName
            }
            if(sc.username){
              this.username = sc.username
            }
          }
        }
      }else{
        if(resultGetMessages.users.length > 0){
          for(let i = 0; i < resultGetMessages.users.length; i++){
            if(resultGetMessages.users[i].id == this.id){
              let sc = resultGetMessages.users[i]
              if(sc.title){
                this.title = sc.title
              }
              if(sc.firstName){
                this.first_name = sc.firstName
              }
              if(sc.lastName){
                this.last_name = sc.lastName
              }
              if(sc.username){
                this.username = sc.username
              }
            }
          }
        }
      }
    }
  }
}
class GetMessagesClassFrom {
  id:number|undefined 
  title:string|undefined 
  username:string|undefined 
  first_name:string|undefined 
  last_name:string|undefined
  constructor(message:any,resultGetMessages:any){
    if(message){
      if(message.fromId){
        if(message.fromId.channelId){
          this.id = message.fromId.channelId
        }else{
          if(message.fromId.userId){
            this.id = message.fromId.userId
          }
        }
      }else{
        this.id = message._senderId
      }
    }
    if(resultGetMessages){
      if(resultGetMessages.users.length > 0){
        for(let i = 0; i < resultGetMessages.users.length; i++){
          if(resultGetMessages.users[i].id == this.id){
            let sc = resultGetMessages.users[i]
            if(sc.title){
              this.title = sc.title
            }
            if(sc.firstName){
              this.first_name = sc.firstName
            }
            if(sc.lastName){
              this.last_name = sc.lastName
            }
            if(sc.username){
              this.username = sc.username
            }
          }
        }
      }else{
        if(resultGetMessages.chats.length > 0){
          for(let i = 0; i < resultGetMessages.chats.length; i++){
            if(resultGetMessages.chats[i].id == this.id){
              let sc = resultGetMessages.chats[i]
              if(sc.title){
                this.title = sc.title
              }
              if(sc.firstName){
                this.first_name = sc.firstName
              }
              if(sc.lastName){
                this.last_name = sc.lastName
              }
              if(sc.username){
                this.username = sc.username
              }
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
  /**
   * Generate new class result AffectedMessages.
  */
  constructor(resultReadHistory:any){
    if(resultReadHistory){
      /**
       * Generate pts // Event count after generation
      */
      if(resultReadHistory.pts){
        this.pts = resultReadHistory.pts
      }else{
        this.pts = 0
      }
      /**
       * Generate ptsCount // Number of events that were generated
      */
      if(resultReadHistory.ptsCount){
        this.ptsCount = resultReadHistory.ptsCount
      }else{
        this.ptsCount = 0
      }
      /**
       * Generate offset (readMentions)
      */
      if(resultReadHistory.offset){
        this.offset = resultReadHistory.offset
      }else{
        this.offset = 0
      }
    }
    this.date = Math.floor(Date.now()/1000)
  }
}