### Welcome
Hi ini adalah package untuk telegram MTProto.
Package ini terbuat berdasarkan gram.js.

### Example 

`yarn add https://github.com/butthx/tgsnake`

```javascript
const {snake} = require("tgsnake")
const Snake = new snake({
  api_hash : "abcde",
  api_id : 123456,
  bot_token : "123457890:abcd",
  logger:"none"
})

Snake.run()

Snake.onNewMessage((bot,message)=>{
  bot.reply("hai")
})
```