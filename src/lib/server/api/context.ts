import type { Env } from "hono";

import type { Session, User } from "$lib/types";

export interface Context extends Env {
  Variables: {
    user: User | null;
    session: Session | null;
  };
}
