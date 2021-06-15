
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
    let chatId = message.chat?.id || message.senderId || undefined
    if(!event.isPrivate){
      chatId = Number(`-100${message.chat.id}`)
    }
    this.chat = {
      id : chatId,
      title : message.chat?.title || undefined,
      first_name : message.chat?.firstName || undefined,
      last_name : message.chat?.lastName || undefined,
      username : message.chat?.username || undefined,
      "private" : event.isPrivate || false,
      accessHash : message.chat?.accessHash || undefined
    }
   this.from = {
      id : message.sender?.id || message.senderId || undefined,
      first_name : message.sender?.firstName || undefined,
      last_name : message.sender?.lastName || undefined,
      username : message.sender?.username || undefined,
      deleted : message.sender?.deleted || false,
      restricted : message.sender?.restricted || false,
      lang : message.sender?.langCode || undefined,
      status : message.sender?.status?.className || undefined,
      accessHash : message.sender?.accessHash || undefined
    }
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