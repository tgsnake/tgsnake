// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../Client';
import { SendMedia, defaultSendMediaMoreParams } from './SendMedia';
import * as Medias from '../../Utils/Medias';
import bigInt from 'big-integer';
import BotError from '../../Context/Error';
import { toJSON } from '../../Utils/CleanObject';

export interface InvoicePricesLabel {
  amount: bigint;
  label: string;
}
export interface sendInvoiceParams {
  description: string;
  currency: string;
  payload: string;
  provider: string;
  title: string;
  prices: Array<InvoicePricesLabel>;
  providerData?: any | string;
  test?: boolean;
  startParam?: string;
  photoUrl?: string;
  photoSize?: number;
  photoMimeType?: string;
  photoHight?: number;
  photoWidth?: number;
  nameRequested?: boolean;
  phoneRequested?: boolean;
  emailRequested?: boolean;
  shippingAddressRequested?: boolean;
  flexible?: boolean;
  phoneToProvider?: boolean;
  emailToProvider?: boolean;
  maxTipAmount?: bigint;
  suggestedTipAmounts?: Array<bigint>;
}
/**
 * Sending invoice (payment).
 * @param snakeClient {Object} - Client.
 * @param chatId {String|Number|BigInt} - target chat.
 * @param invoice {Object} - Invoice will be sending.
 * @param more {Object} - More parameter will be using to sending invoice.
 * ```ts
 * bot.command("invoice",(ctx)=>{
 *   return ctx.telegram.sendInvoice(ctx.chat.id,{
 *      test : true,
 *      currency : "usd",
 *      payload : "some payload here.",
 *      provider : "",
 *      title : "testing",
 *      description : "just testing lol. xD",
 *      prices : [{
 *          amount : 1000n,
 *          label : "1"
 *      }]
 *   })
 * })
 * ```
 */
export async function SendInvoice(
  snakeClient: Snake,
  chatId: number | string | bigint,
  invoice: sendInvoiceParams,
  more?: defaultSendMediaMoreParams
) {
  try {
    return SendMedia(
      snakeClient,
      chatId,
      new Api.InputMediaInvoice({
        title: invoice.title,
        description: invoice.description,
        invoice: new Api.Invoice({
          test: invoice.test,
          currency: invoice.currency,
          prices: invoice.prices.map(
            (price) =>
              new Api.LabeledPrice({ amount: bigInt(String(price.amount)), label: price.label })
          ),
          nameRequested: invoice.nameRequested,
          phoneRequested: invoice.phoneRequested,
          emailRequested: invoice.emailRequested,
          shippingAddressRequested: invoice.shippingAddressRequested,
          flexible: invoice.flexible,
          phoneToProvider: invoice.phoneToProvider,
          emailToProvider: invoice.emailToProvider,
          maxTipAmount:
            invoice.maxTipAmount !== undefined ? bigInt(String(invoice.maxTipAmount)) : undefined,
          suggestedTipAmounts:
            invoice.suggestedTipAmounts !== undefined
              ? invoice.suggestedTipAmounts.map((x) => bigInt(String(x)))
              : undefined,
        }),
        payload: Buffer.from(invoice.payload),
        provider: invoice.provider,
        providerData: new Api.DataJSON({
          data: invoice.providerData
            ? typeof invoice.providerData === 'string'
              ? invoice.providerData
              : JSON.stringify(invoice.providerData)
            : JSON.stringify({}),
        }),
        startParam: invoice.startParam,
        ...(invoice.photoUrl
          ? {
              photo: new Api.InputWebDocument({
                url: invoice.photoUrl,
                size: invoice.photoSize ?? 0,
                mimeType: invoice.photoMimeType ?? 'image/png',
                attributes:
                  invoice.photoWidth !== undefined || invoice.photoHight !== undefined
                    ? [
                        new Api.DocumentAttributeImageSize({
                          w: invoice.photoWidth ?? 0,
                          h: invoice.photoHight ?? 0,
                        }),
                      ]
                    : [],
              }),
            }
          : {}),
      }),
      more
    );
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.sendInvoice');
    throw new BotError(
      error.message,
      'telegram.sendInvoice',
      `${chatId},${JSON.stringify(toJSON(invoice))}${
        more ? ',' + JSON.stringify(toJSON(more)) : ''
      }`
    );
  }
}
