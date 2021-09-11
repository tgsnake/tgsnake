![tgsnakeicon-flaticon](./media/tgsnake.jpg)  
Hi, **tgsnake** is a framework developed based on gram.js  
[![github-repo](https://img.shields.io/badge/Github-butthx-blue.svg?style=for-the-badge&logo=github)](https://github.com/butthx/tgsnake)
[![telegram-chat](https://img.shields.io/badge/Telegram-Chat-blue.svg?style=for-the-badge&logo=telegram)](https://t.me/tgsnakechat)  
[![telegram-channel](https://img.shields.io/badge/Telegram-Channel-blue.svg?style=for-the-badge&logo=telegram)](https://t.me/tgsnake)
[![generate-session](https://img.shields.io/badge/Generate-Session-blue.svg?style=for-the-badge&logo=replit)](https://replit.com/@butthx/TgSnakeGenerateSessions)  


> ### WARNING! <br/>
> #### Maybe your account will be banned if you login using this framework. I don't know what caused it to happen. I am not responsible if your account is banned!

### Example : 

- Installation :  

```bash 
yarn add tgsnake@latest
```
- Simple Hello World :   

```javascript
const {Snake} = require("tgsnake")
// import {Snake} from "tgsnake"
const bot = new Snake({
  api_hash : "abcde", //your api hash
  api_id : 123456, // your api id
  bot_token : "123457890:abcd", // bot token. if you login using number delete this.
  logger:"none" // gramjs logger
})
/**
 * if you login as user, you must generateSession first! 
 * bot.generateSession()
 * disable bot.run() to generate session!
*/
bot.run() //snake running

bot.on("message",(ctx)=>{ //handle new message event.
  ctx.reply("Hello World") // reply with "Hello World"
  //console.log(ctx) // see json of message.
})
```
More example you can found in example folder or in website.
  
### MIT LICENSE 