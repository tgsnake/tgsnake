// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Snake } from '../../Client';
import * as Medias from './';
import { Api } from 'telegram';
export type TypeMessageMediaDocument =
  | Medias.MediaSticker // done
  | Medias.MediaVoice // done
  | Medias.MediaVideoNote // done
  | Medias.MediaVideo // done
  | Medias.MediaAnimation // done
  | Medias.MediaAudio // done
  | Medias.MediaDocument; // done
export type TypeMessageMedia =
  | Medias.Media
  | Medias.MediaPoll // done
  | TypeMessageMediaDocument
  | Medias.MediaVenue
  | Medias.MediaPhoto // done
  | Medias.MediaLocation // done
  | Medias.MediaDice // done
  | Medias.MediaContact // done
  | Medias.MediaChatPhoto;
export type TypeMessageMediaDownload =
  | TypeMessageMediaDocument
  | Medias.MediaPhoto
  | Medias.MediaChatPhoto;
export async function GenerateMedia(
  media: Api.TypeMessageMedia,
  snakeClient: Snake
): Promise<TypeMessageMedia> {
  snakeClient.log.debug('Creating Media');
  // webpage
  if (media instanceof Api.MessageMediaWebPage) {
    media as Api.MessageMediaWebPage;
    let webpage = new Medias.MediaWebPage();
    await webpage.encode(media.webpage!, snakeClient);
    return webpage as Medias.MediaWebPage;
  }
  // invoice
  if (media instanceof Api.MessageMediaInvoice) {
    media as Api.MessageMediaInvoice;
    let invoice = new Medias.MediaInvoice();
    await invoice.encode(media!, snakeClient);
    return invoice as Medias.MediaInvoice;
  }
  // venue
  if (media instanceof Api.MessageMediaVenue) {
    media as Api.MessageMediaVenue;
    let venue = new Medias.MediaVenue();
    await venue.encode(media!, snakeClient);
    return venue as Medias.MediaVenue;
  }
  // Photo
  if (media instanceof Api.MessageMediaPhoto) {
    media as Api.MessageMediaPhoto;
    let photo = new Medias.MediaPhoto();
    await photo.encode(media!, snakeClient);
    return photo as Medias.MediaPhoto;
  }
  // Location
  if (media instanceof Api.MessageMediaGeo) {
    media as Api.MessageMediaGeo;
    let location = new Medias.MediaLocation();
    await location.encode(media!, snakeClient);
    return location as Medias.MediaLocation;
  }
  // Dice
  if (media instanceof Api.MessageMediaDice) {
    let dice = new Medias.MediaDice();
    await dice.encode(media!, snakeClient);
    return dice as Medias.MediaDice;
  }
  // Contact
  if (media instanceof Api.MessageMediaContact) {
    media as Api.MessageMediaContact;
    let contact = new Medias.MediaContact();
    await contact.encode(media!, snakeClient);
    return contact as Medias.MediaContact;
  }
  // Polling
  if (media instanceof Api.MessageMediaPoll) {
    media as Api.MessageMediaPoll;
    let poll = new Medias.MediaPoll();
    await poll.encode(media, snakeClient);
    return poll as Medias.MediaPoll;
  }
  // Document
  if (media instanceof Api.MessageMediaDocument) {
    if (media.document instanceof Api.Document) {
      let document = media.document as Api.Document;
      let animatedIndex = document.attributes.findIndex((attribute) =>
        Boolean(attribute instanceof Api.DocumentAttributeAnimated)
      );
      for (let attribute of document.attributes) {
        // sticker
        if (attribute instanceof Api.DocumentAttributeSticker) {
          let sticker = new Medias.MediaSticker();
          await sticker.encode(document, snakeClient);
          return sticker as Medias.MediaSticker;
        }
        if (attribute instanceof Api.DocumentAttributeAudio) {
          attribute as Api.DocumentAttributeAudio;
          // voice
          if (attribute.voice) {
            let voice = new Medias.MediaVoice();
            await voice.encode(document, snakeClient);
            return voice as Medias.MediaVoice;
          }
          // audio
          let audio = new Medias.MediaAudio();
          await audio.encode(document, snakeClient);
          return audio as Medias.MediaAudio;
        }
        if (attribute instanceof Api.DocumentAttributeVideo && animatedIndex < 0) {
          attribute as Api.DocumentAttributeVideo;
          // video note
          if (attribute.roundMessage) {
            let videoNote = new Medias.MediaVideoNote();
            await videoNote.encode(document, snakeClient);
            return videoNote as Medias.MediaVideoNote;
          }
          // video
          let video = new Medias.MediaVideo();
          await video.encode(document, snakeClient);
          return video as Medias.MediaVideo;
        }
        // gif
        if (attribute instanceof Api.DocumentAttributeAnimated) {
          let animation = new Medias.MediaAnimation();
          await animation.encode(document, snakeClient);
          return animation as Medias.MediaAnimation;
        }
      }
      // document
      let documents = new Medias.MediaDocument();
      await documents.encode(document, snakeClient);
      return documents as Medias.MediaDocument;
    }
  }
  // Game
  if (media instanceof Api.MessageMediaGame) {
    media as Api.MessageMediaGame;
    let game = new Medias.MediaGame();
    await game.encode(media, snakeClient);
    return game as Medias.MediaGame;
  }
  return new Medias.Media();
}
