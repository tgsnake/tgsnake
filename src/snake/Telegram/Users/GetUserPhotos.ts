// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import {BigInteger} from "big-integer"
export interface getUserPhotosMoreParams {
  offset?: number;
  maxId?: BigInteger;
  limit?: number;
}
export async function GetUserPhotos(
  snakeClient: Snake,
  chatId: number | string,
  more?: getUserPhotosMoreParams
) {
  try {
    let results: Api.photos.TypePhotos = await snakeClient.client.invoke(
      new Api.photos.GetUserPhotos({
        userId: chatId,
        ...more,
      })
    );
    return results;
  } catch (error) {
    return snakeClient._handleError(
      error,
      `telegram.getUserPhotos(${chatId}${more ? ',' + JSON.stringify(more) : ''})`
    );
  }
}
