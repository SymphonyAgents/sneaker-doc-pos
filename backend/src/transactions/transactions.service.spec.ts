import { TransactionsService } from './transactions.service';

function containsCardFeeExclusion(value: unknown, seen = new WeakSet<object>()): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.includes('Card Processing Fee');
  if (typeof value !== 'object') return false;
  if (seen.has(value)) return false;

  seen.add(value);
  const record = value as Record<string, unknown>;
  return Object.values(record).some((child) => containsCardFeeExclusion(child, seen));
}

function createQueryChain(result: unknown) {
  const chain: Record<string, jest.Mock> & { then?: Promise<unknown>['then'] } = {
    from: jest.fn(() => chain),
    innerJoin: jest.fn(() => chain),
    where: jest.fn(() => chain),
    groupBy: jest.fn(() => Promise.resolve(result)),
    orderBy: jest.fn(() => Promise.resolve(result)),
  };
  chain.then = Promise.resolve(result).then.bind(Promise.resolve(result));
  return chain;
}

describe('TransactionsService collection reporting', () => {
  it('does not double-deduct linked system card processing fee expenses from card collections', async () => {
    const paymentRows = [{ method: 'card', total: 120000000, totalFee: 3600000 }];
    const reconciliationLossRows = [{ total: 0 }];
    const depositRows: unknown[] = [];
    const staffRows = [{ id: 'staff-1' }];
    const expenseRowsWithOnlyDeductibleExpenses = [{ method: 'card', total: 0 }];

    const chains: ReturnType<typeof createQueryChain>[] = [];
    const db = {
      select: jest.fn(() => {
        const callIndex = chains.length;
        const result = [
          paymentRows,
          reconciliationLossRows,
          depositRows,
          staffRows,
          expenseRowsWithOnlyDeductibleExpenses,
        ][callIndex];
        const chain = createQueryChain(result);
        chains.push(chain);
        return chain;
      }),
    };

    const service = new TransactionsService(
      { db } as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );

    const summary = await service.collectionsSummary(2026, 5, 1);

    expect(summary.card).toBe('1164.00');
    expect(summary.cardFee).toBe('36.00');
    expect(chains[4].where).toHaveBeenCalledTimes(1);
    expect(containsCardFeeExclusion(chains[4].where.mock.calls[0][0])).toBe(true);
  });

  it('deducts reconciliation loss from card collections once', async () => {
    const paymentRows = [{ method: 'card', total: 200000000, totalFee: 6000000 }];
    const reconciliationLossRows = [{ total: 7000000 }];
    const depositRows: unknown[] = [];
    const expenseRows: unknown[] = [];

    const chains: ReturnType<typeof createQueryChain>[] = [];
    const db = {
      select: jest.fn(() => {
        const callIndex = chains.length;
        const result = [paymentRows, reconciliationLossRows, depositRows, expenseRows][callIndex];
        const chain = createQueryChain(result);
        chains.push(chain);
        return chain;
      }),
    };

    const service = new TransactionsService(
      { db } as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );

    const summary = await service.collectionsSummary(2026, 8);

    expect(summary.card).toBe('1870.00');
    expect(summary.cardFee).toBe('60.00');
  });

  it('keeps dashboard gross revenue unchanged and counts reconciliation loss as expense', async () => {
    const results = [
      [{ totalRevenue: 10347900000, totalPaid: 4347000000, count: 96 }],
      [],
      [{ total: 6000879000 }],
      [],
      [{ totalRevenue: 0, totalPaid: 0 }],
      [{ count: 0 }],
      [{ count: 173 }],
      [{ count: 0 }],
    ];
    const db = {
      select: jest.fn(() => createQueryChain(results.shift() ?? [])),
    };
    const service = new TransactionsService(
      { db } as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );
    jest.spyOn(service, 'collectionsSummary').mockResolvedValue({
      cash: '0.00',
      gcash: '0.00',
      card: '0.00',
      cardFee: '0.00',
      bank_deposit: '0.00',
    });
    jest.spyOn(service as never, 'getCardReconciliationLoss').mockResolvedValue(7000000 as never);

    const summary = await service.dashboardSummary(2026, 8);

    expect(summary.monthly.totalRevenue).toBe('103479.00');
    expect(summary.monthly.totalExpenses).toBe('60078.79');
    expect(summary.monthly.netIncome).toBe('43400.21');
  });

  it('returns reconciliation loss as its own card history column', async () => {
    const rows = [
      {
        id: 1,
        transactionId: 10,
        method: 'card',
        amount: 200000000,
        originalAmount: 200000000,
        fee: 6000000,
        feePercent: '3.00',
        reconciliationLoss: 7000000,
        paidAt: new Date('2026-08-04T12:22:00Z'),
        txnNumber: '10409',
        customerName: 'Stephanie Nablo',
      },
    ];
    const db = { select: jest.fn(() => createQueryChain(rows)) };
    const service = new TransactionsService(
      { db } as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );

    const history = await service.collectionsHistory(2026, 8, 'card');

    expect(history[0].amount).toBe('2000.00');
    expect(history[0].fee).toBe('60.00');
    expect(history[0].reconciliationLoss).toBe('70.00');
    expect(history[0].net).toBe('1870.00');
  });
});
