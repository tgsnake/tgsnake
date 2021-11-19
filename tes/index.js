const {Snake} = require("../lib");
const bot = new Snake();
bot.on("UpdateEditChannelMessage",(update)=>{
  console.log("UpdateEditChannelMessage",update);
});
bot.on("message",(update)=>{
  console.log("message",update);
});
bot.command("editPhoto", async (ctx)=>{
    if(!ctx.chat.private){
        let results = await ctx.telegram.editPhoto(ctx.chat.id,"https://tgsnake.js.org/images/tgsnake.jpg") 
        console.log(results)
    }
})
bot.run();