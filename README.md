![tgsnakeicon](https://tgsnake.js.org/images/tgsnake.jpg)  
tgsnake is a modern MTProto framework for javascript or typescript.  
[![github-repo](https://img.shields.io/badge/Github-tgsnake-blue.svg?style=for-the-badge&logo=github)](https://github.com/tgsnake/tgsnake) [![telegram-chat](https://img.shields.io/badge/Telegram-Chat-blue.svg?style=for-the-badge&logo=telegram)](https://t.me/tgsnakechat)  
[![telegram-channel](https://img.shields.io/badge/Telegram-Channel-blue.svg?style=for-the-badge&logo=telegram)](https://t.me/tgsnake)

Don't forget to read our FAQ in our site!!

### Example :

- Installation :

```bash
npx create-tgsnake-app myapp
```

- Simple Hello World :

```javascript
const { Snake, shutdown } = require('tgsnake');
// import {Snake} from "tgsnake"
const bot = new Snake({
  apiHash: 'abcde', //your api hash
  apiId: 123456, // your api id
  logLevel: 'none', // logger level
});
bot.run(); //snake running
bot.on('msg.text', (ctx) => {
  //handle new message event.
  ctx.msg.reply('Hello World'); // reply with "Hello World"
  //console.log(ctx) // see json of message.
});
// Mandatory
// Before the program stops, the client will be turned off first. This is to ensure that the entire process has stopped completely.
shutdown(bot);
```

More example you can found in our website.

### Contribution

Welcome, You can contribute to this project.

#### Guide

- Fork this repo to your account.
- Clone your fork repo using git.

```bash
git clone <your github repo url>
```

Cloning branch dev in your repo.

- Edit and make something.
- Pull new update from branch `master` original repo (this repo).
- Push update to your branch `master` in fork repo.
- Create pull request to branch `master` original repo from branch `master` frok repo.

### Reference

- [Pyrogram](https://github.com/pyrogram/pyrogram)
- [Telethon](https://github.com/LonamiWebs/Telethon)
- [GramJs](https://github.com/gram-js/gramjs)
- [Telegram Api](https://core.telegram.org/schema)
- [Grammy](https://github.com/grammyjs/grammyjs)
- [Telegraf](https://github.com/telegraf/telegraf)

Thanks to all the frameworks and references that I use, several people who helped in developing this framework that I cannot mention one by one.

Build with ♥️ by [tgsnake dev](https://t.me/tgsnakechat).
