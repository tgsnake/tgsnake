import { Raw } from '@tgsnake/core';
import { TypeUpdate } from '../TL/Updates';
import type { Message } from '../TL/Messages';

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
    }
  } else {
    if (key === 'any') {
      return true;
    }
    if (key in ctx) {
      return true;
    }
  }
  return false;
}
