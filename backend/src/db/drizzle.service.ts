import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import {
  DATABASE_CONNECT_TIMEOUT_SECONDS,
  DATABASE_IDLE_TIMEOUT_SECONDS,
  DATABASE_MAX_LIFETIME_SECONDS,
  DATABASE_STATEMENT_TIMEOUT_MS,
} from './db.constants';

@Injectable()
export class DrizzleService implements OnModuleInit {
  private _db: PostgresJsDatabase<typeof schema>;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const url = this.config.getOrThrow<string>('DATABASE_URL');
    // prepare: false is REQUIRED for PgBouncer (transaction pooler)
    const client = postgres(url, {
      prepare: false,
      connect_timeout: DATABASE_CONNECT_TIMEOUT_SECONDS,
      idle_timeout: DATABASE_IDLE_TIMEOUT_SECONDS,
      max_lifetime: DATABASE_MAX_LIFETIME_SECONDS,
      connection: {
        statement_timeout: DATABASE_STATEMENT_TIMEOUT_MS,
      },
    });
    this._db = drizzle(client, { schema });
  }

  get db() {
    return this._db;
  }
}
