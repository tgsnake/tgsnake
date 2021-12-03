// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import bigInt from 'big-integer';
import BotError from '../../Context/Error';

export interface AnswerInlineQueryMoreParams {
  gallery?: boolean;
  cacheTime?: number;
  isPersonal?: boolean;
  nextOffset?: string;
  switchPmText?: string;
  switchPmParameter?: string;
}
let defaultParam: AnswerInlineQueryMoreParams = {
  cacheTime: 300,
};
export async function AnswerInlineQuery(
  snakeClient: Snake,
  id: bigint,
  results: Array<Api.TypeInputBotInlineResult>,
  more: AnswerInlineQueryMoreParams = defaultParam
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.answerInlineQuery`
      );
    }
    let final = await snakeClient.client.invoke(
      new Api.messages.SetInlineBotResults({
        queryId: bigInt(String(id)),
        results: results,
        gallery: more.gallery,
        nextOffset: more.nextOffset,
        ...(more.switchPmText || more.switchPmParameter
          ? {
              switchPm: new Api.InlineBotSwitchPM({
                text: String(more.switchPmText),
                startParam: String(more.switchPmParameter),
              }),
            }
          : {}),
        cacheTime: more.cacheTime,
        private: more.isPersonal,
      })
    );
    return final;
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.answerInlineQuery';
    botError.functionArgs = `${id},${JSON.stringify(results, null, 2)}${
      more ? ',' + JSON.stringify(more) : ''
    }`;
    throw botError;
  }
}
