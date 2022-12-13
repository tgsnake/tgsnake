// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Media } from './Media';
import { FileId, decodeFileId } from 'tg-file-id';
import { Snake } from '../../Client';
import bigInt, { BigInteger } from 'big-integer';
import { Cleaning } from '../CleanObject';
import BotError from '../../Context/Error';
import { DownloadFileParams } from '../../Interface/Download';

export class MediaVoice extends Media {
  /** @hidden */
  _id!: bigint;
  /** @hidden */
  _accessHash!: bigint;
  /** @hidden */
  _fileReference!: string;
  dcId!: number;
  mimeType!: string;
  size!: bigint;
  fileId!: string;
  uniqueFileId!: string;
  duration!: number;
  title!: string;
  performer!: string;
  waveform!: Buffer;
  constructor() {
    super();
    this['_'] = 'voice';
  }
  async encode(voice: Api.Document, snakeClient: Snake) {
    snakeClient.log.debug('Creating MediaVoice');
    this.snakeClient = snakeClient;
    this._id = BigInt(String(voice.id));
    this._accessHash = BigInt(String(voice.accessHash));
    this._fileReference = voice.fileReference.toString('hex');
    this.mimeType = voice.mimeType;
    this.size = BigInt(String(voice.size));
    this.dcId = voice.dcId;
    for (let attribute of voice.attributes) {
      if (attribute instanceof Api.DocumentAttributeAudio) {
        attribute as Api.DocumentAttributeAudio;
        //@ts-ignore
        this.title = attribute.title;
        //@ts-ignore
        this.performer = attribute.performer;
        //@ts-ignore
        this.waveform = attribute.waveform;
      }
    }
    let file = new FileId();
    file.version = 4;
    file.subVersion = 30;
    file.dcId = this.dcId;
    file.fileType = 'voice';
    file.typeId = 3;
    file.volumeId = BigInt(1);
    file.id = this._id;
    file.accessHash = this._accessHash;
    file.fileReference = this._fileReference;
    this.fileId = await file.toFileId();
    this.uniqueFileId = await file.toFileUniqId();
    await Cleaning(this);
    return this;
  }
  async download(fileId?: string, params?: DownloadFileParams) {
    this.snakeClient.log.debug('Downloading Voice');
    const { client, log } = this.snakeClient;
    const file = fileId ?? this.fileId;
    const inRange = (x: number, min: number, max: number) => {
      return (x - min) * (x - max) <= 0;
    };
    if (!file) {
      this.snakeClient.log.error('Failed to download audio cause: FileId not found!');
      throw new BotError('FileId not found!', 'Voice.download', String(file));
    }
    if (file !== this.fileId) {
      let dFile = this.decode(file);
      if (dFile.typeId !== 3) {
        this.snakeClient.log.error('Failed to download audio cause: Miss match file type!');
        throw new BotError('Miss match file type!', 'Voice.download', String(file));
      }
      let dParams = Object.assign(
        {
          dcId: dFile.dcId,
          progressCallback: (progress) => {
            return log.debug(`Downloading voice [${Math.round(progress)}]`);
          },
        },
        params ?? {}
      );
      return client.downloadFile(
        new Api.InputDocumentFileLocation({
          id: bigInt(String(dFile.id)),
          accessHash: bigInt(String(dFile.access_hash)),
          fileReference: Buffer.from(dFile.fileReference, 'hex'),
          thumbSize: 'w',
        }),
        // @ts-ignore
        dParams
      );
    }
    let dParams = Object.assign(
      {
        dcId: this.dcId,
        fileSize: bigInt(this.size),
        progressCallback: (progress) => {
          return log.debug(`Downloading voice [${Math.round(progress)}]`);
        },
      },
      params ?? {}
    );
    return client.downloadFile(
      new Api.InputDocumentFileLocation({
        id: bigInt(String(this._id)),
        accessHash: bigInt(String(this._accessHash)),
        fileReference: Buffer.from(this._fileReference, 'hex'),
        thumbSize: 'w',
      }),
      // @ts-ignore
      dParams
    );
  }
}
