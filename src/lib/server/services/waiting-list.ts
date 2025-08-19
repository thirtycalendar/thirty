import { KV_WAITING_LIST } from "$lib/shared/utils/kv-keys";

import { kvWaitingList } from "../libs/upstash/kv";

export class WaitingListEmailNotFoundError extends Error {
  constructor(email: string) {
    super(`Email '${email}' not found in wishlist`);
    this.name = "WaitingListEmailNotFoundError";
  }
}

export const waitingListServices = {
  async getCount(): Promise<number> {
    return kvWaitingList.scard(KV_WAITING_LIST);
  },

  async addEmail(email: string): Promise<boolean> {
    const result = await kvWaitingList.sadd(KV_WAITING_LIST, email);
    return result === 1;
  },

  async getAllEmails(): Promise<string[]> {
    return kvWaitingList.smembers(KV_WAITING_LIST);
  },

  async emailExists(email: string): Promise<boolean> {
    const exists = await kvWaitingList.sismember(KV_WAITING_LIST, email);
    return exists === 1;
  },

  async removeEmail(email: string): Promise<void> {
    const removed = await kvWaitingList.srem(KV_WAITING_LIST, email);
    if (removed === 0) {
      throw new WaitingListEmailNotFoundError(email);
    }
  }
};
