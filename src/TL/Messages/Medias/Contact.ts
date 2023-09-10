/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { TLObject } from '../../TL.ts';
import { Raw, Helpers } from '../../../platform.deno.ts';
import type { Snake } from '../../../Client/index.ts';

// https://core.telegram.org/bots/api#contact
export class Contact extends TLObject {
  phoneNumber!: string;
  firstName!: string;
  lastName?: string;
  userId?: bigint;
  vcard?: string;
  constructor(
    {
      phoneNumber,
      firstName,
      lastName,
      userId,
      vcard,
    }: {
      phoneNumber: string;
      firstName: string;
      lastName?: string;
      userId?: bigint;
      vcard?: string;
    },
    client: Snake,
  ) {
    super(client);
    this.className = 'contact';
    this.classType = 'types';
    this.constructorId = 0x70322949; // Raw.MessageMediaContact
    this.subclassOfId = 0x476cbe32; // Raw.TypeMessageMedia
    this.phoneNumber = phoneNumber;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userId = userId;
    this.vcard = vcard;
  }
  static parse(client: Snake, contact: Raw.MessageMediaContact) {
    return new Contact(
      {
        phoneNumber: contact.phoneNumber,
        firstName: contact.firstName,
        lastName: contact.lastName,
        userId: contact.userId,
        vcard: contact.vcard,
      },
      client,
    );
  }
}
