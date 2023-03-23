/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { Storages, Raws } from '@tgsnake/core';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../Context/Logger';

export class SnakeSession extends Storages.BaseSession {
  private _name!: string;
  constructor(name: string) {
    super();
    this._name = name;
  }
  async load() {
    let sessionName = `${this._name}.session`;
    if (fs.existsSync(path.join(process.cwd(), sessionName))) {
      let start = Math.floor(Date.now() / 1000);
      let bytes = fs.readFileSync(path.join(process.cwd(), sessionName));
      Logger.debug(`Session have a ${bytes.length} bytes`);
      this._dcId = bytes.readUInt8(0); // 1
      Logger.debug(`Found dcId: ${this._dcId}.`);
      this._apiId = bytes.readUInt32LE(1); // 5
      Logger.debug(`Found apiId: ${this._apiId}.`);
      this._testMode = bytes.readUInt8(5) ? true : false; // 6
      Logger.debug(`Found testMode: ${this._testMode}.`);
      this._authKey = bytes.slice(6, 262); // 262
      Logger.debug(`Found authKey: ${this._authKey.length} bytes.`);
      this._userId = BigInt(`0x${bytes.slice(262, 270).toString('hex')}`); // 270
      Logger.debug(`Found userId: ${this._userId}.`);
      this._isBot = bytes.readUInt8(270) ? true : false; // 271
      Logger.debug(`Found isBot: ${this._isBot}.`);
      Logger.debug(`Done parsing string session (${Math.floor(Date.now() / 1000) - start}s)`);
    }
    for (let peer of await this._loadCache()) {
      this._peers.set(peer[0], peer);
    }
  }
  async save() {
    let sessionName = `${this._name}.session`;
    let cacheName = `${this._name}.cache`;
    // save session when it unavailable.
    if (!fs.existsSync(path.join(process.cwd(), sessionName))) {
      fs.writeFileSync(
        path.join(process.cwd(), sessionName),
        Buffer.from(await this.exportString(), 'base64url')
      );
      Logger.info(`Session saved to: "${path.join(process.cwd(), sessionName)}".`);
    }
    fs.writeFileSync(path.join(process.cwd(), cacheName), await this._makeCache());
    Logger.info(`Cache saved to: "${path.join(process.cwd(), cacheName)}".`);
  }
  /**
   * Load the tgsnake peers cache.
   */
  private async _loadCache(): Promise<
    Array<[id: bigint, accessHash: bigint, type: string, username?: string, phoneNumber?: string]>
  > {
    let peer: Array<any> = [];
    let cacheName = `${this._name}.cache`;
    if (fs.existsSync(path.join(process.cwd(), cacheName))) {
      let bytes = new Raws.BytesIO(fs.readFileSync(path.join(process.cwd(), cacheName)));
      let length = await Raws.Primitive.Int.read(bytes);
      // bytes[VectorLength + VectorBytes[bytes[contentLength + content]]]
      for (let i = 0; i < length; i++) {
        let count = await Raws.Primitive.Int.read(bytes);
        peer.push(await buildPeerFromBytes(bytes.read(count)));
      }
    }
    return peer as unknown as Array<
      [id: bigint, accessHash: bigint, type: string, username?: string, phoneNumber?: string]
    >;
  }
  /**
   * Make a bytes cache of peers.
   */
  private async _makeCache(): Promise<Buffer> {
    let count = 0;
    let bytes = new Raws.BytesIO();
    for (let [key, value] of this._peers) {
      count += 1;
      let content = await buildBytesFromPeer(value);
      bytes.write(Buffer.concat([Raws.Primitive.Int.write(content.length), content]));
    }
    return Buffer.concat([Raws.Primitive.Int.write(count), bytes.buffer]);
  }
  /** @hidden */
  [Symbol.for('nodejs.util.inspect.custom')](): { [key: string]: any } {
    const toPrint: { [key: string]: any } = {
      _: this.constructor.name,
    };
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        const value = this[key];
        if (!key.startsWith('_')) {
          toPrint[key] = value;
        }
      }
    }
    return toPrint;
  }
  /**@hidden*/
  toJSON(): { [key: string]: any } {
    const toPrint: { [key: string]: any } = {
      _: this.constructor.name,
    };
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        const value = this[key];
        if (!key.startsWith('_')) {
          toPrint[key] = typeof value === 'bigint' ? String(value) : value;
        }
      }
    }
    return toPrint;
  }
  /** @hidden */
  toString(): string {
    return `[constructor of ${this.constructor.name}] ${JSON.stringify(this, null, 2)}`;
  }
}
/**
 * Creating valid bytes from peer schema.
 * @param peer {Array} - Peer will be convert to bytes
 */
export function buildBytesFromPeer(
  peer: [id: bigint, accessHash: bigint, type: string, username?: string, phoneNumber?: string]
): Buffer {
  let bytes = new Raws.BytesIO();
  let flags = 0;
  if (peer[3]) {
    flags |= 1 << 4;
  }
  if (peer[4]) {
    flags |= 1 << 5;
  }
  bytes.write(Raws.Primitive.Int.write(flags));
  bytes.write(Raws.Primitive.Long.write(peer[0]));
  bytes.write(Raws.Primitive.Long.write(peer[1]));
  bytes.write(Raws.Primitive.String.write(peer[2]));
  if (peer[3]) {
    bytes.write(Raws.Primitive.String.write(peer[3]));
  }
  if (peer[4]) {
    bytes.write(Raws.Primitive.String.write(peer[4]));
  }
  return bytes.buffer;
}
/**
 * Creating valid peer schema from bytes.
 * @param bytes {Buffer} - Bytes will be converted to peer schema.
 */
export async function buildPeerFromBytes(
  bytes: Buffer
): Promise<
  [id: bigint, accessHash: bigint, type: string, username?: string, phoneNumber?: string]
> {
  let b = new Raws.BytesIO(bytes);
  // @ts-ignore
  let results: Array<any> = [];
  let flags = await Raws.Primitive.Int.read(b);
  results.push(await Raws.Primitive.Long.read(b));
  results.push(await Raws.Primitive.Long.read(b));
  results.push(await Raws.Primitive.String.read(b));
  if (flags & (1 << 4)) {
    results.push(await Raws.Primitive.String.read(b));
  }
  if (flags & (1 << 5)) {
    results.push(await Raws.Primitive.String.read(b));
  }
  return results as unknown as [
    id: bigint,
    accessHash: bigint,
    type: string,
    username?: string,
    phoneNumber?: string
  ];
}

export function generateName(base: string): string {
  let i = 0;
  while (true) {
    let name = i === 0 ? base : `${base}${i}`;
    if (
      !fs.existsSync(path.join(process.cwd(), `${name}.session`)) &&
      !fs.existsSync(path.join(process.cwd(), `${name}.cache`))
    ) {
      return name;
    }
    i++;
  }
}
