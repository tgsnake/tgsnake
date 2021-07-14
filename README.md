### Welcome
![tgsnakeicon-flaticon](./media/tgsnake.jpg)  
Hi, **tgsnake** is a framework developed based on gram.js  
[![github-repo](https://img.shields.io/badge/Github-butthx-blue.svg?style=for-the-badge&logo=github)](https://github.com/butthx/tgsnake)
[![telegram-chat](https://img.shields.io/badge/Telegram-Chat-blue.svg?style=for-the-badge&logo=telegram)](https://t.me/tgsnakechat)  
[![telegram-channel](https://img.shields.io/badge/Telegram-Channel-blue.svg?style=for-the-badge&logo=telegram)](https://t.me/tgsnake)
[![generate-session](https://img.shields.io/badge/Generate-Session-blue.svg?style=for-the-badge&logo=replit)](https://replit.com/@butthx/TgSnakeGenerateSessions)  

```text
WARNING!
Maybe your account will be banned if you login using this framework. I don't know what caused it to happen.
I am not responsible if your account is banned!
```

### Example   
`yarn add https://github.com/butthx/tgsnake`   
or   
`yarn add tgsnake`  

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

bot.onNewMessage((ctx,message)=>{ //handle new message event.
  ctx.reply("hai") // reply with "hai"
  //console.log(message) // see json of message.
})
```
### LICENSE 
```
MIT License

Copyright (c) 2021 butthx

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
### Docs
Read [tgsnake docs](https://tgsnake.js.org)