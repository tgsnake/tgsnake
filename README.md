### Welcome
![tgsnake icon](./tgsnake.jpg)  
Hi, **tgsnake** is a framework developed based on gram.js
### Example 

`yarn add https://github.com/butthx/tgsnake`   
or 
`yarn add tgsnake`  

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
MIT LICENSE

### Docs
Read [tgsnake wiki](https://github.com/butthx/tgsnake/wiki/)