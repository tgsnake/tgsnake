// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

export default class BotError extends Error {
  functionName!: string;
  functionArgs!: string;
  error!: any; 
  date:number = Math.floor(Date.now() / 1000)
  constructor() {
    super();
  }
  get message() {
    //@ts-ignore
    return this.error.message;
  }
}
