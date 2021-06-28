import {Logger} from 'telegram/extensions';
import {TelegramClient} from 'telegram';
import {StringSession} from 'telegram/sessions';
import {NewMessage} from 'telegram/events';
import {NewMessageEvent} from 'telegram/events/NewMessage';
import {Message} from 'telegram/tl/custom/message';
import {tele} from "./snake/tele"
import {shortcut} from "./snake/shortcut"
import {message} from "./snake/rewritejson"
import input from "input"
export {Api} from "telegram"

let version = "0.0.4" //change this version according to what is in package.json

let api_hash:string|undefined
let api_id:number|undefined
let session:string
let bot_token:string|undefined
let logger:string
let connection_retries:number
export class snake {
  client:any
  telegram:any
  constructor(options?:any|undefined){
    //default options
    api_hash = undefined 
    api_id = undefined
    session = ""
    bot_token = undefined
    connection_retries = 5
    logger = "none"
    // custom options
    if(options){
      if(options.logger){
        logger = options.logger
      }
      if(options.api_hash){
        api_hash = String(options.api_hash)
      }
      if(options.api_id){
        api_id = Number(options.api_id)
      }
      if(options.session){
        session = options.session
      }
      if(options.bot_token){
        bot_token = options.bot_token
      }
      if(options.connection_retries){
        connection_retries = options.connection_retries
      }
    }
    Logger.setLevel(logger)
  }
  async run(){
    process.once('SIGINT', () =>{ 
      console.log("🐍 Killing..")
      process.exit(0)
    })
    process.once('SIGTERM', () => { 
      console.log("🐍 Killing..")
      process.exit(0)
    })
    console.log(`🐍 Welcome To TGSNAKE ${version}.`)
    console.log(`🐍 Setting Logger level to "${logger}"`)
    if(!api_hash){
      api_hash = await input.text("🐍 Input your api_hash")
    }
    if(!api_id){
      api_id = await input.text("🐍 Input your api_id")
    }
    this.client = new TelegramClient(
        new StringSession(session),
        Number(api_id),
        String(api_hash),
        { 
          connectionRetries : connection_retries,
          appVersion : `🐍TGSNAKE(${version})`
        }
      )
    this.telegram = new tele(this.client)
    if(session == ""){
      if(!bot_token){
        let loginAsBot = await input.confirm("🐍 Login as bot?")
        if(!loginAsBot){
          await this.client.start({
            phoneNumber: async () => await input.text('🐍 Input your international phone number'),
            password: async () => await input.text('🐍 Input your 2FA password'),
            phoneCode: async () => await input.text('🐍 Input Telegram verifications code'),
            onError: (err:any) => console.log(`🐍 ${err}`),
          }).catch((err:any)=> console.log(`🐍 ${err}`))
          session = await this.client.session.save()
          console.log(`🐍 Your string session : ${session}`)
        }else{
          await this.client.start({
            botAuthToken : await input.text("🐍 Input your bot_token")
          }).catch((err:any)=> console.log(`🐍 ${err}`))
          session = await this.client.session.save()
          console.log(`🐍 Your string session : ${session}`)
        }
      }else{
        await this.client.start({
          botAuthToken : bot_token
        })
        session = await this.client.session.save()
        console.log(`🐍 Your string session : ${session}`)
      }
    }
      await this.client.connect()
      await this.client.getMe().catch((e:any)=>{})
      return console.log("🐍 Running..")
  }
  async onNewMessage(next:any){
    if(this.client){
      this.client.addEventHandler((event:NewMessageEvent)=>{
        let cut = new shortcut(this.client,event)
        return next(cut,cut.message)
      },new NewMessage({}))
    }
  }
  async generateSession(){
    console.log(`🐍 Welcome To TGSNAKE ${version}.`)
    console.log(`🐍 Setting Logger level to "${logger}"`)
    if(!api_hash){
      api_hash = await input.text("🐍 Input your api_hash")
    }
    if(!api_id){
      api_id = await input.text("🐍 Input your api_id")
    }
    this.client = new TelegramClient(
        new StringSession(session),
        Number(api_id),
        String(api_hash),
        { 
          connectionRetries : connection_retries,
          appVersion : `🐍TGSNAKE(${version})`
        }
      )
    this.telegram = new tele(this.client)
    if(session == ""){
      if(!bot_token){
        let loginAsBot = await input.confirm("🐍 Login as bot?")
        if(!loginAsBot){
          await this.client.start({
            phoneNumber: async () => await input.text('🐍 Input your international phone number'),
            password: async () => await input.text('🐍 Input your 2FA password'),
            phoneCode: async () => await input.text('🐍 Input Telegram verifications code'),
            onError: (err:any) => console.log(`🐍 ${err}`),
          }).catch((err:any)=> console.log(`🐍 ${err}`))
          session = await this.client.session.save()
          console.log(`🐍 Your string session : ${session}`)
        }else{
          await this.client.start({
            botAuthToken : await input.text("🐍 Input your bot_token")
          }).catch((err:any)=> console.log(`🐍 ${err}`))
          session = await this.client.session.save()
          console.log(`🐍 Your string session : ${session}`)
        }
      }else{
        await this.client.start({
          botAuthToken : bot_token
        })
        session = await this.client.session.save()
        console.log(`🐍 Your string session : ${session}`)
      }
    }else{
      console.log(`🐍 You should use the \`Snake.run()\`!`)
    }
    console.log(`🐍 Killing...`)
    process.exit(0)
  }
}