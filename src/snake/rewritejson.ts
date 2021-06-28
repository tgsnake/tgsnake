
export class message {
  id:any
  chat:any
  from:any
  text:any
  peer:any
  entities:any
  replyToMessageId:any
  date:Date|number|any
  media:any
  /**
   * rewrite json from incoming message. 
   * original message can be found in bot.event.message.
  */
  constructor(message:any,event:any){
    /**
     * message id from incoming new message
    */
   this.id = message.id || undefined
   /**
    * class chatClass
   */
   this.chat = new chatClass(message,event)
   /**
    * class fromClass
   */
   this.from = new fromClass(message,event)
   /**
    * date of sending message
   */
   this.date = message.date || Date.now() / 1000
   /**
    * if user sending text with entities (bold/italic/etc..) this object will showing.
   */
   if(message.entities){
    this.entities = message.entities
   }
   /**
    * message_id if user reply some message.
   */
   if(message.replyTo !== null){
     if(message.replyTo.replyToMsgId){
      this.replyToMessageId = message.replyTo.replyToMsgId
     }
   }
   /**
    * if user sending message this object will showing
   */
   if(message.message){
     this.text = message.message
   } 
   /**
    * if user sending media this object will showing.
   */
   if(message.media){
     this.media = message.media
   }
  }
}
class chatClass {
  id:number|undefined
  title:string|undefined
  first_name:string|undefined
  last_name:string|undefined
  username:string|undefined
  accessHash:any|undefined
  private:string|undefined
  /**
   * To generate new json from `message.chat`
  */
  constructor(message:any,event:any){
    if(message.chat){
      /**
       * Generate chatId. 
       * If chat id == undefined this constructor don't have chatId 
       * use this chat id to call telegram api.
      */
      if(message.chat.id){
        this.id = message.chat.id
      }
      /**
       * Generate Title of chat 
       * title of groups or channel when nee message comming.
      */
      if(message.chat.title){
        this.title = message.chat.title
      }
      /**
       * Generate First Name (private chat)
       * first name from user when user sending message in private chat
      */
      if(message.chat.firstName){
        this.first_name = message.chat.firstName
      }
      /**
       * Generate Last Name (private chat)
       * last name from user when user sending message in private chat
      */
      if(message.chat.lastName){
        this.last_name = message.chat.lastName
      }
      /**
       *  Generate Username 
       * username from chat (groups/channel/user)
      */
      if(message.chat.username){
        this.username = message.chat.username
      }
      /**
       * Generate Access Hash 
       * Access hash (BigInt) to call some telegram api.
      */
      if(message.chat.accessHash){
        this.accessHash = message.chat.accessHash
      }
    }else{
      /**
       * if message.chat.id not found change with this
      */
      if(message.senderId){
        this.id = message.senderId
      }
    }
    /**
     * Generate typeof chat (private/groups)
     * where user sending messsage.
    */
    this.private = event.isPrivate || false
  }
}
class fromClass {
  id:number|undefined
  first_name:string|undefined
  last_name:string|undefined
  username:string|undefined
  deleted:boolean|undefined
  restricted:boolean|undefined
  lang:string|undefined
  status:string|undefined
  accessHash:any|undefined
  /**
   * To generate json from `message.sender`
  */
  constructor(message:any,event:any){
    if(message.sender){
      /**
       * Generate userId 
       * userId is id when user sends message to group/private chat
      */
      if(message.sender.id){
        this.id = message.sender.id
      }
      /**
       * Generate First Name 
       * firstName from user when sending message
      */
      if(message.sender.firstName){
        this.first_name = message.sender.firstName
      }
      /**
       * Generate Last Name 
       * lastName from user when sending message
      */
      if(message.sender.lastName){
        this.last_name = message.sender.lastName
      }
      /**
       * Generate username 
       * firstName from user when sending message
      */
      if(message.sender.username){
        this.username = message.sender.username
      }
      /**
       *  if user delete account this object will showing
      */
      if(message.sender.deleted){
        this.deleted = message.sender.deleted
      }
      /**
       *  if user restricted this object will showing
      */
      if(message.sender.restricted){
        this.restricted = message.sender.restricted
      }
      /**
       * language used by user
      */
      if(message.sender.langCode){
        this.lang = message.sender.langCode
      }
      /**
       * Last seen from user 
      */
      if(message.sender.status){
        if(message.sender.status.className){
          this.status = message.sender.status.className
        }
      }
      /**
       * Generate Access Hash
      */
      if(message.sender.accessHash){
        this.accessHash = message.sender.accessHash
      }
    }else{
      /**
       * if message.sender.id not found change with this
      */
      if(message.senderId){
        this.id = message.senderId
      }
    }
  }
}
