import {Logger} from 'telegram/extensions';
import {TelegramClient} from 'telegram';
import {StringSession} from 'telegram/sessions';
import {NewMessage} from 'telegram/events';
import {NewMessageEvent} from 'telegram/events/NewMessage';
import {Message} from 'telegram/tl/custom/message';
import {tele} from "./snake/tele"
import {shortcut} from "./snake/shortcut"
import {message} from "./snake/rewritejson"
import prompts from "prompts"
export {Api} from "telegram"

let version = "0.0.4" //change this version according to what is in package.json

let api_hash:string|undefined
let api_id:number|undefined
let session:string
let bot_token:string|undefined
let logger:string
let tgsnakeLog:boolean = true
let connection_retries:number
let appVersion:string

function log(text){
  if(tgsnakeLog){
    return console.log(text)
  }
}

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
      if(options.appVersion){
        appVersion = options.appVersion
      }
      if(String(options.tgSnakeLog) == "false"){
        tgsnakeLog = false
      }
    }
    Logger.setLevel(logger)
  }
  async run(){
    process.once('SIGINT', () =>{ 
      log("🐍 Killing..")
      process.exit(0)
    })
    process.once('SIGTERM', () => { 
      log("🐍 Killing..")
      process.exit(0)
    })
    log(`🐍 Welcome To TGSNAKE ${version}.`)
    log(`🐍 Setting Logger level to "${logger}"`)
    if(!api_hash){
      let input_api_hash = await prompts({
        type : "text",
        name : "value",
        message : "🐍 Input your api_hash",
      })
      api_hash = input_api_hash.value
    }
    if(!api_id){
      let input_api_id = await prompts({
        type : "text",
        name : "value",
        message : "🐍 Input your api_id",
      })
      api_id = input_api_id.value
    }
    this.client = new TelegramClient(
        new StringSession(session),
        Number(api_id),
        String(api_hash),
        { 
          connectionRetries : connection_retries,
          appVersion : appVersion || version
        }
      )
    this.telegram = new tele(this.client)
    if(session == ""){
      if(!bot_token){
        let loginAsBot = await prompts({
          type : "confirm",
          name : "value",
          initial : false,
          message : "🐍 Login as bot?"
        })
        if(!loginAsBot.value){
          await this.client.start({
            phoneNumber: async () => {
              let value = await prompts({
                type : "text",
                name : "value",
                message : "🐍 Input your international phone number"
              })
              return value.value
            },
            password: async () => {
              let value = await prompts({
                type : "text",
                name : "value",
                message : "🐍 Input your 2FA password"
              })
              return value.value
            },
            phoneCode: async () => { 
              let value = await prompts({
                type : "text",
                name : "value",
                message : "🐍 Input Telegram verifications code"
              })
              return value.value
            },
            onError: (err:any) => { 
              console.log(err)
            },
          })
          session = await this.client.session.save()
          log(`🐍 Your string session : ${session}`)
        }else{
          await this.client.start({
            botAuthToken : async () => {
              let value = await prompts({
                type : "text",
                name : "value",
                message : "🐍 Input your bot_token"
              })
              return value.value
            }
          })
          session = await this.client.session.save()
          log(`🐍 Your string session : ${session}`)
        }
      }else{
        await this.client.start({
          botAuthToken : bot_token
        })
        session = await this.client.session.save()
        log(`🐍 Your string session : ${session}`)
      }
    }
      await this.client.connect()
      await this.client.getMe().catch((e:any)=>{})
      return log("🐍 Running..")
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
    process.once('SIGINT', () =>{ 
      log("🐍 Killing..")
      process.exit(0)
    })
    process.once('SIGTERM', () => { 
      log("🐍 Killing..")
      process.exit(0)
    })
    log(`🐍 Welcome To TGSNAKE ${version}.`)
    log(`🐍 Setting Logger level to "${logger}"`)
    if(!api_hash){
      let input_api_hash = await prompts({
        type : "text",
        name : "value",
        message : "🐍 Input your api_hash",
      })
      api_hash = input_api_hash.value
    }
    if(!api_id){
      let input_api_id = await prompts({
        type : "text",
        name : "value",
        message : "🐍 Input your api_id",
      })
      api_id = input_api_id.value
    }
    this.client = new TelegramClient(
        new StringSession(session),
        Number(api_id),
        String(api_hash),
        { 
          connectionRetries : connection_retries,
          appVersion : appVersion || version
        }
      )
    this.telegram = new tele(this.client)
    if(session == ""){
      if(!bot_token){
        let loginAsBot = await prompts({
          type : "confirm",
          name : "value",
          initial : false,
          message : "🐍 Login as bot?"
        })
        if(!loginAsBot.value){
          await this.client.start({
            phoneNumber: async () => {
              let value = await prompts({
                type : "text",
                name : "value",
                message : "🐍 Input your international phone number"
              })
              return value.value
            },
            password: async () => {
              let value = await prompts({
                type : "text",
                name : "value",
                message : "🐍 Input your 2FA password"
              })
              return value.value
            },
            phoneCode: async () => { 
              let value = await prompts({
                type : "text",
                name : "value",
                message : "🐍 Input Telegram verifications code"
              })
              return value.value
            },
            onError: (err:any) => { 
              console.log(err)
            },
          })
          session = await this.client.session.save()
          console.log(`🐍 Your string session : ${session}`)
        }else{
          await this.client.start({
            botAuthToken : async () => {
              let value = await prompts({
                type : "text",
                name : "value",
                message : "🐍 Input your bot_token"
              })
              return value.value
            }
          })
          session = await this.client.session.save()
          log(`🐍 Your string session : ${session}`)
        }
      }else{
        await this.client.start({
          botAuthToken : bot_token
        })
        session = await this.client.session.save()
        log(`🐍 Your string session : ${session}`)
      }
    }else{
      log(`🐍 You should use the \`Snake.run()\`!`)
    }
    log(`🐍 Killing...`)
    process.exit(0)
  }
  async catchError(next:any){
    process.on("unhandledRejection",(reason, promise)=>{
      return next(reason,promise)
    })
  }
}