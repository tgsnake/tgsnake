import {Wizard,Snake,Filters} from "tgsnake"

const bot = new Snake() // create mew client 
const filter = new Filters() // create new filter 
bot.onNewMessage((ctx)=>{
  filter.init(ctx) // installing filters
})
interface SessionData {
  userNumber?:number;
  userPass?:string; 
  userId?:number;
}
/**
 * create new session
*/
const session = new Wizard.Session<SessionData>(
    "wizard-session", // session name
    async (ctx) => {
      session.state = {}
      await ctx.reply("Hi, Please input your number.")
      return session.state.userId = ctx.message.chat.id
    },
    async (ctx) => {
      await ctx.reply("Your number : "+ctx.message.text)
      session.state.userNumber = Number(ctx.message.text)
      return ctx.reply("Input your password")
    }
    async (ctx) => {
     await ctx.reply("Your password : "+ctx.message.text)
     session.state.userPass = ctx.message.text
     return ctx.reply("Done.")
    }
  )
/**
 * create new wizard
*/
const state = new Wizard.State([session]) 
filter.use((ctx)=>{
  return state.init(ctx) // installing wizard
})
state.use((ctx)=>{
  let text = String(ctx.message.text).split(" ")
  if(/^[\!\/]leave/i.exec(text[0])){
    return state.quit() // leave current session
  }
})
filter.cmd("login",(ctx)=>{
  return state.login("wizard-session") // login as wizard-session 
})
bot.run()