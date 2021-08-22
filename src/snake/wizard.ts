import { Shortcut } from './shortcut';
export class State {
  /**@hidden*/
  private current:{chatId:number;now:number;running:boolean;wizard:string;}[] = []
  /**@hidden*/
  private wizard!:Session<any>[]
  /**@hidden*/
  private middleware:{(ctx:Shortcut):void}[] = [] 
  /**@hidden*/
  private ctx!:Shortcut 
  constructor(wizard:Session<any>[]){
    this.wizard = wizard
  }
  /**@hidden*/
  private running(){
    this.current.forEach((e,i)=>{
      if(e.chatId == this.ctx.message.from.id){
        if(e.running){
          this.wizard.forEach(async (wzrd,indx)=>{
            if(wzrd.name == e.wizard){
              await wzrd.find(e.chatId)
              if(this.middleware.length > 0){
                this.middleware.forEach((mid)=>{
                   mid(this.ctx)
                })
              }
              this.current.forEach(async (user)=>{
                if(user.chatId == this.ctx.message.from.id){
                  if(user.running){
                    await wzrd.wizard[user.now](this.ctx)
                    await wzrd.save(user.chatId)
                    user.now = user.now+1
                    if(wzrd.wizard[user.now]){
                      return user.running = true
                    }else{
                      user.running = false
                      return this.current.splice(i,1)
                    }
                  }
                }
              })
            }
          })
        }
      }
    }) 
    return;
  }
  launch(name:string){
    this.wizard.forEach((wzrd,indx)=>{
      if(wzrd.name == name){
        if(this.current.length == 0){
          this.current.push({chatId:this.ctx.message.from.id,now:0,running:true,wizard:wzrd.name})
        }else{
          let index = this.current.findIndex((e)=>{return e.chatId == this.ctx.message.from.id})
          if(index == -1){
            this.current.push({chatId:this.ctx.message.from.id,now:0,running:true,wizard:wzrd.name})
          }
        }
        return this.running()
      }
    })
    return
  }
  init(event:Shortcut){
    this.ctx = event 
    return this.running()
  }
  use(func:{(ctx:Shortcut):void}){
    return this.middleware.push(func)
  }
  quit(){
    this.current.forEach((e,i)=>{
      if(e.chatId == this.ctx.message.from.id){
        if(e.running){
          e.running = false
          return this.current.splice(i,1)
        }
      }
    })
  }
}
export class Session<StateInterface>{ 
  state!:StateInterface
  name!:string
  wizard!:{(ctx:Shortcut):void}[] 
  /** @hidden */
  private database:{chatId:number,data:StateInterface}[] = []
  constructor(wizardName:string,...wizardFunc:{(ctx:Shortcut):void}[]){
    this.name = wizardName 
    this.wizard = wizardFunc
  }
  /** @hidden */
  save(chatId:number){
    let index:number = this.database.findIndex((item)=>{return item.chatId === chatId})
    if(index === -1){
      this.database.push({
        chatId : chatId,
        data : this.state
      })
    }else{
      this.database[index].data = this.state
    }
    return this.database
  }
  /** @hidden */
  find(chatId:number){
    let index:number = this.database.findIndex((item)=>{return item.chatId === chatId})
    if(index != -1){
      this.state = this.database[index].data
    }
    return this.state
  }
}