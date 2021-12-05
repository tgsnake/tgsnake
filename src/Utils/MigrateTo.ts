// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { BigInteger } from 'big-integer';
import { toNumber } from './ToBigInt';
export class MigrateTo {
  id!: bigint;
  accessHash!: bigint;
  constructor(migratedTo: Api.InputChannel) {
    this.id = BigInt(toNumber(migratedTo.channelId) as number);
    this.accessHash = BigInt(toNumber(migratedTo.accessHash) as number);
  }
}
