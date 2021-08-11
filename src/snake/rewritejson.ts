// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import * as Interface from './interface';
import { Api } from 'telegram';
import { BigInteger } from 'big-integer';
import { FileId } from 'tg-file-id';
import { NewMessageEvent } from 'telegram/events/NewMessage';
import {Telegram} from "./tele"
import * as GenerateResult from "./rewriteresults"
import * as media from "./media"
export class Message {
  id!: number;
  chat!: Chat;
  from!: From;
  text?: string; 
  entities?: Api.TypeMessageEntity[]; 
  replyToMessageId?: number;
  date!: Date | number; 
  media?: Api.TypeMessageMedia | media.Media;
  constructor(){} 
  /** @hidden */ 
  async _fill(event:NewMessageEvent){
    let message = event.message;
    let cht = new Chat(); 
    let frm = new From(); 
    await cht._fill(event)
    await frm._fill(event)
    this.id = message.id;
    this.chat = cht
    this.from = frm;
    this.date = message.date || Date.now() / 1000;
    if (message.entities) {
      this.entities = message.entities;
    }
    if (message.replyTo) {
      if (message.replyTo.replyToMsgId) {
        this.replyToMessageId = message.replyTo.replyToMsgId;
      }
    }
    if (message.message) {
      this.text = message.message;
    }
    if (message.media) {
      let convert = new media.Media(message.media);
      if (convert.type) {
        this.media = convert;
      } else {
        this.media = message.media;
      }
    }
    return this
  }
}
class Chat {
  id!: number;
  title?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  private?: boolean;
  photo?:GenerateResult.ChatPhoto
  defaultBannedRights?:GenerateResult.BannedRights
  participantsCount?:number 
  dcId?:number 
  fake:boolean = false 
  scam:boolean = false
  constructor() {} 
  /**
   * @hidden
  */
  async _fill(event:NewMessageEvent){
    if(event.message){
      if((event.message.peerId) instanceof Api.PeerUser){
        (event.message.peerId) as Api.PeerUser 
        this.id = event.message.peerId.userId
      }
    }
    if(event.message){
      if((event.message.peerId) instanceof Api.PeerChat){
        (event.message.peerId) as Api.PeerChat 
        this.id = event.message.peerId.chatId * -1
      }
    }
    if(event.message){
      if((event.message.peerId) instanceof Api.PeerChannel){
        (event.message.peerId) as Api.PeerChannel 
        this.id = event.message.peerId.channelId
      }
    }
    let tg = new Telegram(event.client!)
    let entity = await tg.getEntity(this.id) 
    if(entity.username){
      this.username = entity.username!
    }
    if(entity.firstName){
      this.firstName = entity.firstName!
    }
    if(entity.lastName){
      this.lastName = entity.lastName!
    }
    if(entity.title){
      this.title = entity.title!
    }
    if(entity.photo){
      this.photo = entity.photo!
    }
    if(entity.defaultBannedRights){
      this.defaultBannedRights = entity.defaultBannedRights
    }
    if(entity.participantsCount){
      this.participantsCount = entity.participantsCount
    }
    if(entity.dcId){
      this.dcId = entity.dcId
    }
    if(entity.fake){
      this.fake = entity.fake
    }
    if(entity.scam){
      this.scam = entity.scam
    }
    this.private = Boolean(entity.type == "user")
    return 
  }
}
class From {
  id!: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  status?: string;
  self?:boolean
  deleted?:boolean
  fake?:boolean
  scam?:boolean
  bot?:boolean
  verified?:boolean
  restricted?:boolean 
  dcId?:number 
  photo?:GenerateResult.ChatPhoto
  restrictionReason?:GenerateResult.RestrictionReason[]
  constructor() {}
  async _fill(event:NewMessageEvent){
    if(event.message){
      if((event.message.fromId) instanceof Api.PeerUser){
        (event.message.fromId) as Api.PeerUser 
        this.id = event.message.fromId.userId
      }
    }
    let tg = new Telegram(event.client!) 
    let entity = await tg.getEntity(this.id)
    this.username = entity.username 
    this.firstName = entity.firstName 
    this.lastName = entity.lastName
    this.status = entity.status
    this.self = entity.self 
    this.deleted = entity.deleted 
    this.fake = entity.fake 
    this.scam = entity.scam 
    this.bot = entity.bot 
    this.verified = entity.verified 
    this.restricted = entity.restricted 
    if(entity.dcId){
      this.dcId = entity.dcId
    }
    if(entity.photo){
      this.photo = entity.photo
    }
    if(entity.restrictionReason){
      this.restrictionReason = entity.restrictionReason
    }
    return 
  }
}

