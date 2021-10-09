// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import {Snake} from "../../client" 
import {ResultGetEntity} from "../Users/GetEntity" 
import {Api} from "telegram" 
import {AdminRights} from "../../Utils/AdminRights"

type UserStatus = "self" | "creator" | "admin" | "banned" | "left"
export class ChannelParticipant {
  user!:ResultGetEntity; 
  status:UserStatus = "left"
  adminRights?:AdminRights; 
  date:number = Math.floor(Date.now() / 1000);
  constructor(){} 
  async init(results:Api.channels.ChannelParticipant,snakeClient:Snake){
    if(results.participant instanceof Api.ChannelParticipantCreator){ 
      results.participant as Api.ChannelParticipantCreator 
      this.status = "creator"
      this.adminRights = new AdminRights(results.participant.adminRights) 
      if(results.users.length > 0){
        for(let i=0; i<results.users.length; i++){ 
          if(results.users[i].id == results.participant.userId){
            this.user = new ResultGetEntity(results.users[i]); 
            break;
          }
        }
      }else{
        if(results.chats.length > 0){
          for(let i=0; i<results.chats.length; i++){ 
            if(results.chats[i].id == results.participant.userId){
              this.user = new ResultGetEntity(results.chats[i]); 
              break;
            }
          }
        }
      }
      snakeClient.entityCache.set(this.user.id,this.user) 
      return this 
    }
  }
}
export async function GetParticipant(snakeClient:Snake,chatId:number|string,userId:number|string){
  try{
    let {client} = snakeClient 
    let result = await client.invoke(
        new Api.channels.GetParticipant({
          channel : chatId,
          participant : userId
        })
      )
    let _results = new ChannelParticipant() 
    await _results.init(result,snakeClient) 
    return _results
  }catch(error){
    return snakeClient._handleError(
      error,
      `telegram.getParticipant(${chatId},${userId}})`
    );
  }
}