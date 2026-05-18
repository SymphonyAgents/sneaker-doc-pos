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
  };
  chain.then = Promise.resolve(result).then.bind(Promise.resolve(result));
  return chain;
}

describe('TransactionsService collectionsSummary', () => {
  it('does not double-deduct linked system card processing fee expenses from card collections', async () => {
    const paymentRows = [{ method: 'card', total: 120000000, totalFee: 3600000 }];
    const depositRows: unknown[] = [];
    const staffRows = [{ id: 'staff-1' }];
    const expenseRowsWithOnlyDeductibleExpenses = [{ method: 'card', total: 0 }];

    const chains: ReturnType<typeof createQueryChain>[] = [];
    const db = {
      select: jest.fn(() => {
        const callIndex = chains.length;
        const result = [paymentRows, depositRows, staffRows, expenseRowsWithOnlyDeductibleExpenses][callIndex];
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
    expect(chains[3].where).toHaveBeenCalledTimes(1);
    expect(containsCardFeeExclusion(chains[3].where.mock.calls[0][0])).toBe(true);
  });
});
