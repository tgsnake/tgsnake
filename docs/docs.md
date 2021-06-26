### Overview
install **tgsnake**   
using npm : 
```bash
npm i tgsnake
```  
using yarn : 
```bash
yarn add tgsnake
```

```javascript
/*index.js*/
const {snake} = require("tgsnake")
// import {snake} from "tgsnake"
const Snake = new snake(options)

Snake.run() //snake running

Snake.onNewMessage((bot,message)=>{ //handle new message event.
  bot.reply("hai") // reply with "hai"
  //console.log(message) // see json of message.
})
```
**Options**  

| option name | required | type | description |  
| :------:    | :------: | :---:| :---: |
| `api_hash`    |  true    | string | An api_hash got from [my.telegram.org](https://my.telegram.org) |
| `api_id` | true | number | An api_id got from [my.telegram.org](https://my.telegram.org) |
| `session` | optional | string | String sessions. |
| `bot_token` | optional | string | Bot Token from botFather. If you need to login as bot this required. |
| `logger` | optional | string | Set Logger level for gramjs. Default is "none". |
| `connection_retries` | optional | number | Connection Retries for gramjs. Default is 5. |   
  
### Generate Sessions 
```javascript
/*index.js*/
const {snake} = require("tgsnake")
const Snake = new snake()
Snake.generateSession()
```

### Methods
Available tgsnake methods :   
```text
Snake.telegram.{{methods.name}}
```
#### deleteMessages
Delete messages in a chat/channel/supergroup   

| params | description | type |  
| :---:  | :----: | :---: | 
| `chat_id` | chat or Channel or groups id | `number\|string` |
| `message_id` | array of number message id to be deleted. | `number[]` | 

#### editMessage   
Edit message   

| params | description | type |  
| :---:  | :----: | :---: | 
| `chat_id` | chat or channel or groups id. | `number\|string` | 
| `message_id` | id from message to be edited | `number\|string` | 
| `text` | new message if you need to edit media you can replace this with blank string ("") | `string` | 
| `more` | gramjs EditMessage params. | `object\|undefined` | 