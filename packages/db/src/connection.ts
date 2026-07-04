import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";

// Wrapping the actual call in a named function (rather than typing the
// module-level variable via `ReturnType<typeof drizzle<typeof schema>>`)
// pins the generic to the exact overload used at runtime — calling
// `drizzle<typeof schema>` with no arguments lets TS pick a different,
// incompatible overload (Pool vs AnyMySql2Connection on `$client`).
function createDb(databaseUrl: string) {
  return drizzle(databaseUrl, { mode: "planetscale", schema });
}

export type Database = ReturnType<typeof createDb>;

let instance: Database | undefined;

export function getDb(databaseUrl: string): Database {
  if (!instance) {
    instance = createDb(databaseUrl);
  }
  return instance;
}
