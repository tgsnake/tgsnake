// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
export class RestrictionReason {
  platform!: string;
  text!: string;
  reason!: string;
  constructor(restrictionReason: Api.RestrictionReason) {
    this.platform = restrictionReason.platform;
    this.text = restrictionReason.text;
    this.reason = restrictionReason.reason;
  }
}
