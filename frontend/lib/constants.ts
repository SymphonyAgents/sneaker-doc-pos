export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  CLAIMED: 'claimed',
  CANCELLED: 'cancelled',
} as const;

export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];

export const ITEM_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  CLAIMED: 'claimed',
  CANCELLED: 'cancelled',
} as const;

export type ItemStatus = typeof ITEM_STATUS[keyof typeof ITEM_STATUS];

export const PAYMENT_METHOD = {
  CASH: 'cash',
  GCASH: 'gcash',
  CARD: 'card',
  BANK_DEPOSIT: 'bank_deposit',
} as const;

export type PaymentMethod = typeof PAYMENT_METHOD[keyof typeof PAYMENT_METHOD];

// ---------------------------------------------------------------------------
// Card bank options — loaded from DB via /card-banks; these are static fallbacks
// only used when the DB data hasn't loaded yet.
// ---------------------------------------------------------------------------
export const CARD_BANK_OPTIONS = [
  { value: '', label: 'Default (3%)' },
  { value: 'bpi', label: 'BPI (3.5%)' },
] as const;

type CardBankRow = { name: string; feePercent: string; isDefault: boolean };

/** Build Select options from live DB data. Falls back to static CARD_BANK_OPTIONS. */
export function buildCardBankOptions(banks: CardBankRow[]): { value: string; label: string }[] {
  if (!banks.length) return [...CARD_BANK_OPTIONS];
  const sorted = [...banks].sort((a) => (a.isDefault ? -1 : 1));
  return sorted.map((b) => ({
    value: b.isDefault ? '' : b.name.toLowerCase(),
    label: `${b.name} (${parseFloat(b.feePercent).toFixed(1)}%)`,
  }));
}

/** Display-only fee rate for preview. Uses DB data when available. */
export function getCardFeeRatePreview(cardBank: string, banks?: CardBankRow[]): number {
  if (banks?.length) {
    const match = cardBank
      ? banks.find((b) => !b.isDefault && b.name.toLowerCase() === cardBank.toLowerCase())
      : banks.find((b) => b.isDefault);
    if (match) return parseFloat(match.feePercent) / 100;
  }
  // static fallback
  if (cardBank === 'bpi') return 0.035;
  return 0.03;
}

export const SERVICE_TYPE = {
  PRIMARY: 'primary',
  ADD_ON: 'add_on',
} as const;

export type ServiceType = typeof SERVICE_TYPE[keyof typeof SERVICE_TYPE];

export const TRANSACTION_STATUS_VALUES = Object.values(TRANSACTION_STATUS);
export const ITEM_STATUS_VALUES = Object.values(ITEM_STATUS);
export const PAYMENT_METHOD_VALUES = Object.values(PAYMENT_METHOD);
