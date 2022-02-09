// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import bigInt, { BigInteger, isInstance } from 'big-integer';
import { Api } from 'telegram';
import { Snake } from '../Client';
export async function toBigInt(Ids: bigint | number | string, SnakeClient: Snake) {
  let e = await SnakeClient.telegram.getEntity(Ids, true);
  let id = bigInt(String(e.id).replace('-100', '').replace('-', ''));
  let d =
    e.type == 'channel' || e.type == 'supergroup'
      ? new Api.PeerChannel({
          channelId: id,
        })
      : e.type == 'chat'
      ? new Api.PeerChat({
          chatId: id,
        })
      : new Api.PeerUser({
          userId: id,
        });
  return [id as BigInteger, e.type, d];
}
export function toString(Ids: BigInteger | number | null | string) {
  if (Ids == null) {
    return 0;
  }
  if (isInstance(Ids)) {
    //@ts-ignore
    return String(Ids);
  }
  //@ts-ignore
  return String(Ids);
}
export function convertId(ids: bigint | number | string) {
  if (typeof ids == 'bigint') {
    return bigInt(ids as bigint) as BigInteger;
  }
  if (typeof ids == 'number') {
    return bigInt(String(ids)) as BigInteger;
  }
  return String(ids) as string;
}
