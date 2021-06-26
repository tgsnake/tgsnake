### Welcome To TgSnake
![tgsnakeicon-flaticon](./tgsnake.jpg)  
Hi, **tgsnake** is a framework developed based on gram.js  
  
[![github-repo](https://img.shields.io/badge/Github-butthx-blue.svg?style=for-the-badge&logo=github)](https://github.com/butthx/tgsnake)
[![telegram-chat](https://img.shields.io/badge/Telegram-Chat-blue.svg?style=for-the-badge&logo=telegram)](https://t.me/tgsnakechat)
[![telegram-channel](https://img.shields.io/badge/Telegram-Channel-blue.svg?style=for-the-badge&logo=telegram)](https://t.me/tgsnake)
### Installation
`yarn add https://github.com/butthx/tgsnake`   
or   
`yarn add tgsnake`  
### Example   
```javascript
const {snake} = require("tgsnake")
// import {snake} from "tgsnake"
const Snake = new snake({
  api_hash : "abcde", //your api hash
  api_id : 123456, // your api id
  bot_token : "123457890:abcd", // bot token. if you login using number delete this.
  logger:"none" // gramjs logger
})

Snake.run() //snake running

Snake.onNewMessage((bot,message)=>{ //handle new message event.
  bot.reply("hai") // reply with "hai"
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
Read [tgsnake docs](/docs)