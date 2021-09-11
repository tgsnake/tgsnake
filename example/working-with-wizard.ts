import {Wizard,Snake} from "tgsnake"

const bot = new Snake() // create new client 
interface SessionData {
  userNumber?:number;
  userPass?:string; 
  userId?:number;
}
const session = new Wizard.Session<SessionData>(
    "wizard-session", // session name
    async (ctx) => {
      session.state = {}
      await ctx.reply("Hi, Please input your number.")
      return session.state.userId = ctx.chat.id
    },
    async (ctx) => {
      await ctx.reply("Your number : "+ctx.text)
      session.state.userNumber = Number(ctx.text)
      return ctx.reply("Input your password")
    }
    async (ctx) => {
     await ctx.reply("Your password : "+ctx.text)
     session.state.userPass = ctx.text
     return ctx.reply("Done.")
    }
  )
const state = new Wizard.State([session]) 
bot.use((ctx,next)=>{
  return state.init(ctx,next) // installing wizard
})
state.use((ctx,next)=>{
  let text = String(ctx.text).split(" ")
  if(/^[\!\/]leave/i.exec(text[0])){
    return state.quit() // leave current session
  }
  return next()
})
bot.command("login",(ctx)=>{
  return state.launch("wizard-session") // login as wizard-session 
})
bot.run()