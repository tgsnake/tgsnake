import {Logger} from 'telegram/extensions';
import {TelegramClient} from 'telegram';
import {StringSession} from 'telegram/sessions';
import {NewMessage} from 'telegram/events';
import {NewMessageEvent} from 'telegram/events/NewMessage';
import {Message} from 'telegram/tl/custom/message';
import {tele} from "./snake/tele"
import {shortcut} from "./snake/shortcut"
import {message} from "./snake/rewritejson"
const input = require("input")


export class snake {
  client:any
  api_hash:any
  api_id:any
  session:any
  bot_token:any
  telegram:any
  constructor(options:any){
    //default options
    this.api_hash = undefined 
    this.api_id = undefined
    this.session = ""
    this.bot_token = undefined
    // custom options
    if(options.logger){
      Logger.setLevel(options.logger)
    }
    if(options.api_hash){
      this.api_hash = options.api_hash
    }
    if(options.api_id){
      this.api_id = options.api_id
    }
    if(options.session){
      this.session = options.session
    }
    if(options.bot_token){
      this.bot_token = options.bot_token
    }
  }
  async run(){
    if(!this.api_hash || !this.api_id){
      throw "api_hash atau api_id tidak tersedia."
    }else{
      this.client = new TelegramClient(
          new StringSession(this.session),
          Number(this.api_id),
          String(this.api_hash),
          { connectionRetries: 5 }
        )
      this.telegram = new tele(this.client)
      if(!this.bot_token){
        await this.client.start({
          phoneNumber: async () => {
            await input.text('number ?')
          },
          password: async () => {
            await input.text('password?')
          },
          phoneCode: async () => {
            await input.text('Code ?')
          },
          onError: (err:any) => {
            throw err
          }
        })
        console.log(`Your Sessions : ${await this.client.session.save()}`)
      }else{
        await this.client.start({
          botAuthToken : this.bot_token
        })
        console.log(`Your Sessions : ${await this.client.session.save()}`)
      }
    }
  }
  async onNewMessage(next:any){
    this.client.addEventHandler((event:NewMessageEvent)=>{
      let cut = new shortcut(this.client,event)
      return next(cut,new message(cut.message,event))
    },new NewMessage({}))
  }
}