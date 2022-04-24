// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { inlineKeyboardButton, replyKeyboardButton } from '../Utils';
import * as Medias from '../Utils/Medias';
export interface ClickButton {
  /**
   * Row button position.
   * Row index start with zero.
   * [
   *  row 0 : [ col 0 , col 1],
   *  row 1 : [ col 0 , col 1]
   * ]
   */
  row?: number;
  /**
   * column button position.
   * column index start with zero.
   * [
   *  row 0 : [ col 0 , col 1],
   *  row 1 : [ col 0 , col 1]
   * ]
   */
  col?: number;
  /**
   * find one the button when text of button is matches
   */
  text?: string | { (text: string, row: number, col: number): boolean | Promise<boolean> };
  /**
   * Make a filter to get the row,col of button. it must be returned a boolean.
   */
  filter?: {
    (keyboard: replyKeyboardButton | inlineKeyboardButton, row: number, col: number):
      | boolean
      | Promise<boolean>;
  };
  /**
   * find one the button when callbackData of button is matches
   */
  callbackData?: string;
  /**
   * Phone will be send when button clicked
   */
  sharePhone?: boolean | string | Medias.MediaContact;
  /**
   * Location will be send when button clicked
   */
  shareGeo?: { latitude: number; longitude: number } | Medias.MediaLocation;
  /**
   * Fill your 2fa password when button clicked.
   */
  password?: string;
}
