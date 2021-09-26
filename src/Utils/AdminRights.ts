// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
export class AdminRights {
  changeInfo?: boolean;
  postMessages?: boolean;
  editMessages?: boolean;
  deleteMessages?: boolean;
  banUsers?: boolean;
  inviteUsers?: boolean;
  pinMessages?: boolean;
  addAdmins?: boolean;
  anonymous?: boolean;
  manageCall?: boolean;
  other?: boolean;
  constructor(adminRights: Api.ChatAdminRights) {
    this.changeInfo = adminRights.changeInfo;
    this.postMessages = adminRights.postMessages;
    this.editMessages = adminRights.editMessages;
    this.deleteMessages = adminRights.deleteMessages;
    this.banUsers = adminRights.banUsers;
    this.inviteUsers = adminRights.inviteUsers;
    this.pinMessages = adminRights.pinMessages;
    this.addAdmins = adminRights.addAdmins;
    this.anonymous = adminRights.anonymous;
    this.manageCall = adminRights.manageCall;
    this.other = adminRights.other;
  }
}
