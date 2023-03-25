/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { Raw, Helpers } from '@tgsnake/core';
import { TLObject } from '../../TL';
import { Audio } from './Audio';
import { Document } from './Document';
import { Photo } from './Photo';
import { Animation } from './Animated';
import { Video } from './Video';
import type { Snake } from '../../../Client';

// https://github.com/pyrogram/pyrogram/blob/master/pyrogram/types/messages_and_media/web_page.py
export class WebPage extends TLObject {
  id!: bigint;
  url!: string;
  displayUrl!: string;
  type?: string;
  siteName?: string;
  title?: string;
  description?: string;
  audio?: Audio;
  document?: Document;
  photo?: Photo;
  animation?: Animation;
  video?: Video;
  embedUrl?: string;
  embedType?: string;
  embedWidth?: number;
  embedHeight?: number;
  duration?: number;
  author?: string;
  constructor(
    {
      id,
      url,
      displayUrl,
      type,
      siteName,
      title,
      description,
      audio,
      document,
      photo,
      animation,
      video,
      embedUrl,
      embedType,
      embedWidth,
      embedHeight,
      duration,
      author,
    }: {
      id: bigint;
      url: string;
      displayUrl: string;
      type?: string;
      siteName?: string;
      title?: string;
      description?: string;
      audio?: Audio;
      document?: Document;
      photo?: Photo;
      animation?: Animation;
      video?: Video;
      embedUrl?: string;
      embedType?: string;
      embedWidth?: number;
      embedHeight?: number;
      duration?: number;
      author?: string;
    },
    client: Snake
  ) {
    super(client);
    this.classType = 'types';
    this.className = 'webPage';
    this.constructorId = 0xe89c45b2; // Raw.WebPage
    this.subclassOfId = 0x55a97481; // Raw.TypeWebPage
    this.id = id;
    this.url = url;
    this.displayUrl = displayUrl;
    this.type = type;
    this.siteName = siteName;
    this.title = title;
    this.description = description;
    this.audio = audio;
    this.document = document;
    this.photo = photo;
    this.animation = animation;
    this.video = video;
    this.embedUrl = embedUrl;
    this.embedType = embedType;
    this.embedWidth = embedWidth;
    this.embedHeight = embedHeight;
    this.duration = duration;
    this.author = author;
  }
  static parse(client: Snake, webpage: Raw.WebPage) {
    let audio;
    let document;
    let photo;
    let animation;
    let video;
    if (webpage.photo && webpage.photo instanceof Raw.Photo) {
      photo = Photo.parse(client, webpage.photo as Raw.Photo);
    }
    if (webpage.document && webpage.document instanceof Raw.Document) {
      if (
        (webpage.document as Raw.Document).attributes.some(
          (attribute) => attribute instanceof Raw.DocumentAttributeAudio
        )
      ) {
        audio = Audio.parse(client, webpage.document as Raw.Document);
      } else if (
        (webpage.document as Raw.Document).attributes.some(
          (attribute) => attribute instanceof Raw.DocumentAttributeAnimated
        )
      ) {
        animation = Animation.parse(client, webpage.document as Raw.Document);
      } else if (
        (webpage.document as Raw.Document).attributes.some(
          (attribute) => attribute instanceof Raw.DocumentAttributeVideo
        )
      ) {
        video = Video.parse(client, webpage.document as Raw.Document);
      } else {
        document = Document.parse(client, webpage.document as Raw.Document);
      }
    }
    return new WebPage(
      {
        audio,
        document,
        photo,
        animation,
        video,
        id: webpage.id,
        url: webpage.url,
        displayUrl: webpage.displayUrl,
        type: webpage.type,
        siteName: webpage.siteName,
        title: webpage.title,
        description: webpage.description,
        embedUrl: webpage.embedUrl,
        embedType: webpage.embedType,
        embedWidth: webpage.embedWidth,
        embedHeight: webpage.embedHeight,
        duration: webpage.duration,
        author: webpage.author,
      },
      client
    );
  }
}