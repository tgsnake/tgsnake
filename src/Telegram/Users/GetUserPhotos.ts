// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import { BigInteger } from 'big-integer';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
export interface getUserPhotosMoreParams {
  offset?: number;
  maxId?: BigInteger;
  limit?: number;
}
export async function GetUserPhotos(
  snakeClient: Snake,
  userId: number | string | bigint,
  more?: getUserPhotosMoreParams
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.getUserPhotos`
      );
    }
    let [id, type, peer] = await toBigInt(userId, snakeClient);
    let results: Api.photos.TypePhotos = await snakeClient.client.invoke(
      new Api.photos.GetUserPhotos({
        userId: peer,
        ...more,
      })
    );
    return results;
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.getUserPhotos';
    botError.functionArgs = `${userId}${more ? ',' + JSON.stringify(more) : ''}`;
    throw botError;
  }
}
