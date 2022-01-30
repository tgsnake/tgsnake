// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

export default class BotError extends Error {
  functionName!: string;
  functionArgs!: string;
  message!: string;
  date: number = Math.floor(Date.now() / 1000);
  _isBotErrorClass: boolean = true;
  constructor(message: string, functionName: string, functionArgs: string) {
    super();
    this.message = message;
    this.functionName = functionName;
    this.functionArgs = functionArgs;
    return this;
  }
}
