// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Media } from './Media';
import { Snake } from '../../Client';

export class MediaContact extends Media {
  phoneNumber!: string;
  firstName!: string;
  lastName?: string;
  vcard!: string;
  userId!: bigint;
  constructor() {
    super();
    this['_'] = 'contact';
  }
  encode(contact: Api.MessageMediaContact, snakeClient: Snake) {
    snakeClient.log.debug('Creating MediaContact');
    this.snakeClient = snakeClient;
    this.phoneNumber = contact.phoneNumber;
    this.firstName = contact.firstName;
    this.lastName = contact.lastName;
    this.vcard = contact.vcard;
    this.userId = BigInt(String(contact.userId));
    return this;
  }
}
