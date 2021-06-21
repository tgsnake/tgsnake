
export class ClassResultSendMessage {
  id:number|undefined
  chatId:number|undefined
  date:Date|number|undefined
  constructor(resultSendMessage:any){
    if(resultSendMessage.updates){
      this.id = resultSendMessage.updates[0]?.id || undefined
      if(resultSendMessage.chats[0]){
        this.chatId = Number(`-100${resultSendMessage.chats[0]?.id}`) || undefined
      }
    }else{
      this.id = resultSendMessage.id
    }
    this.date = resultSendMessage.date || Date.now() / 1000
  }
}

export class ClassResultEditMessage {
  id:number|undefined
  chatId:number|undefined
  date:Date|number|undefined
  constructor(resultEditMessage:any){
    this.id = resultEditMessage.updates[0]?.message.id || undefined
    if(resultEditMessage.chats.length > 0){
      this.chatId = Number(`-100${resultEditMessage.chats[0].id}`)
    }else{
      this.chatId = resultEditMessage.users[1].id
    }
    this.date = resultEditMessage.date || Date.now() / 1000
  }
}