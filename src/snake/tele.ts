import {Logger} from 'telegram/extensions';
import {TelegramClient} from 'telegram';
import {StringSession} from 'telegram/sessions';
import {NewMessage} from 'telegram/events';
import {NewMessageEvent} from 'telegram/events/NewMessage';
import {Message} from 'telegram/tl/custom/message';
import {Api} from "telegram"
const BigInt = require("big-integer")

class tele {
  client:any
  constructor(client:any){
    this.client = client
  }
  async sendMessage(chat_id:number|string,text:string,more:any|undefined){
      let results:Api.Updates = await this.client.invoke(
          new Api.messages.SendMessage({
              peer : chat_id,
              message : text,
              randomId : BigInt(-Math.floor(Math.random() * 10000000000000)),
              ...more
            })
        )
      return results
    }
  }

export default tele