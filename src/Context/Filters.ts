import { Raw } from '@tgsnake/core';
import { TypeUpdate } from '../TL/Updates';
import type { Message } from '../TL/Messages';

export type TypeUpdateExtended<T, P extends keyof T> = TypeUpdate & {
  message?: FilterQuery<T, P>;
  channelPost?: FilterQuery<T, P>;
};
export interface FilterContext {
  any: TypeUpdate;
  message?: FilterQuery<TypeUpdate, 'message'>;
  editedMessage?: FilterQuery<TypeUpdate, 'editedMessage'>;
  channelPost?: FilterQuery<TypeUpdate, 'channelPost'>;
  editedChannelPost?: FilterQuery<TypeUpdate, 'editedChannelPost'>;
  inlineQuery?: FilterQuery<TypeUpdate, 'inlineQuery'>;
  chosenInlineResult?: FilterQuery<TypeUpdate, 'chosenInlineResult'>;
  callbackQuery?: FilterQuery<TypeUpdate, 'callbackQuery'>;
  shippingQuery?: FilterQuery<TypeUpdate, 'shippingQuery'>;
  preCheckoutQuery?: FilterQuery<TypeUpdate, 'preCheckoutQuery'>;
  poll?: FilterQuery<TypeUpdate, 'poll'>;
  pollAnswer?: FilterQuery<TypeUpdate, 'pollAnswer'>;
  chatJoinRequest?: FilterQuery<TypeUpdate, 'chatJoinRequest'>;
  /* shorthand */
  'message.text'?: FilterQuery<TypeUpdateExtended<Message, 'text'>, 'message'>;
  'message.caption'?: FilterQuery<TypeUpdateExtended<Message, 'caption'>, 'message'>;
  'message.chat'?: FilterQuery<TypeUpdateExtended<Message, 'chat'>, 'message'>;
  'message.from'?: FilterQuery<TypeUpdateExtended<Message, 'from'>, 'message'>;
  'message.animation'?: FilterQuery<TypeUpdateExtended<Message, 'animation'>, 'message'>;
  'message.audio'?: FilterQuery<TypeUpdateExtended<Message, 'audio'>, 'message'>;
  'message.document'?: FilterQuery<TypeUpdateExtended<Message, 'document'>, 'message'>;
  'message.photo'?: FilterQuery<TypeUpdateExtended<Message, 'photo'>, 'message'>;
  'message.sticker'?: FilterQuery<TypeUpdateExtended<Message, 'sticker'>, 'message'>;
  'message.video'?: FilterQuery<TypeUpdateExtended<Message, 'video'>, 'message'>;
  'message.videoNote'?: FilterQuery<TypeUpdateExtended<Message, 'videoNote'>, 'message'>;
  'message.voice'?: FilterQuery<TypeUpdateExtended<Message, 'voice'>, 'message'>;
  'message.webpage'?: FilterQuery<TypeUpdateExtended<Message, 'webpage'>, 'message'>;
  'message.replyToMessage'?: FilterQuery<TypeUpdateExtended<Message, 'replyToMessage'>, 'message'>;
  'message.replyToMessageId'?: FilterQuery<
    TypeUpdateExtended<Message, 'replyToMessageId'>,
    'message'
  >;
  'message.replyToTopMessageId'?: FilterQuery<
    TypeUpdateExtended<Message, 'replyToTopMessageId'>,
    'message'
  >;
}
export type FilterQuery<T, P extends keyof T> = T & {
  [K in P]-?: T[K];
};
export function filter(key: string | string[], ctx: TypeUpdate) {
  if (Array.isArray(key)) {
    for (const k of key) {
      if (k === 'any') {
        return true;
      }
      if (k in ctx) {
        return true;
      }
      let sk = k.split('.');
      if (sk.length) {
        return ctx[sk[0]][sk[1]] !== undefined;
      }
    }
  } else {
    if (key === 'any') {
      return true;
    }
    if (key in ctx) {
      return true;
    }
    let sk = key.split('.');
    if (sk.length) {
      return ctx[sk[0]][sk[1]] !== undefined;
    }
  }
  return false;
}
