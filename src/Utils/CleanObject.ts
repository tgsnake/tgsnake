// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
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
