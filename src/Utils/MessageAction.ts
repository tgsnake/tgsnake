// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Snake } from '../client';
import { BigInteger } from 'big-integer';
import { PaymentRequestedInfo, PaymentCharge } from './Payment';
import { Media } from './Media';
import { toNumber } from './ToBigInt';
export class MessageAction {
  '_'!: string;
  title!: string;
  users!: bigint[];
  photo!: Media;
  userId!: bigint;
  inviterId!: bigint;
  channelId!: bigint;
  chatId!: bigint;
  gameId!: bigint;
  score!: number;
  currency!: string;
  totalAmount!: bigint;
  payload!: string;
  info?: PaymentRequestedInfo;
  shippingOptionId?: string;
  charge!: PaymentCharge;
  video?: boolean;
  callId!: bigint;
  reason?: string;
  duration?: number;
  message!: string;
  domain!: string;
  values!: Api.TypeSecureValue[];
  credentials!: Api.TypeSecureCredentialsEncrypted;
  types!: Api.TypeSecureValueType[];
  call!: Api.InputGroupCall;
  scheduleDate!: number;
  constructor() {}
  async init(messageAction: Api.TypeMessageAction) {
    if (messageAction instanceof Api.MessageActionChatCreate) {
      messageAction as Api.MessageActionChatCreate;
      this['_'] = 'chatCreate';
      this.title = messageAction.title;
      let c: bigint[] = [];
      for (let users of messageAction.users) {
        c.push(BigInt(toNumber(users) as number));
      }
      this.users = c;
      return this;
    }
    if (messageAction instanceof Api.MessageActionChatEditTitle) {
      messageAction as Api.MessageActionChatEditTitle;
      this.title = messageAction.title;
      this['_'] = 'editChatTitle';
      return this;
    }
    if (messageAction instanceof Api.MessageActionChatEditPhoto) {
      messageAction as Api.MessageActionChatEditPhoto;
      this['_'] = 'editChatPhoto';
      let media = new Media();
      media.encode(messageAction.photo as Api.Photo);
      this.photo = media;
      return this;
    }
    if (messageAction instanceof Api.MessageActionChatAddUser) {
      this['_'] = 'newChatMember';
      messageAction as Api.MessageActionChatAddUser;
      let c: bigint[] = [];
      for (let users of messageAction.users) {
        c.push(BigInt(toNumber(users) as number));
      }
      this.users = c;
      return this;
    }
    if (messageAction instanceof Api.MessageActionChatDeleteUser) {
      messageAction as Api.MessageActionChatDeleteUser;
      this['_'] = 'leftChatMember';
      this.userId = BigInt(toNumber(messageAction.userId) as number);
      return this;
    }
    if (messageAction instanceof Api.MessageActionChatJoinedByLink) {
      messageAction as Api.MessageActionChatJoinedByLink;
      this['_'] = 'newChatMember';
      this.inviterId = BigInt(toNumber(messageAction.inviterId) as number);
      return this;
    }
    if (messageAction instanceof Api.MessageActionChannelCreate) {
      messageAction as Api.MessageActionChannelCreate;
      this['_'] = 'channelCreate';
      this.title = messageAction.title;
      return this;
    }
    if (messageAction instanceof Api.MessageActionChatMigrateTo) {
      messageAction as Api.MessageActionChatMigrateTo;
      this['_'] = 'migrateTo';
      this.channelId = BigInt(Number(`-100${toNumber(messageAction.channelId)}`) as number);
      return this;
    }
    if (messageAction instanceof Api.MessageActionChannelMigrateFrom) {
      messageAction as Api.MessageActionChannelMigrateFrom;
      this['_'] = 'migrateFrom';
      this.title = messageAction.title;
      this.chatId = BigInt(Number(`-${toNumber(messageAction.chatId)}`) as number);
      return this;
    }
    if (messageAction instanceof Api.MessageActionGameScore) {
      messageAction as Api.MessageActionGameScore;
      this['_'] = 'gameScore';
      this.gameId = BigInt(toNumber(messageAction.gameId) as number);
      this.score = messageAction.score;
      return this;
    }
    if (messageAction instanceof Api.MessageActionPaymentSentMe) {
      messageAction as Api.MessageActionPaymentSentMe;
      this['_'] = 'paymentSentMe';
      this.currency = messageAction.currency;
      this.totalAmount = BigInt(toNumber(messageAction.totalAmount) as number);
      this.payload = messageAction.payload.toString('utf8');
      if (messageAction.info) this.info = new PaymentRequestedInfo(messageAction.info);
      if (messageAction.shippingOptionId) this.shippingOptionId = messageAction.shippingOptionId;
      if (messageAction.charge) this.charge = new PaymentCharge(messageAction.charge);
      return this;
    }
    if (messageAction instanceof Api.MessageActionPaymentSent) {
      messageAction as Api.MessageActionPaymentSent;
      this['_'] = 'paymentSent';
      this.currency = messageAction.currency;
      this.totalAmount = BigInt(toNumber(messageAction.totalAmount) as number);
      return this;
    }
    if (messageAction instanceof Api.MessageActionPhoneCall) {
      messageAction as Api.MessageActionPhoneCall;
      this['_'] = 'phoneCall';
      this.video = messageAction.video;
      this.callId = BigInt(toNumber(messageAction.callId) as number);
      if (messageAction.reason) {
        this.reason = messageAction.reason.className
          .replace('PhoneCallDiscardReason', '')
          .trim()
          .toLowerCase();
      }
      this.duration = messageAction.duration;
      return this;
    }
    if (messageAction instanceof Api.MessageActionCustomAction) {
      messageAction as Api.MessageActionCustomAction;
      this['_'] = 'customAction';
      this.message = messageAction.message;
      return this;
    }
    if (messageAction instanceof Api.MessageActionBotAllowed) {
      messageAction as Api.MessageActionBotAllowed;
      this['_'] = 'botAllowed';
      this.domain = messageAction.domain;
      return this;
    }
    if (messageAction instanceof Api.MessageActionSecureValuesSentMe) {
      messageAction as Api.MessageActionSecureValuesSentMe;
      this['_'] = 'secureValuesSentMe';
      this.values = messageAction.values;
      this.credentials = messageAction.credentials;
      return this;
    }
    if (messageAction instanceof Api.MessageActionSecureValuesSent) {
      messageAction as Api.MessageActionSecureValuesSent;
      this['_'] = 'secureValuesSent';
      this.types = messageAction.types;
      return this;
    }
    if (messageAction instanceof Api.MessageActionChatDeletePhoto) {
      this['_'] = 'deleteChatPhoto';
      return this;
    }
    if (messageAction instanceof Api.MessageActionPinMessage) {
      this['_'] = 'pinMessage';
      return this;
    }
    if (messageAction instanceof Api.MessageActionHistoryClear) {
      this['_'] = 'historyClear';
      return this;
    }
    if (messageAction instanceof Api.MessageActionScreenshotTaken) {
      this['_'] = 'screenshotTaken';
      return this;
    }
    if (messageAction instanceof Api.MessageActionContactSignUp) {
      this['_'] = 'contactSingUp';
      return this;
    }
    if (messageAction instanceof Api.MessageActionGroupCall) {
      messageAction as Api.MessageActionGroupCall;
      this['_'] = 'groupCall';
      this.call = messageAction.call;
      this.duration = messageAction.duration;
      return this;
    }
    if (messageAction instanceof Api.MessageActionGroupCallScheduled) {
      messageAction as Api.MessageActionGroupCallScheduled;
      this['_'] = 'groupCallScheduled';
      this.call = messageAction.call;
      this.scheduleDate = messageAction.scheduleDate;
      return this;
    }
  }
}
