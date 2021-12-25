// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { MigrateTo } from '../../Utils/MigrateTo';
import { BannedRights } from '../../Utils/BannedRight';
import { ChatPhoto } from '../../Utils/ChatPhoto';
import { RestrictionReason } from '../../Utils/RestrictionReason';
import { AdminRights } from '../../Utils/AdminRights';
import { Api } from 'telegram';
import bigInt, { BigInteger, isInstance } from 'big-integer';
import { toBigInt, toString, convertId } from '../../Utils/ToBigInt';
import { Snake } from '../../client';
import * as fs from 'fs';
import BotError from '../../Context/Error';
export class ResultGetEntity {
  type?: string;
  self?: boolean;
  contact?: boolean;
  mutualContact?: boolean;
  deleted?: boolean;
  bot?: boolean;
  botChatHistory?: boolean;
  botNochats?: boolean;
  verified?: boolean;
  restricted?: boolean;
  min?: boolean;
  botInlineGeo?: boolean;
  support?: boolean;
  scam?: boolean;
  applyMinPhoto?: boolean;
  fake?: boolean;
  id!: bigint;
  accessHash?: bigint;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  status?: string;
  botInfoVersion?: number;
  botInlinePlaceholder?: string;
  langCode?: string;
  creator?: boolean;
  kicked?: boolean;
  left?: boolean;
  deactivated?: boolean;
  callActive?: boolean;
  callNotEmpty?: boolean;
  title!: string;
  participantsCount!: number;
  version!: number;
  migratedTo?: MigrateTo;
  adminRights?: AdminRights;
  defaultBannedRights?: BannedRights;
  bannedRights?: BannedRights;
  broadcast?: boolean;
  megagroup?: boolean;
  signatures?: boolean;
  hasLink?: boolean;
  hasGeo?: boolean;
  slowmodeEnabled?: boolean;
  gigagroup?: boolean;
  restrictionReason?: RestrictionReason[];
  dcId?: number;
  photo?: ChatPhoto;
  constructor(resultsGetEntity: Api.TypeUser | Api.TypeChat | Api.Channel) {
    if (resultsGetEntity instanceof Api.User) {
      resultsGetEntity as Api.User;
      this.type = 'user';
      this.self = resultsGetEntity.self;
      this.contact = resultsGetEntity.contact;
      this.mutualContact = resultsGetEntity.mutualContact;
      this.deleted = resultsGetEntity.deleted;
      this.bot = resultsGetEntity.bot;
      this.botChatHistory = resultsGetEntity.botChatHistory;
      this.botNochats = resultsGetEntity.botNochats;
      this.verified = resultsGetEntity.verified;
      this.restricted = resultsGetEntity.restricted;
      this.min = resultsGetEntity.min;
      this.botInlineGeo = resultsGetEntity.botInlineGeo;
      this.support = resultsGetEntity.support;
      this.scam = resultsGetEntity.scam;
      this.applyMinPhoto = resultsGetEntity.applyMinPhoto;
      this.fake = resultsGetEntity.fake;
      if (isInstance(resultsGetEntity.id)) {
        //@ts-ignore
        this.id = BigInt(toString(resultsGetEntity.id));
      } else {
        //@ts-ignore
        this.id = BigInt(resultsGetEntity.id);
      }
      this.accessHash = BigInt(toString(resultsGetEntity.accessHash as BigInteger) as string);
      this.firstName = resultsGetEntity.firstName;
      this.lastName = resultsGetEntity.lastName;
      this.username = resultsGetEntity.username;
      this.phone = resultsGetEntity.phone;
      this.botInfoVersion = resultsGetEntity.botInfoVersion;
      this.botInlinePlaceholder = resultsGetEntity.botInlinePlaceholder;
      this.langCode = resultsGetEntity.langCode;
      if (resultsGetEntity.status) {
        switch (resultsGetEntity.status.className) {
          case 'UserStatusOnline':
            this.status = 'online';
            break;
          case 'UserStatusOffline':
            this.status = 'offline';
            break;
          case 'UserStatusRecently':
            this.status = 'recently';
            break;
          case 'UserStatusLastWeek':
            this.status = 'withinWeek';
            break;
          case 'UserStatusLastMonth':
            this.status = 'withinMonth';
            break;
          default:
            this.status = 'longTimeAgo';
        }
      }
      if (resultsGetEntity.restrictionReason) {
        let temp: RestrictionReason[] = [];
        for (let i = 0; i < resultsGetEntity.restrictionReason.length; i++) {
          temp.push(new RestrictionReason(resultsGetEntity.restrictionReason[i]));
        }
        this.restrictionReason = temp;
      }
      if (resultsGetEntity.photo instanceof Api.UserProfilePhoto) {
        resultsGetEntity.photo as Api.UserProfilePhoto;
        this.photo = new ChatPhoto(resultsGetEntity.photo!, this);
        this.dcId = resultsGetEntity.photo.dcId;
      }
    }
    if (resultsGetEntity instanceof Api.Chat) {
      resultsGetEntity as Api.Chat;
      this.type = 'chat';
      this.creator = resultsGetEntity.creator;
      this.kicked = resultsGetEntity.kicked;
      this.left = resultsGetEntity.left;
      this.deactivated = resultsGetEntity.deactivated;
      this.callActive = resultsGetEntity.callActive;
      this.callNotEmpty = resultsGetEntity.callNotEmpty;
      if (isInstance(resultsGetEntity.id)) {
        //@ts-ignore
        this.id = BigInt(`-${toString(resultsGetEntity.id as BigInteger) as string}` as string);
      } else {
        //@ts-ignore
        this.id = BigInt(`-${resultsGetEntity.id}`);
      }
      this.title = resultsGetEntity.title;
      this.participantsCount = resultsGetEntity.participantsCount;
      this.version = resultsGetEntity.version;
      if (resultsGetEntity.migratedTo instanceof Api.InputChannel) {
        this.migratedTo = new MigrateTo(resultsGetEntity.migratedTo);
      }
      if (resultsGetEntity.adminRights instanceof Api.ChatAdminRights) {
        this.adminRights = new AdminRights(resultsGetEntity.adminRights);
      }
      if (resultsGetEntity.defaultBannedRights instanceof Api.ChatBannedRights) {
        this.defaultBannedRights = new BannedRights(resultsGetEntity.defaultBannedRights);
      }
      if (resultsGetEntity.photo instanceof Api.ChatPhoto) {
        resultsGetEntity.photo as Api.ChatPhoto;
        this.photo = new ChatPhoto(resultsGetEntity.photo!, this);
        this.dcId = resultsGetEntity.photo.dcId;
      }
    }
    if (resultsGetEntity instanceof Api.Channel) {
      resultsGetEntity as Api.Channel;
      this.type = 'channel';
      this.creator = resultsGetEntity.creator;
      this.left = resultsGetEntity.left;
      this.broadcast = resultsGetEntity.broadcast;
      this.verified = resultsGetEntity.verified;
      this.megagroup = resultsGetEntity.megagroup;
      this.restricted = resultsGetEntity.restricted;
      this.signatures = resultsGetEntity.signatures;
      this.min = resultsGetEntity.min;
      this.scam = resultsGetEntity.scam;
      this.hasLink = resultsGetEntity.hasLink;
      this.hasGeo = resultsGetEntity.hasGeo;
      this.slowmodeEnabled = resultsGetEntity.slowmodeEnabled;
      this.callActive = resultsGetEntity.callActive;
      this.callNotEmpty = resultsGetEntity.callNotEmpty;
      this.fake = resultsGetEntity.fake;
      this.gigagroup = resultsGetEntity.gigagroup;
      if (isInstance(resultsGetEntity.id)) {
        //@ts-ignore
        this.id = BigInt(`-100${toString(resultsGetEntity.id as BigInteger) as string}` as string);
      } else {
        //@ts-ignore
        this.id = BigInt(`-100${resultsGetEntity.id}`);
      }
      this.accessHash = BigInt(toString(resultsGetEntity.accessHash as BigInteger) as number);
      this.title = resultsGetEntity.title;
      this.username = resultsGetEntity.username;
      if (resultsGetEntity.adminRights instanceof Api.ChatAdminRights) {
        this.adminRights = new AdminRights(resultsGetEntity.adminRights);
      }
      if (resultsGetEntity.bannedRights instanceof Api.ChatBannedRights) {
        this.bannedRights = new BannedRights(resultsGetEntity.bannedRights);
      }
      if (resultsGetEntity.defaultBannedRights instanceof Api.ChatBannedRights) {
        this.defaultBannedRights = new BannedRights(resultsGetEntity.defaultBannedRights);
      }
      this.participantsCount = resultsGetEntity.participantsCount!;
      if (resultsGetEntity.restrictionReason) {
        let temp: RestrictionReason[] = [];
        for (let i = 0; i < resultsGetEntity.restrictionReason.length; i++) {
          temp.push(new RestrictionReason(resultsGetEntity.restrictionReason[i]));
        }
        this.restrictionReason = temp;
      }
      if (resultsGetEntity.photo instanceof Api.ChatPhoto) {
        resultsGetEntity.photo as Api.ChatPhoto;
        this.photo = new ChatPhoto(resultsGetEntity.photo!, this);
        this.dcId = resultsGetEntity.photo.dcId;
      }
    }
  }
}
export async function GetEntity(
  snakeClient: Snake,
  chatId: bigint | string | number,
  useCache?: boolean
): Promise<ResultGetEntity> {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.getEntity`
      );
    }
    if (useCache) {
      if (typeof chatId == 'number') {
        if (snakeClient.entityCache.get(BigInt(toString(chatId) as string) as bigint)) {
          if (mode.includes(snakeClient.logger)) {
            snakeClient.log(
              `[${
                snakeClient.connectTime
              }] - [${new Date().toLocaleString()}] - [telegram.getEntity] using cache`
            );
          }
          //@ts-ignore
          return snakeClient.entityCache.get(BigInt(toString(chatId) as string) as bigint);
        }
      }
      if (typeof chatId == 'bigint') {
        if (snakeClient.entityCache.get(chatId as bigint)) {
          if (mode.includes(snakeClient.logger)) {
            snakeClient.log(
              `[${
                snakeClient.connectTime
              }] - [${new Date().toLocaleString()}] - [telegram.getEntity] using cache`
            );
          }
          //@ts-ignore
          return snakeClient.entityCache.get(chatId as bigint);
        }
      }
    }
    let e = await snakeClient.client.getEntity(convertId(chatId));
    let r = new ResultGetEntity(e);
    snakeClient.entityCache.set(r.id, r);
    return r;
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.getEntity';
    botError.functionArgs = `${chatId},${useCache}`;
    throw botError;
  }
}
