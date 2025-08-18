import { KV_WISHLIST } from "$lib/shared/utils/kv-keys";

import { kvWishlist } from "../libs/upstash/kv";

export class WishlistEmailNotFoundError extends Error {
  constructor(email: string) {
    super(`Email '${email}' not found in wishlist`);
    this.name = "WishlistEmailNotFoundError";
  }
}

export const wishlistService = {
  async addEmail(email: string): Promise<boolean> {
    const result = await kvWishlist.sadd(KV_WISHLIST, email);
    return result === 1;
  },

  async getAllEmails(): Promise<string[]> {
    return kvWishlist.smembers(KV_WISHLIST);
  },

  async emailExists(email: string): Promise<boolean> {
    const exists = await kvWishlist.sismember(KV_WISHLIST, email);
    return exists === 1;
  },

  async removeEmail(email: string): Promise<void> {
    const removed = await kvWishlist.srem(KV_WISHLIST, email);
    if (removed === 0) {
      throw new WishlistEmailNotFoundError(email);
    }
  }
};
