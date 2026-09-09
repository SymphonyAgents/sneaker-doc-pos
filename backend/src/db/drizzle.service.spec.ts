import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { DrizzleService } from './drizzle.service';

jest.mock('postgres', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

jest.mock('drizzle-orm/postgres-js', () => ({
  drizzle: jest.fn(() => ({})),
}));

describe('DrizzleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('bounds pooled database connections and statement execution time', () => {
    const config = {
      getOrThrow: jest.fn().mockReturnValue('postgresql://localhost/test'),
    } as unknown as ConfigService;

    const service = new DrizzleService(config);
    service.onModuleInit();

    expect(postgres).toHaveBeenCalledWith('postgresql://localhost/test', {
      prepare: false,
      connect_timeout: 10,
      idle_timeout: 20,
      max_lifetime: 300,
      connection: {
        statement_timeout: 15_000,
      },
    });
    expect(drizzle).toHaveBeenCalledWith(expect.anything(), {
      schema: expect.any(Object),
    });
  });
});
