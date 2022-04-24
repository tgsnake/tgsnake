// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../Client';
import bigInt from 'big-integer';
import BotError from '../../Context/Error';
import { toJSON } from '../../Utils/CleanObject';

export interface ShippingOptions {
  id: string;
  title: string;
  prices: Array<{ amount: bigint; label: string }>;
}
export async function AnswerShippingQuery(
  snakeClient: Snake,
  id: bigint,
  options?: Array<ShippingOptions>,
  error?: string
) {
  try {
    return await snakeClient.client.invoke(
      new Api.messages.SetBotShippingResults({
        queryId: bigInt(String(id)),
        error: error,
        shippingOptions: options
          ? options.map(
              (option) =>
                new Api.ShippingOption({
                  id: option.id,
                  title: option.title,
                  prices: option.prices.map(
                    (price) =>
                      new Api.LabeledPrice({
                        amount: bigInt(String(price.amount)),
                        label: price.label,
                      })
                  ),
                })
            )
          : undefined,
      })
    );
  } catch (error: any) {
    snakeClient.log.error('Failed running telegram.answerShippingQuery');
    throw new BotError(
      error.message,
      'telegram.answerShippingQuery',
      `${id}${options ? `,${JSON.stringify(toJSON(options))}` : ''}${error ? `,${error}` : ''}`
    );
  }
}
