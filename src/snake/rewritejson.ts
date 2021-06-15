
export class message {
  id:any
  chat:any
  from:any
  text:any
  peer:any
  entities:any
  replyToMessageId:any
  constructor(message:any,event:any){
   //console.log(message)
   this.id = message.id || undefined
   this.text = message.text || undefined
   this.chat = new chatClass(message,event)
   this.from = new fromClass(message,event)
   this.peer = {
     chatPeer : message._chatPeer || undefined,
     inputChat : message._inputChat || undefined
   }
   this.entities = message.entities || undefined
   this.replyToMessageId = undefined
   if(message.replyTo !== null){
     this.replyToMessageId = message.replyTo.replyToMsgId || undefined
   }
  }
}
export class chatClass {
  id:number|undefined
  title:string|undefined
  first_name:string|undefined
  last_name:string|undefined
  username:string|undefined
  accessHash:any|undefined
  private:string|undefined
  constructor(message:any,event:any){
    let chatId = message.chat?.id || message.senderId || undefined
    if(!event.isPrivate){
      chatId = Number(`-100${message.chat.id}`)
    }
    this.id = chatId,
    this.title = message.chat?.title || undefined,
    this.first_name = message.chat?.firstName || undefined,
    this.last_name = message.chat?.lastName || undefined,
    this.username = message.chat?.username || undefined,
    this.private = event.isPrivate || false,
    this.accessHash = message.chat?.accessHash || undefined
  }
}
export class fromClass {
  id:number|undefined
  first_name:string|undefined
  last_name:string|undefined
  username:string|undefined
  deleted:boolean|undefined
  restricted:boolean|undefined
  lang:string|undefined
  status:string|undefined
  accessHash:any|undefined
  constructor(message:any,event:any){
    this.id = message.sender?.id || message.senderId || undefined,
    this.first_name = message.sender?.firstName || undefined,
    this.last_name = message.sender?.lastName || undefined,
    this.username = message.sender?.username || undefined,
    this.deleted = message.sender?.deleted || false,
    this.restricted = message.sender?.restricted || false,
    this.lang = message.sender?.langCode || undefined,
    this.status = message.sender?.status?.className || undefined,
    this.accessHash = message.sender?.accessHash || undefined
  }
}
