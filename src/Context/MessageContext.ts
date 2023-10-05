// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Message } from '../Utils/Message';
import { Snake } from '../Client';
import { replyMoreParams } from '../Interface/reply';
import { forwardMessageMoreParams } from '../Telegram/Messages/ForwardMessages';
import { pinMessageMoreParams } from '../Telegram/Messages/PinMessage';
import { betterConsoleLog } from '../Utils/CleanObject';
import { inspect } from 'util';
import { ClickButton } from '../Interface/Click';
import { inlineKeyboardButton, replyKeyboardButton } from '../Utils/ReplyMarkup';
import { Api } from 'telegram';
import { computeCheck } from 'telegram/Password';
import bigInt from 'big-integer';
import * as Medias from '../Utils/Medias';

export class MessageContext extends Message {
  match!: Array<RegExpExecArray>;
  constructor() {
    super();
  }
  /** @hidden */
  [inspect.custom]() {
    return betterConsoleLog(this);
  }
  /** @hidden */
  toJSON() {
    let obj = betterConsoleLog(this);
    for (let [key, value] of Object.entries(obj)) {
      if (typeof value == 'bigint') obj[key] = String(value);
    }
    return obj;
  }
  async reply(text: string, more?: replyMoreParams) {
    if (this.id && this.chat.id) {
      let client: Snake = this.SnakeClient;
      return await client.telegram.sendMessage(this.chat.id, text, {
        replyToMsgId: this.id,
        ...more,
      });
    }
  }
  async replyWithHTML(text: string, more?: replyMoreParams) {
    return await this.reply(text, {
      parseMode: 'html',
      ...more,
    });
  }
  async replyWithMarkdown(text: string, more?: replyMoreParams) {
    return await this.reply(text, {
      parseMode: 'markdown',
      ...more,
    });
  }
  async delete() {
    let client = this.SnakeClient;
    return await client.telegram.deleteMessage(this.chat.id, this.id);
  }
  async forward(chatId: string | number | bigint, more?: forwardMessageMoreParams) {
    let client = this.SnakeClient;
    return await client.telegram.forwardMessage(chatId, this.chat.id, this.id, more);
  }
  async pin(more?: pinMessageMoreParams) {
    let client = this.SnakeClient;
    return await client.telegram.pinMessage(this.chat.id, this.id, more);
  }
  async unpin() {
    let client = this.SnakeClient;
    return await client.telegram.unpinMessage(this.chat.id, this.id);
  }
  async link() {
    let client = this.SnakeClient;
    return await client.telegram.exportMessageLink(this.chat.id, this.id);
  }
  async click({
    row,
    col,
    text,
    filter,
    callbackData,
    sharePhone,
    shareGeo,
    password,
  }: ClickButton) {
    if (!this.replyMarkup) throw new Error("couldn't find any replyMarkup");
    const buildPeer = () => {
      if (this.chat.id === this.SnakeClient.aboutMe.id) {
        return new Api.InputPeerSelf();
      }
      if (this.chat.type === 'chat') {
        return new Api.InputPeerChat({
          chatId: bigInt(String(this.chat.id)),
        });
      }
      if (this.chat.type === 'channel') {
        return new Api.InputPeerChannel({
          channelId: bigInt(String(this.chat.id)),
          accessHash: bigInt(String(this.chat.accessHash)),
        });
      }
      if (this.chat.type === 'supergroup') {
        return new Api.InputPeerChannel({
          channelId: bigInt(String(this.chat.id)),
          accessHash: bigInt(String(this.chat.accessHash)),
        });
      }
      if (this.chat.type === 'user') {
        return new Api.InputPeerUser({
          userId: bigInt(String(this.chat.id)),
          accessHash: bigInt(String(this.chat.accessHash)),
        });
      }
      return new Api.InputPeerEmpty();
    };
    const buildPeerBot = () => {
      if (this.from.bot) {
        if (this.from.id === this.SnakeClient.aboutMe.id) {
          return new Api.InputPeerSelf();
        }
        return new Api.InputPeerUser({
          userId: bigInt(String(this.from.id)),
          accessHash: bigInt(String(this.from.accessHash)),
        });
      }
    };
    const makeFilter = async (callback: {
      (
        btn: inlineKeyboardButton | replyKeyboardButton,
        r: number,
        c: number
      ): Promise<boolean> | boolean;
    }) => {
      //@ts-ignore
      if (this.replyMarkup?.inlineKeyboard) {
        //@ts-ignore
        for (let r in this.replyMarkup?.inlineKeyboard) {
          //@ts-ignore
          let rr = this.replyMarkup?.inlineKeyboard[r];
          for (let c in rr) {
            if (await callback(rr[c], Number(r), Number(c))) {
              row = Number(r);
              col = Number(c);
              return true;
            }
          }
          return false;
        }
      }
      //@ts-ignore
      if (this.replyMarkup?.keyboard) {
        //@ts-ignore
        for (let r in this.replyMarkup?.keyboard) {
          //@ts-ignore
          let rr = this.replyMarkup?.keyboard[r];
          for (let c in rr) {
            if (await callback(rr[c], Number(r), Number(c))) {
              row = Number(r);
              col = Number(c);
              return true;
            }
          }
          return false;
        }
      }
      return false;
    };
    if (text) {
      let isTrue = await makeFilter(async (btn, r, c) => {
        let t = typeof btn === 'string' ? btn : btn.text;
        if (typeof text === 'string') return text === t;
        if (typeof text === 'function') return text(t, Number(r), Number(c));
        return false;
      });
      if (!isTrue) return;
    }
    if (filter) {
      let isTrue = await makeFilter(async (btn, r, c) => {
        if (typeof filter === 'function') return filter(btn, Number(r), Number(c));
        return false;
      });
      if (!isTrue) return;
    }
    if (callbackData) {
      let isTrue = await makeFilter(async (btn, r, c) => {
        //@ts-ignore
        let cb = typeof btn !== 'string' && btn.callbackData ? btn.callbackData : '';
        return cb === callbackData;
      });
      if (!isTrue) return;
    }
    if (row !== undefined || col !== undefined) {
      //@ts-ignore
      if (this.replyMarkup?.inlineKeyboard) {
        //@ts-ignore
        let keyboard: inlineKeyboardButton = this.replyMarkup?.inlineKeyboard[row ?? 0][col ?? 0];
        if (keyboard && keyboard.url) {
          if (String(keyboard.url).startsWith('tg://user?id=')) {
            return await this.telegram.getEntity(
              BigInt(String(keyboard.url).replace('tg://user?id=', ''))
            );
          }
          return keyboard.url;
        }
        if (keyboard && keyboard.callbackData) {
          let encryptedPassword;
          if (password !== undefined) {
            let pwd = await this.SnakeClient.client.invoke(new Api.account.GetPassword());
            encryptedPassword = await computeCheck(pwd, password);
          }
          let request = new Api.messages.GetBotCallbackAnswer({
            peer: buildPeer(),
            msgId: this.id,
            //@ts-ignore
            data: Buffer.from(keyboard.callbackData),
            password: encryptedPassword,
          });
          return await this.SnakeClient.client.invoke(request);
        }
        if (keyboard && keyboard.callbackGame) {
          let request = new Api.messages.GetBotCallbackAnswer({
            peer: buildPeer(),
            msgId: this.id,
            game: true,
          });
          return await this.SnakeClient.client.invoke(request);
        }
        if (keyboard && keyboard.switchInlineQuery) {
          let request = new Api.messages.StartBot({
            bot: buildPeerBot(),
            peer: buildPeer(),
            startParam: keyboard.switchInlineQuery,
          });
          return await this.SnakeClient.client.invoke(request);
        }
        if (keyboard && keyboard.switchInlineQueryCurrentChat) {
          let request = new Api.messages.StartBot({
            bot: buildPeerBot(),
            peer: buildPeer(),
            startParam: keyboard.switchInlineQueryCurrentChat,
          });
          return await this.SnakeClient.client.invoke(request);
        }
      }
      //@ts-ignore
      if (this.replyMarkup?.keyboard) {
        //@ts-ignore
        let keyboard: replyKeyboardButton = this.replyMarkup?.keyboard[row ?? 0][col ?? 0];
        if (keyboard && typeof keyboard !== 'string') {
          if (keyboard.requestContact) {
            if (
              sharePhone === true ||
              typeof sharePhone === 'string' ||
              sharePhone instanceof Medias.MediaContact
            ) {
              if (sharePhone instanceof Medias.MediaContact)
                return this.telegram.sendContact(this.chat.id, sharePhone!, {
                  replyToMsgId: this.id,
                });
              return this.telegram.sendContact(
                this.chat.id,
                {
                  phoneNumber:
                    (sharePhone === true ? this.SnakeClient.aboutMe.phone : sharePhone) ?? '',
                  firstName: this.SnakeClient.aboutMe.firstName ?? 'unknown',
                  lastName: this.SnakeClient.aboutMe.lastName ?? '',
                  vcard: '',
                },
                {
                  replyToMsgId: this.id,
                }
              );
            }
          }
          if (keyboard.requestLocation) {
            if (shareGeo) {
              return this.telegram.sendLocation(this.chat.id, shareGeo!, {
                replyToMsgId: this.id,
              });
            }
          }
        }
      }
    }
    return;
  }
}
