/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { TLObject } from '../TL';
import { Raw } from '@tgsnake/core';
import type { Snake } from '../../Client';

export class WebAppData extends TLObject {
  data!: string;
  buttonText!: string;
  constructor(
    {
      data,
      buttonText,
    }: {
      data: string;
      buttonText: string;
    },
    client: Snake
  ) {
    super(client);
    this.classType = 'types';
    this.className = 'webAppData';
    this.constructorId = 0x47dd8079; // Raw.MessageActionWebViewDataSentMe
    this.subclassOfId = 0x8680d126; // Raw.TypeMessageAction
    this.data = data;
    this.buttonText = buttonText;
  }
  static parse(client: Snake, webApp: Raw.MessageActionWebViewDataSentMe) {
    return new WebAppData(
      {
        data: webApp.data,
        buttonText: webApp.text,
      },
      client
    );
  }
}
