// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published

import * as Interface from './interface';
import { Api } from 'telegram';
export function BuildReplyMarkup(replyMarkup: Interface.TypeReplyMarkup) {
  // inlineKeyboard
  if ('inlineKeyboard' in replyMarkup) {
    return replyMarkupInlineKeyboard(replyMarkup as Interface.inlineKeyboard);
  }
  // keyboard
  if ('keyboard' in replyMarkup) {
    return replyMarkupKeyboard(replyMarkup as Interface.replyKeyboard);
  }
  // removeKeyboard
  if ('removeKeyboard' in replyMarkup) {
    return replyMarkupRemoveKeyboard(replyMarkup as Interface.removeKeyboard);
  }
  // forceReply
  if ('forceReply' in replyMarkup) {
    return replyMarkupForceReply(replyMarkup as Interface.forceReplyMarkup);
  }
}
function replyMarkupInlineKeyboard(replyMarkup: Interface.inlineKeyboard) {
  let rows: Api.KeyboardButtonRow[] = [];
  for (let row = 0; row < replyMarkup.inlineKeyboard.length; row++) {
    let tempCol: Api.TypeKeyboardButton[] = [];
    for (let col = 0; col < replyMarkup.inlineKeyboard[row].length; col++) {
      let btn: Interface.inlineKeyboardButton = replyMarkup.inlineKeyboard[row][
        col
      ] as Interface.inlineKeyboardButton;
      // button url
      if (btn.url) {
        tempCol.push(
          new Api.KeyboardButtonUrl({
            text: String(btn.text),
            url: String(btn.url),
          })
        );
        continue;
      }
      // button login url
      if (btn.loginUrl) {
        tempCol.push(
          new Api.InputKeyboardButtonUrlAuth({
            text: String(btn.text),
            requestWriteAccess: btn.loginUrl?.requestWriteAccess || true,
            fwdText: btn.loginUrl?.forwardText || String(btn.text),
            url: String(btn.loginUrl?.url),
            bot: new Api.InputUser({
              userId: btn.loginUrl?.bot.id!,
              accessHash: btn.loginUrl?.bot.accessHash!,
            }),
          })
        );
        continue;
      }
      // button callbackData
      if (btn.callbackData) {
        tempCol.push(
          new Api.KeyboardButtonCallback({
            text: String(btn.text),
            requiresPassword: false,
            data: Buffer.from(String(btn.callbackData)),
          })
        );
        continue;
      }
      // button switch inline query
      if (btn.switchInlineQuery) {
        tempCol.push(
          new Api.KeyboardButtonSwitchInline({
            text: String(btn.text),
            samePeer: false,
            query: String(btn.switchInlineQuery),
          })
        );
        continue;
      }
      // button switch inline query current peer
      if (btn.switchInlineQueryCurrentChat) {
        tempCol.push(
          new Api.KeyboardButtonSwitchInline({
            text: String(btn.text),
            samePeer: true,
            query: String(btn.switchInlineQueryCurrentChat),
          })
        );
        continue;
      }
      // button game
      if (btn.callbackGame) {
        tempCol.push(
          new Api.KeyboardButtonGame({
            text: String(btn.text),
          })
        );
        continue;
      }
      // button buy
      if (btn.buy) {
        tempCol.push(
          new Api.KeyboardButtonBuy({
            text: String(btn.text),
          })
        );
        continue;
      }
    }
    rows.push(
      new Api.KeyboardButtonRow({
        buttons: tempCol,
      })
    );
  }
  return new Api.ReplyInlineMarkup({
    rows: rows,
  });
}
function replyMarkupKeyboard(replyMarkup: Interface.replyKeyboard) {
  let rows: Api.KeyboardButtonRow[] = [];
  for (let row = 0; row < replyMarkup.keyboard.length; row++) {
    let tempCol: Api.TypeKeyboardButton[] = [];
    for (let col = 0; col < replyMarkup.keyboard[row].length; col++) {
      // if string[][]
      if (typeof replyMarkup.keyboard[row][col] == 'string') {
        tempCol.push(
          new Api.KeyboardButton({
            text: String(replyMarkup.keyboard[row][col]),
          })
        );
        continue;
      }
      if (typeof replyMarkup.keyboard[row][col] !== 'string') {
        let btn: Interface.replyKeyboardButton = replyMarkup.keyboard[row][
          col
        ] as Interface.replyKeyboardButton;
        // keyboard requestContact
        if (btn.requestContact) {
          tempCol.push(
            new Api.KeyboardButtonRequestPhone({
              text: String(btn.text),
            })
          );
          continue;
        }
        //keyboard requestLocation
        if (btn.requestLocation) {
          tempCol.push(
            new Api.KeyboardButtonRequestGeoLocation({
              text: String(btn.text),
            })
          );
          continue;
        }
        //keyboard requestPoll
        if (btn.requestPoll) {
          tempCol.push(
            new Api.KeyboardButtonRequestPoll({
              text: String(btn.text),
              quiz: Boolean(btn.requestPoll.toLowerCase() == 'quiz'),
            })
          );
          continue;
        }
        // keyboard text
        if (btn.text) {
          if (!btn.requestPoll && !btn.requestLocation && !btn.requestContact) {
            tempCol.push(
              new Api.KeyboardButton({
                text: String(btn.text),
              })
            );
            continue;
          }
        }
      }
    }
    rows.push(
      new Api.KeyboardButtonRow({
        buttons: tempCol,
      })
    );
  }
  return new Api.ReplyKeyboardMarkup({
    rows: rows,
    resize: replyMarkup.resizeKeyboard || undefined,
    singleUse: replyMarkup.oneTimeKeyboard || undefined,
    placeholder: replyMarkup.inputFieldPlaceholder || undefined,
    selective: replyMarkup.selective || undefined,
  });
}
function replyMarkupRemoveKeyboard(replyMarkup: Interface.removeKeyboard) {
  return new Api.ReplyKeyboardHide({
    selective: replyMarkup.selective || undefined,
  });
}
function replyMarkupForceReply(replyMarkup: Interface.forceReplyMarkup) {
  return new Api.ReplyKeyboardForceReply({
    singleUse: replyMarkup.singleUse || undefined,
    selective: replyMarkup.selective || undefined,
    placeholder: replyMarkup.inputFieldPlaceholder || undefined,
  });
}
