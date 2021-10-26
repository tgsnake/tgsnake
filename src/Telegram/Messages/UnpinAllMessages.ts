// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import { ResultAffectedMessages } from './DeleteMessages';
import {toBigInt,toNumber} from "../../Utils/ToBigInt"
export async function UnpinAllMessages(snakeClient: Snake, chatId: number | string) {
  try {
    let [id,type,peer] = await toBigInt(chatId,snakeClient)
    return new ResultAffectedMessages(
      await snakeClient.client.invoke(
        new Api.messages.UnpinAllMessages({
          peer: peer,
        })
      )
    );
  } catch (error) {
    return snakeClient._handleError(error, `telegram.unpinAllMessages(${chatId})`);
  }
}
