// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
export function Cleaning(_object: any) {
  for (let [key, value] of Object.entries(_object)) {
    if (value == null || value == undefined) {
      delete _object[key];
    }
  }
  return _object;
}
export function betterConsoleLog(object: { [key: string]: any }) {
  const toPrint: { [key: string]: any } = {};
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      if (!key.startsWith('_')) {
        toPrint[key] = object[key];
      } else if (key == '_') {
        toPrint[key] = object[key];
      }
    }
  }
  return toPrint;
}
export function toJSON(json: any) {
  let obj = betterConsoleLog(json);
  for (let [key, value] of Object.entries(obj)) {
    if (typeof value == 'bigint') obj[key] = String(value);
    if (typeof value == 'object' && !Array.isArray(value)) obj[key] = toJSON(value);
    if (typeof value == 'object' && Array.isArray(value)) obj[key] = value.map((x) => toJSON(x));
  }
  return obj;
}
