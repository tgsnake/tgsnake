// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
export class Reactions {
  reaction?: string;
  customEmojiId?: bigint;
  count!: number;
  constructor(reaction: Api.ReactionCount) {
    this.count = reaction.count;
    if (reaction.reaction instanceof Api.ReactionEmoji) {
      this.reaction = (reaction.reaction as Api.ReactionEmoji).emoticon;
    }
    if (reaction.reaction instanceof Api.ReactionCustomEmoji) {
      this.customEmojiId = BigInt(
        String((reaction.reaction as Api.ReactionCustomEmoji).documentId)
      );
    }
  }
}
