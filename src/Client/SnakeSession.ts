// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { MemorySession } from 'telegram/sessions/Memory';
import { AuthKey } from 'telegram/crypto/AuthKey';
import bigInt from 'big-integer';
import { ResultGetEntity } from '../Telegram/Users/GetEntity';
import fs from 'fs';

export interface InterfaceSnakeSession {
  authKey: any;
  dcId: number;
  port: number;
  serverAddress: string;
  entities: Array<any>;
}
let ignore = ['session.json', 'cache.json'];
const CURRENT_VERSION = '1';
export class SnakeSession extends MemorySession {
  private _sessionName!: string;
  constructor(sessionName: string) {
    super();
    this._sessionName = sessionName;
  }
  async load() {
    if (fs.existsSync(`${process.cwd()}/${this._sessionName}`)) {
      let dir = fs.readdirSync(`${process.cwd()}/${this._sessionName}`);
      if (dir.includes('session.json')) {
        let json = JSON.parse(
          fs.readFileSync(`${process.cwd()}/${this._sessionName}/session.json`, 'utf8')
        );
        let authKey = json.authKey;
        if (authKey && typeof authKey === 'object') {
          this._authKey = new AuthKey();
          if ('data' in authKey) {
            authKey = Buffer.from(authKey.data);
          }
          await this._authKey.setKey(authKey);
        }
        if (json.dcId) this._dcId = json.dcId;
        if (json.port) this._port = json.port;
        if (json.serverAddress) this._serverAddress = json.serverAddress;
      } else {
        // importing from storeSession then remove it.
        if (dir.includes(`${this._sessionName}%3AauthKey`)) {
          let authKey = JSON.parse(
            fs.readFileSync(
              `${process.cwd()}/${this._sessionName}/${this._sessionName}%3AauthKey`,
              'utf8'
            )
          );
          if (authKey && typeof authKey === 'object') {
            this._authKey = new AuthKey();
            if ('data' in authKey) {
              authKey = Buffer.from(authKey.data);
            }
            await this._authKey.setKey(authKey);
          }
        }
        if (dir.includes(`${this._sessionName}%3AdcId`)) {
          let dcId = fs.readFileSync(
            `${process.cwd()}/${this._sessionName}/${this._sessionName}%3AdcId`,
            'utf8'
          );
          if (!isNaN(Number(dcId))) this._dcId = Number(dcId);
        }
        if (dir.includes(`${this._sessionName}%3Aport`)) {
          let port = fs.readFileSync(
            `${process.cwd()}/${this._sessionName}/${this._sessionName}%3Aport`,
            'utf8'
          );
          if (!isNaN(Number(port))) this._port = Number(port);
        }
        if (dir.includes(`${this._sessionName}%3AserverAddress`)) {
          let serverAddress = fs.readFileSync(
            `${process.cwd()}/${this._sessionName}/${this._sessionName}%3AserverAddress`,
            'utf8'
          );
          if (serverAddress) this._serverAddress = String(serverAddress).replace(/\"|\'/g, '');
        }
        fs.writeFileSync(
          `${process.cwd()}/${this._sessionName}/session.json`,
          JSON.stringify({
            authKey: this._authKey?.getKey(),
            dcId: this._dcId,
            port: this._port,
            serverAddress: this._serverAddress,
            entities: [],
          })
        );
        for (let file of dir) {
          if (!ignore.includes(file)) {
            fs.unlinkSync(`${process.cwd()}/${this._sessionName}/${file}`);
          }
        }
      }
    }
  }
  setDC(dcId: number, serverAddress: string, port: number) {
    super.setDC(dcId, serverAddress, port);
    const create = () => {
      let dir = fs.readdirSync(`${process.cwd()}/${this._sessionName}`);
      if (dir.includes('session.json')) {
        let session = JSON.parse(
          fs.readFileSync(`${process.cwd()}/${this._sessionName}/session.json`, 'utf8')
        );
        session.dcId = dcId;
        session.serverAddress = serverAddress;
        session.port = port;
        fs.writeFileSync(
          `${process.cwd()}/${this._sessionName}/session.json`,
          JSON.stringify(session)
        );
      } else {
        fs.writeFileSync(
          `${process.cwd()}/${this._sessionName}/session.json`,
          JSON.stringify({
            authKey: this._authKey?.getKey(),
            dcId: dcId,
            port: port,
            serverAddress: serverAddress,
            entities: [],
          })
        );
      }
      for (let file of dir) {
        if (!ignore.includes(file)) {
          fs.unlinkSync(`${process.cwd()}/${this._sessionName}/${file}`);
        }
      }
    };
    if (fs.existsSync(`${process.cwd()}/${this._sessionName}`)) {
      create();
    } else {
      fs.mkdirSync(`${process.cwd()}/${this._sessionName}`, {
        recursive: true,
      });
      create();
    }
  }
  get authKey() {
    return this._authKey;
  }
  set authKey(value: AuthKey | undefined) {
    this._authKey = value;
    const create = () => {
      let dir = fs.readdirSync(`${process.cwd()}/${this._sessionName}`);
      if (dir.includes('session.json')) {
        let session = JSON.parse(
          fs.readFileSync(`${process.cwd()}/${this._sessionName}/session.json`, 'utf8')
        );
        session.authKey = value?.getKey();
        fs.writeFileSync(
          `${process.cwd()}/${this._sessionName}/session.json`,
          JSON.stringify(session)
        );
      } else {
        fs.writeFileSync(
          `${process.cwd()}/${this._sessionName}/session.json`,
          JSON.stringify({
            authKey: value?.getKey(),
            dcId: this._dcId,
            port: this._port,
            serverAddress: this._serverAddress,
            entities: [],
          })
        );
      }
      for (let file of dir) {
        if (!ignore.includes(file)) {
          fs.unlinkSync(`${process.cwd()}/${this._sessionName}/${file}`);
        }
      }
    };
    if (fs.existsSync(`${process.cwd()}/${this._sessionName}`)) {
      create();
    } else {
      fs.mkdirSync(`${process.cwd()}/${this._sessionName}`, {
        recursive: true,
      });
      create();
    }
  }
  processEntities(tlo: any) {
    let rows = this._entitiesToRows(tlo);
    if (!rows) return;
    if (!fs.existsSync(`${process.cwd()}/${this._sessionName}/session.json`)) return;
    let session = JSON.parse(
      fs.readFileSync(`${process.cwd()}/${this._sessionName}/session.json`, 'utf8')
    );
    let final: Array<any> = [];
    for (let row of rows) {
      row.push(new Date().getTime().toString());
      final.push(row);
    }
    session.entities = final;
    fs.writeFileSync(`${process.cwd()}/${this._sessionName}/session.json`, JSON.stringify(session));
  }
  getEntityRowsById(id: string | bigInt.BigInteger, exact: boolean = true) {
    if (!fs.existsSync(`${process.cwd()}/${this._sessionName}/session.json`)) return undefined;
    let session = JSON.parse(
      fs.readFileSync(`${process.cwd()}/${this._sessionName}/session.json`, 'utf8')
    );
    let rows = session.entities;
    for (let row of rows) {
      if (String(id) == row[0]) return row;
    }
  }
  save() {
    if (!this.authKey || !this.serverAddress || !this.port) {
      return '';
    }
    const key = this.authKey.getKey();
    if (!key) {
      return '';
    }
    const dcBuffer = Buffer.from([this.dcId]);
    const addressBuffer = Buffer.from(this.serverAddress);
    const addressLengthBuffer = Buffer.alloc(2);
    addressLengthBuffer.writeInt16BE(addressBuffer.length, 0);
    const portBuffer = Buffer.alloc(2);
    portBuffer.writeInt16BE(this.port, 0);
    return (
      CURRENT_VERSION +
      Buffer.concat([dcBuffer, addressLengthBuffer, addressBuffer, portBuffer, key]).toString(
        'base64'
      )
    );
  }
}
