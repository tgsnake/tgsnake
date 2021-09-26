// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { BigInteger } from 'big-integer';
export class MigrateTo {
  id!: number;
  accessHash!: BigInteger;
  constructor(migratedTo: Api.InputChannel) {
    this.id = migratedTo.channelId;
    this.accessHash = migratedTo.accessHash;
  }
}
