import { Injectable } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "../database/schema";
import { createAuth } from "./auth.config";

@Injectable()
export class AuthProvider {
  readonly auth;

  constructor(
    @InjectDrizzle()
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {
    this.auth = createAuth(this.db);
  }
}