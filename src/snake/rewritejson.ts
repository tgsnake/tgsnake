
export let message = class message {
  id:any
  chat:any
  from:any
  text:any
  constructor(message:any,event:any){
    this.id = message.id || undefined
    this.text = message.text || undefined
    this.chat = {
      id : message.chat.id || undefined,
      title : message.chat.title || undefined,
      first_name : message.chat.firstName || undefined,
      last_name : message.chat.lastName || undefined,
      username : message.chat.username || undefined,
      "private" : event.isPrivate || false
    }
   this.from = {
      id : message.sender.id || undefined,
      first_name : message.sender.firstName || undefined,
      last_name : message.sender.lastName || undefined,
      username : message.sender.username || undefined,
      deleted : message.sender.deleted || false,
      restricted : message.sender.restricted || false,
      lang : message.sender.langCode || undefined,
      status : message.sender.status.className || undefined
    }
   
  }
}