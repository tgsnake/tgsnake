/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { Raw, Helpers } from '@tgsnake/core';
import { TLObject } from '../../TL';
import type { Snake } from '../../../Client';
import { PhotoSize } from './PhotoSize';
import { FileId, FileType, ThumbnailSource, FileTypeUniqueId } from '@tgsnake/fileid';

export class Photo extends TLObject {
  fileId!: string;
  fileUniqueId!: string;
  thumb!: Array<PhotoSize>;
  date!: Date;
  dcId!: number;
  size!: bigint;
  width!: number;
  height!: number;
  hasStickers?: boolean;
  constructor(
    {
      fileId,
      fileUniqueId,
      thumb,
      date,
      dcId,
      size,
      width,
      height,
      hasStickers,
    }: {
      fileId: string;
      fileUniqueId: string;
      thumb: Array<PhotoSize>;
      date: Date;
      dcId: number;
      size: bigint;
      width: number;
      height: number;
      hasStickers?: boolean;
    },
    client: Snake
  ) {
    super(client);
    this.classType = 'types';
    this.className = 'photo';
    this.constructorId = 0xfb197a65; // Raw.Photo
    this.subclassOfId = 0xd576ab1c; // Raw.TypePhoto
    this.fileId = fileId;
    this.fileUniqueId = fileUniqueId;
    this.thumb = thumb;
    this.date = date;
    this.dcId = dcId;
    this.size = size;
    this.width = width;
    this.height = height;
    this.hasStickers = hasStickers;
  }
  static parse(client: Snake, photo: Raw.Photo) {
    let thumb: Array<PhotoSize> = [];
    let collect: Array<{ type: string; w: number; h: number; size: bigint }> = [];
    if (photo.sizes) {
      for (const psize of photo.sizes) {
        if (psize instanceof Raw.PhotoSize) {
          thumb.push(
            PhotoSize.parse(
              client,
              psize as Raw.PhotoSize,
              photo.id,
              photo.accessHash,
              photo.fileReference,
              photo.dcId
            )
          );
        }
        if (psize instanceof Raw.PhotoSizeProgressive) {
          psize as Raw.PhotoSizeProgressive;
          collect.push({
            type: psize.type,
            w: psize.w,
            h: psize.h,
            size: BigInt(Math.max(...psize.sizes)),
          });
        }
      }
    }
    const psort = collect.sort((a, b) => {
      if (a.size > b.size) return 1;
      if (a.size < b.size) return -1;
      return 0;
    });
    const main = psort[psort.length - 1];
    const file = FileId.encode({
      version: 4,
      subVersion: 32,
      fileType: FileType.PHOTO,
      thumbnailSource: ThumbnailSource.THUMBNAIL,
      thumbnailFileType: FileType.PHOTO,
      thumbnailSize: main?.type ?? 'y',
      fileTypeUniqueId: FileTypeUniqueId.DOCUMENT,
      volumeId: BigInt(0),
      localId: 0,
      dcId: photo.dcId,
      id: photo.id,
      accessHash: photo.accessHash,
      fileReference: photo.fileReference,
    });
    return new Photo(
      {
        fileId: file.fileId,
        fileUniqueId: file.fileUniqueId,
        thumb: thumb,
        date: new Date(photo.date * 1000),
        dcId: photo.dcId,
        size: main?.size ?? BigInt(0),
        width: main?.w ?? 0,
        height: main?.h ?? 0,
        hasStickers: photo.hasStickers,
      },
      client
    );
  }
}
