import { ReportsService } from './reports.service';

function createQueryChain(result: unknown) {
  const chain: Record<string, jest.Mock> & { then?: Promise<unknown>['then'] } = {
    from: jest.fn(() => chain),
    innerJoin: jest.fn(() => chain),
    leftJoin: jest.fn(() => chain),
    where: jest.fn(() => chain),
    groupBy: jest.fn(() => chain),
    orderBy: jest.fn(() => chain),
    limit: jest.fn(() => Promise.resolve(result)),
  };
  chain.then = Promise.resolve(result).then.bind(Promise.resolve(result));
  return chain;
}

describe('ReportsService getSummary', () => {
  it('keeps gross collections and transaction totals unchanged after reconciliation', async () => {
    const results = [
      [{ method: 'card', total: 200000000 }],
      [{ amount: 6000000 }],
      [{ status: 'claimed', count: 1 }],
      [{ count: 2 }],
      [],
      [
        {
          id: 1,
          number: '10409',
          customerName: 'Stephanie Nablo',
          createdAt: new Date('2026-08-04T12:22:00Z'),
          status: 'claimed',
          total: 200000000,
          paid: 200000000,
          reconciledAmount: 193000000,
          itemCount: 2,
        },
      ],
      [{ total: 7000000 }],
    ];
    const db = {
      select: jest.fn(() => createQueryChain(results.shift() ?? [])),
    };
    const service = new ReportsService({ db } as never);

    const summary = await service.getSummary(2026, 8);

    const collections = summary.collections as Record<string, string>;

    expect(collections.card).toBe('2000.00');
    expect(collections.total).toBe('2000.00');
    expect(summary.expenses.total).toBe('130.00');
    expect(summary.expenses.items).toHaveLength(2);
    expect(summary.expenses.items[1].category).toBe('Card Reconciliation Loss');
    expect(summary.expenses.items[1].amount).toBe('70.00');
    expect(summary.net).toBe('1870.00');
    expect(summary.txnList[0].total).toBe('2000.00');
    expect(summary.txnList[0].paid).toBe('2000.00');
  });

  it('shows an expense row for reconciliation-only periods', async () => {
    const results = [
      [{ method: 'card', total: 200000000 }],
      [],
      [{ status: 'claimed', count: 1 }],
      [{ count: 2 }],
      [],
      [],
      [{ total: 7000000 }],
    ];
    const db = {
      select: jest.fn(() => createQueryChain(results.shift() ?? [])),
    };
    const service = new ReportsService({ db } as never);

    const summary = await service.getSummary(2026, 8);

    expect(summary.expenses.total).toBe('70.00');
    expect(summary.expenses.items).toHaveLength(1);
    expect(summary.expenses.items[0].category).toBe('Card Reconciliation Loss');
    expect(summary.expenses.items[0].amount).toBe('70.00');
  });
});
