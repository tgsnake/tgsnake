// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Media } from './Media';
import { Snake } from '../../Client';
import { Cleaning } from '../CleanObject';

export class MediaLocation extends Media {
  latitude!: number;
  longitude!: number;
  accessHash!: bigint;
  accuracyRadius!: number;
  constructor() {
    super();
    this['_'] = 'location';
  }
  async encode(location: Api.MessageMediaGeo | Api.TypeGeoPoint, snakeClient: Snake) {
    snakeClient.log.debug('Creating MediaLocation');
    this.snakeClient = snakeClient;
    const generate = async (geo: Api.GeoPoint) => {
      this.latitude = geo.lat;
      this.longitude = geo.long;
      this.accessHash = BigInt(String(geo.accessHash ?? 0));
      this.accuracyRadius = geo.accuracyRadius ?? 0;
      await Cleaning(this);
      return this;
    };
    if (location instanceof Api.MessageMediaGeo) {
      location as Api.MessageMediaGeo;
      if (location.geo instanceof Api.GeoPoint) {
        location.geo as Api.GeoPoint;
        return generate(location.geo!);
      }
    }
    if (location instanceof Api.GeoPoint) {
      location as Api.GeoPoint;
      return generate(location!);
    }
    return this;
  }
}
