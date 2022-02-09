// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
export class Reactions {
  chosen?: boolean;
  reaction!: string;
  count!: number;
  constructor(reactions: Api.MessageReactions) {
    for (let i = 0; i < reactions.results.length; i++) {
      let reaction = reactions.results[i] as Api.ReactionCount;
      this.chosen = reaction.chosen;
      this.reaction = reaction.reaction;
      this.count = reaction.count;
    }
  }
}
