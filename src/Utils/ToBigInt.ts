// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import BigInt, {BigInteger,isInstance} from "big-integer"
import {Api} from "telegram"
import {Snake} from "../client"
export async function toBigInt(Ids:number|string,SnakeClient:Snake){
  let e = await SnakeClient.telegram.getEntity(Ids,true)
  let id = e.id // change with BigInt if gramjs support layer 133
  let d = (
      e.type == "channel" 
        ? new Api.PeerChannel({
            channelId : id
          })
        : e.type == "chat"
          ? new Api.PeerChat({
            chatId : id 
          })
          : new Api.PeerUser({
            userId : id
          })
    )
  return [id,e.type,d] 
}
export function toNumber(Ids:BigInteger|number){
  if(isInstance(Ids)){
    //@ts-ignore
    return Number(String(Ids))
  }
  //@ts-ignore
  return Ids as Number
}