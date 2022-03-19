// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Snake } from '../../Client';
import bigInt, { BigInteger } from 'big-integer';
import { Cleaning } from '../CleanObject';
import BotError from '../../Context/Error';
import * as Medias from './';

export class MediaGame extends Medias.Media {
  id!: bigint;
  accessHash!: bigint;
  shortName!: string;
  title!: string;
  description!: string;
  photo!: Medias.MediaPhoto;
  document!: Medias.TypeMessageMediaDocument;
  constructor() {
    super();
    this['_'] = 'game';
  }
  async encode(game: Api.MessageMediaGame | Api.Game, snakeClient: Snake) {
    snakeClient.log.debug('Creating MediaGame');
    this.snakeClient = snakeClient;
    const create = async (media: Api.Game) => {
      this.id = BigInt(String(media.id));
      this.accessHash = BigInt(String(media.accessHash));
      this.shortName = media.shortName;
      this.description = media.description;
      this.title = media.title;
      this.photo = new Medias.MediaPhoto();
      await this.photo.encode(media.photo!, snakeClient);
      if (media.document) {
        if (media.document instanceof Api.Document) {
          let document = media.document as Api.Document;
          let animatedIndex = document.attributes.findIndex((attribute) =>
            Boolean(attribute instanceof Api.DocumentAttributeAnimated)
          );
          for (let attribute of document.attributes) {
            // sticker
            if (attribute instanceof Api.DocumentAttributeSticker) {
              this.document = new Medias.MediaSticker();
              await this.document.encode(document, snakeClient);
              return this;
            }
            if (attribute instanceof Api.DocumentAttributeAudio) {
              attribute as Api.DocumentAttributeAudio;
              // voice
              if (attribute.voice) {
                this.document = new Medias.MediaVoice();
                await this.document.encode(document, snakeClient);
                return this;
              }
              // audio
              this.document = new Medias.MediaAudio();
              await this.document.encode(document, snakeClient);
              return this;
            }
            if (attribute instanceof Api.DocumentAttributeVideo && animatedIndex < 0) {
              attribute as Api.DocumentAttributeVideo;
              // video note
              if (attribute.roundMessage) {
                this.document = new Medias.MediaVideoNote();
                await this.document.encode(document, snakeClient);
                return this;
              }
              // video
              this.document = new Medias.MediaVideo();
              await this.document.encode(document, snakeClient);
              return this;
            }
            // gif
            if (attribute instanceof Api.DocumentAttributeAnimated) {
              this.document = new Medias.MediaAnimation();
              await this.document.encode(document, snakeClient);
              return this;
            }
          }
          // document
          this.document = new Medias.MediaDocument();
          await this.document.encode(document, snakeClient);
          return this;
        }
      }
      return this;
    };
    if (game instanceof Api.MessageMediaGame) {
      return create(game.game as Api.Game);
    }
    return create(game as Api.Game);
  }
}
