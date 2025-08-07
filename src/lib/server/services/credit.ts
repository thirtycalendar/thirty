import type { Credit, CreditForm } from "$lib/shared/types";

import { db } from "../db";
import { creditTable } from "../db/tables/credit";
import { createDbService } from "../utils/create-db-service";

export const creditService = createDbService<Credit, CreditForm>(db, {
  table: creditTable
});
