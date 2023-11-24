// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { MigrateTo } from '../../Utils/MigrateTo';
import { BannedRights } from '../../Utils/BannedRight';
import { MediaChatPhoto } from '../../Utils/Medias';
import { RestrictionReason } from '../../Utils/RestrictionReason';
import { AdminRights } from '../../Utils/AdminRights';
import { Api } from 'telegram';
import bigInt, { BigInteger, isInstance } from 'big-integer';
import { toBigInt, toString, convertId } from '../../Utils/ToBigInt';
import { Cleaning, betterConsoleLog } from '../../Utils/CleanObject';
import { Snake } from '../../Client';
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
  photo?: MediaChatPhoto;
  noforward?: boolean;
  constructor() {}
  async init(resultsGetEntity: Api.TypeUser | Api.TypeChat | Api.Channel, snakeClient: Snake) {
    if (!resultsGetEntity) return this;
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
      this.id = BigInt(String(resultsGetEntity.id));
      /*if (isInstance(resultsGetEntity.id)) {
        //@ts-ignore
        this.id = BigInt(toString(resultsGetEntity.id));
      } else {
        //@ts-ignore
        this.id = BigInt(resultsGetEntity.id);
      }*/
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
        this.photo = new MediaChatPhoto();
        await this.photo.encode(resultsGetEntity.photo, this.id!, this.accessHash!, snakeClient);
        this.dcId = resultsGetEntity.photo.dcId;
      }
      return this;
    }
    if (resultsGetEntity instanceof Api.Chat) {
      resultsGetEntity as Api.Chat;
      this.type = 'chat';
      this.creator = resultsGetEntity.creator;
      this.left = resultsGetEntity.left;
      this.deactivated = resultsGetEntity.deactivated;
      this.callActive = resultsGetEntity.callActive;
      this.callNotEmpty = resultsGetEntity.callNotEmpty;
      this.noforward = resultsGetEntity.noforwards;
      this.id = BigInt(-1) * BigInt(String(resultsGetEntity.id));
      /*if (isInstance(resultsGetEntity.id)) {
        //@ts-ignore
        this.id = BigInt(`-${toString(resultsGetEntity.id as BigInteger) as string}` as string);
      } else {
        //@ts-ignore
        this.id = BigInt(`-${resultsGetEntity.id}`);
      }*/
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
        this.photo = new MediaChatPhoto();
        await this.photo.encode(resultsGetEntity.photo!, this.id!, this.accessHash!, snakeClient);
        this.dcId = resultsGetEntity.photo.dcId;
      }
      return this;
    }
    if (resultsGetEntity instanceof Api.Channel) {
      resultsGetEntity as Api.Channel;
      this.type = resultsGetEntity.megagroup ? 'supergroup' : 'channel';
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
      this.noforward = resultsGetEntity.noforwards;
      this.id = BigInt(-1000000000000) - BigInt(String(resultsGetEntity.id));
      /*if (isInstance(resultsGetEntity.id)) {
        //@ts-ignore
        this.id = BigInt(`-100${toString(resultsGetEntity.id as BigInteger) as string}` as string);
      } else {
        //@ts-ignore
        this.id = BigInt(`-100${resultsGetEntity.id}`);
      }*/
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
        this.photo = new MediaChatPhoto();
        await this.photo.encode(resultsGetEntity.photo!, this.id!, this.accessHash!, snakeClient);
        this.dcId = resultsGetEntity.photo.dcId;
      }
      return this;
    }
    return this;
  }
  /** @hidden */
  toJSON() {
    let obj = betterConsoleLog(this);
    for (let [key, value] of Object.entries(obj)) {
      if (typeof value == 'bigint') obj[key] = String(value);
    }
    return obj;
  }
}
export async function GetEntity(
  snakeClient: Snake,
  chatId: bigint | string | number,
  useCache: boolean = true
): Promise<ResultGetEntity> {
  try {
    snakeClient.log.debug('Running telegram.getEntity');
    if (useCache) {
      if (typeof chatId == 'number') {
        if (snakeClient.entityCache.get(BigInt(toString(chatId) as string) as bigint)) {
          snakeClient.log.debug(
            'Entity already in cache, so we use it, not fetching fresh data from telegram.'
          );
          //@ts-ignore
          return snakeClient.entityCache.get(BigInt(toString(chatId) as string) as bigint);
        }
      }
      if (typeof chatId == 'bigint') {
        if (snakeClient.entityCache.get(chatId as bigint)) {
          snakeClient.log.debug(
            'Entity already in cache, so we use it, not fetching fresh data from telegram.'
          );
          //@ts-ignore
          return snakeClient.entityCache.get(chatId as bigint);
        }
      }
      if (typeof chatId == 'string') {
        if (String(chatId).startsWith('@')) {
          if (snakeClient.entityCache.get(String(chatId).replace('@', '') as string)) {
            snakeClient.log.debug(
              'Entity already in cache, so we use it, not fetching fresh data from telegram.'
            );
            //@ts-ignore
            return snakeClient.entityCache.get(String(chatId).replace('@', '') as string);
          }
        }
      }
    }
    snakeClient.log.debug(
      'Entity not available in cache, so we fetching fresh data from telegram.'
    );
    let e = await snakeClient.client.getEntity(convertId(chatId));
    snakeClient.log.debug('Creating ResultGetEntity');
    let r = new ResultGetEntity();
    await r.init(e, snakeClient);
    snakeClient.log.debug('Caching ResultGetEntity');
    snakeClient.entityCache.set(r.id, r);
    if (r.username) snakeClient.entityCache.set(r.username, r);
    return r;
  } catch (error: any) {
    snakeClient.log.error('Failed running telegram.getEntity');
    throw new BotError(error.message, 'telegram.getEntity', `${chatId},${useCache}`);
  }
}
