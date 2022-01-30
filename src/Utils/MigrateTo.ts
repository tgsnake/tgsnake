// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { BigInteger } from 'big-integer';
import { toString } from './ToBigInt';
export class MigrateTo {
  id!: bigint;
  accessHash!: bigint;
  constructor(migratedTo: Api.InputChannel) {
    this.id = BigInt(toString(migratedTo.channelId) as string);
    this.accessHash = BigInt(toString(migratedTo.accessHash) as string);
  }
}
