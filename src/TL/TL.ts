/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import type { Snake } from '../Client';
import type { Telegram } from '../Methods/Telegram';
export class TLObject {
  protected _client!: Snake;
  className!: string;
  classType!: string;
  constructorId!: number;
  subclassOfId!: number;
  constructor(client: Snake) {
    this._client = client;
    this.className = this.constructor.name;
    this.classType = 'types';
    this.constructorId = 0;
    this.subclassOfId = 0;
  }
  get client() {
    return this._client;
  }
  get api(): Telegram {
    return this._client.api;
  }
  [Symbol.for('nodejs.util.inspect.custom')](): { [key: string]: any } {
    const toPrint: { [key: string]: any } = {
      _: this.className,
    };
    let ignore = ['className', 'constructorId', 'subclassOfId', 'classType'];
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        const value = this[key];
        if (ignore.includes(key)) continue;
        if (!key.startsWith('_') && value !== undefined && value !== null) {
          toPrint[key] = value;
        }
      }
    }
    return toPrint;
  }
  toJSON(): { [key: string]: any } {
    const toPrint: { [key: string]: any } = {
      _: this.className,
    };
    let ignore = ['className', 'constructorId', 'subclassOfId', 'classType'];
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        const value = this[key];
        if (ignore.includes(key)) continue;
        if (!key.startsWith('_') && value !== undefined && value !== null) {
          toPrint[key] = typeof value === 'bigint' ? String(value) : value;
        }
      }
    }
    return toPrint;
  }
  toString() {
    return `[constructor of ${this.className}] ${JSON.stringify(this, null, 2)}`;
  }
}
