import type { AuthClient, DbClient } from "$lib/shared/types";

// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
    interface Locals {
      db: DbClient,
      auth: AuthClient
    }
	}
}

export {};
