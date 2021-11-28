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
export class MessageAction {
  '_'!: string;
  title!: string;
  users!: number[];
  photo!: Media;
  userId!: number;
  inviterId!: number;
  channelId!: number;
  chatId!: number;
  gameId!: BigInteger;
  score!: number;
  currency!: string;
  totalAmount!: BigInteger;
  payload!: string;
  info?: PaymentRequestedInfo;
  shippingOptionId?: string;
  charge!: PaymentCharge;
  video?: boolean;
  callId!: BigInteger;
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
      this.users = messageAction.users;
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
      this.users = messageAction.users;
      return this;
    }
    if (messageAction instanceof Api.MessageActionChatDeleteUser) {
      messageAction as Api.MessageActionChatDeleteUser;
      this['_'] = 'leftChatMember';
      this.userId = messageAction.userId;
      return this;
    }
    if (messageAction instanceof Api.MessageActionChatJoinedByLink) {
      messageAction as Api.MessageActionChatJoinedByLink;
      this['_'] = 'newChatMember';
      this.inviterId = messageAction.inviterId;
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
      this.channelId = Number(`-100${messageAction.channelId}`);
      return this;
    }
    if (messageAction instanceof Api.MessageActionChannelMigrateFrom) {
      messageAction as Api.MessageActionChannelMigrateFrom;
      this['_'] = 'migrateFrom';
      this.title = messageAction.title;
      this.chatId = Number(`-${messageAction.chatId}`);
      return this;
    }
    if (messageAction instanceof Api.MessageActionGameScore) {
      messageAction as Api.MessageActionGameScore;
      this['_'] = 'gameScore';
      this.gameId = messageAction.gameId;
      this.score = messageAction.score;
      return this;
    }
    if (messageAction instanceof Api.MessageActionPaymentSentMe) {
      messageAction as Api.MessageActionPaymentSentMe;
      this['_'] = 'paymentSentMe';
      this.currency = messageAction.currency;
      this.totalAmount = messageAction.totalAmount;
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
      this.totalAmount = messageAction.totalAmount;
      return this;
    }
    if (messageAction instanceof Api.MessageActionPhoneCall) {
      messageAction as Api.MessageActionPhoneCall;
      this['_'] = 'phoneCall';
      this.video = messageAction.video;
      this.callId = messageAction.callId;
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
