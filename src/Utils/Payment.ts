// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';

export class PaymentRequestedInfo {
  name?: string;
  phone?: string;
  email?: string;
  shippingAddress?: PostAddress;
  constructor(paymentRequest: Api.PaymentRequestedInfo) {
    if (paymentRequest.name) this.name = paymentRequest.name;
    if (paymentRequest.phone) this.phone = paymentRequest.phone;
    if (paymentRequest.email) this.email = paymentRequest.email;
    if (paymentRequest.shippingAddress)
      this.shippingAddress = new PostAddress(paymentRequest.shippingAddress);
  }
}
export class PostAddress {
  streetLine1!: string;
  streetLine2!: string;
  city!: string;
  state!: string;
  countryIso2!: string;
  postCode!: string;
  constructor(postAddress: Api.PostAddress) {
    this.streetLine1 = postAddress.streetLine1;
    this.streetLine2 = postAddress.streetLine2;
    this.city = postAddress.city;
    this.state = postAddress.state;
    this.countryIso2 = postAddress.countryIso2;
    this.postCode = postAddress.postCode;
    return this;
  }
}
export class PaymentCharge {
  id!: string;
  providerChargeId!: string;
  constructor(paymentCharge: Api.PaymentCharge) {
    this.id = paymentCharge.id;
    this.providerChargeId = paymentCharge.providerChargeId;
    return this;
  }
}
