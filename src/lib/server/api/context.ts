import type { Env } from "hono";

import type { Session, User } from "$lib/shared/types";

export interface Context extends Env {
  Variables: {
    user: User | null;
    session: Session | null;
    accessToken: string;
  };
}
