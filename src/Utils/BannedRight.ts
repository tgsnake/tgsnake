// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
export class BannedRights {
  viewMessages?: boolean;
  sendMessages?: boolean;
  sendMedia?: boolean;
  sendStickers?: boolean;
  sendGifs?: boolean;
  sendGames?: boolean;
  sendInline?: boolean;
  embedLinks?: boolean;
  sendPolls?: boolean;
  changeInfo?: boolean;
  inviteUsers?: boolean;
  pinMessages?: boolean;
  untilDate: number;
  constructor(bannedRights: Api.ChatBannedRights) {
    this.viewMessages = bannedRights.viewMessages;
    this.sendMessages = bannedRights.sendMessages;
    this.sendMedia = bannedRights.sendMedia;
    this.sendStickers = bannedRights.sendStickers;
    this.sendGifs = bannedRights.sendGifs;
    this.sendGames = bannedRights.sendGames;
    this.sendInline = bannedRights.sendInline;
    this.embedLinks = bannedRights.embedLinks;
    this.sendPolls = bannedRights.sendPolls;
    this.changeInfo = bannedRights.changeInfo;
    this.inviteUsers = bannedRights.inviteUsers;
    this.pinMessages = bannedRights.pinMessages;
    this.untilDate = bannedRights.untilDate;
  }
}
