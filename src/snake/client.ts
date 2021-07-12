import {Logger} from 'telegram/extensions';
import {TelegramClient} from 'telegram';
import {StringSession} from 'telegram/sessions';
import {NewMessage} from 'telegram/events';
import {NewMessageEvent} from 'telegram/events/NewMessage';
import {tele} from "./tele"
import {shortcut} from "./shortcut"
import {Message} from "./rewritejson"
import prompts from "prompts"
import {Api} from "telegram"
import * as Interface from "./interface"

let version = "0.0.5" //change this version according to what is in package.json

let api_hash:string
let api_id:number
let session:string
let bot_token:string
let logger:string
let tgSnakeLog:boolean|undefined = true
let connection_retries:number
let appVersion:string
function log(text:string){
  if(tgSnakeLog){
    console.log(text)
  }
} 

export class snake implements Interface.client {
  /**
   * class Client. 
   * This is a class of gramjs (TelegramClient)
  */
  client?:TelegramClient
  /**
   * class Telegram. 
   * all method in here.
  */
  telegram?:tele 
  /**
   * options parameter : 
   *   logger,api_hash,api_id,session,bot_token,connection_retries,appVersion,tgSnakeLog
  */
  constructor(options?:Interface.options){
    //default options
    session = ""
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
        tgSnakeLog = options.tgSnakeLog!
      }
    }
    Logger.setLevel(logger)
  }
  /** 
   * class Run. 
   * running snake...
  */
  async run():Promise<void>{
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
          session = String(await this.client.session.save())
          console.log(`🐍 Your string session : ${session}`)
        }else{
          let value = await prompts({
            type : "text",
            name : "value",
            message : "🐍 Input your bot_token"
          })
          await this.client.start({
            botAuthToken : value.value
          })
          session = String(await this.client.session.save())
          console.log(`🐍 Your string session : ${session}`)
        }
      }else{
        await this.client.start({
          botAuthToken : bot_token
        })
        session = String(await this.client.session.save())
        console.log(`🐍 Your string session : ${session}`)
      }
    }
      await this.client.connect()
      await this.client.getMe().catch((e:any)=>{})
      return log("🐍 Running..")
  }
  /**
   * class OnNewMessage. 
   * next : function. 
   * this is a function to use handle new message.
  */
  async onNewMessage(next:any):Promise<void>{
    if(this.client){
      this.client.addEventHandler((event:NewMessageEvent)=>{
        return next(new shortcut(this.client!,event!),new Message(event!))
      },new NewMessage({}))
    }
  }
  /**
   * class OnNewEvent. 
   * next : function. 
   * This is a function to use handle new event.
  */
  async onNewEvent(next:any):Promise<void>{
    if(this.client){
      this.client.addEventHandler((update:Api.TypeUpdate)=>{
        return next(update)
      })
    }
  }
  /**
   * class GenerateSession. 
   * only generate the string sesion.
  */
  async generateSession():Promise<void>{
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
          session = String(await this.client.session.save())
          console.log(`🐍 Your string session : ${session}`)
          this.telegram.sendMessage("me",`🐍 Your string session : <code>${session}</code>`,{parseMode:"HTML"})
        }else{
          let value = await prompts({
            type : "text",
            name : "value",
            message : "🐍 Input your bot_token"
          })
          await this.client.start({
            botAuthToken : value.value
          })
          session = String(await this.client.session.save())
          console.log(`🐍 Your string session : ${session}`)
        }
      }else{
        await this.client.start({
          botAuthToken : bot_token
        })
        session = String(await this.client.session.save())
        console.log(`🐍 Your string session : ${session}`)
      }
    }else{
      log(`🐍 You should use the \`Snake.run()\`!`)
    }
    log(`🐍 Killing...`)
    process.exit(0)
  }
  /**
   * class CatchError. 
   * handle promise unhandledRejection.
  */
  async catchError(next:any):Promise<void>{
    process.on("unhandledRejection",(reason:any, promise:Promise<any>)=>{
      return next(reason,promise)
    })
  }
}