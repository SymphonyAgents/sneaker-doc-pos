// ---------------------------------------------------------------------------
// Enums & Enum Types
// ---------------------------------------------------------------------------

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

export const SERVICE_TYPE = {
  PRIMARY: 'primary',
  ADD_ON: 'add_on',
} as const;

export type ServiceType = typeof SERVICE_TYPE[keyof typeof SERVICE_TYPE];

export const TRANSACTION_STATUS_VALUES = Object.values(TRANSACTION_STATUS);
export const ITEM_STATUS_VALUES = Object.values(ITEM_STATUS);
export const PAYMENT_METHOD_VALUES = Object.values(PAYMENT_METHOD);

// ---------------------------------------------------------------------------
// Shared Label / Display Maps
// ---------------------------------------------------------------------------

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  done: 'Done',
  claimed: 'Claimed',
  cancelled: 'Cancelled',
};

export const STATUS_COLORS: Record<string, string> = {
  pending: 'text-zinc-600 bg-zinc-100',
  in_progress: 'text-blue-600 bg-blue-100',
  done: 'text-emerald-700 bg-emerald-100',
  claimed: 'text-violet-700 bg-violet-100',
  cancelled: 'text-red-500 bg-red-100',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Cash',
  gcash: 'GCash',
  card: 'Card',
  bank_deposit: 'Bank Deposit',
};

export const PAYMENT_METHODS_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'gcash', label: 'GCash' },
  { value: 'card', label: 'Card' },
  { value: 'bank_deposit', label: 'Bank Deposit' },
] as const;

export const METHOD_ORDER = ['gcash', 'bank_deposit', 'cash', 'card'] as const;

export const METHOD_STYLES: Record<string, string> = {
  cash: 'bg-emerald-50 text-emerald-700',
  gcash: 'bg-blue-50 text-blue-700',
  card: 'bg-violet-50 text-violet-700',
  bank_deposit: 'bg-amber-50 text-amber-700',
};

// ---------------------------------------------------------------------------
// Role UI
// ---------------------------------------------------------------------------

export const ROLES = ['staff', 'admin', 'superadmin'] as const;

export const ROLE_STYLES: Record<string, string> = {
  staff: 'bg-zinc-100 text-zinc-600',
  admin: 'bg-blue-50 text-blue-600',
  superadmin: 'bg-violet-50 text-violet-700',
};

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------

export const AUDIT_TYPE_LABELS: Record<string, string> = {
  TRANSACTION_CREATED: 'Transaction Created',
  TRANSACTION_UPDATED: 'Transaction Updated',
  TRANSACTION_RESTORED: 'Transaction Restored',
  PICKUP_RESCHEDULED: 'Pickup Rescheduled',
  TRANSACTION_STATUS_CHANGED: 'Status Changed',
  TRANSACTION_CLAIMED: 'Transaction Claimed',
  TRANSACTION_CANCELLED: 'Transaction Cancelled',
  ITEM_STATUS_CHANGED: 'Item Status Changed',
  PAYMENT_ADDED: 'Payment Added',
  EXPENSE_CREATED: 'Expense Logged',
  SERVICE_UPDATED: 'Service Updated',
  SMS_SENT: 'SMS Sent',
};

export const AUDIT_TYPE_STYLES: Record<string, string> = {
  TRANSACTION_CREATED: 'bg-emerald-50 text-emerald-700',
  EXPENSE_CREATED: 'bg-emerald-50 text-emerald-700',
  PAYMENT_ADDED: 'bg-violet-50 text-violet-700',
  PICKUP_RESCHEDULED: 'bg-amber-50 text-amber-700',
  TRANSACTION_CANCELLED: 'bg-red-50 text-red-700',
  TRANSACTION_CLAIMED: 'bg-blue-50 text-blue-700',
  TRANSACTION_STATUS_CHANGED: 'bg-blue-50 text-blue-700',
  ITEM_STATUS_CHANGED: 'bg-blue-50 text-blue-700',
  TRANSACTION_UPDATED: 'bg-zinc-100 text-zinc-600',
  TRANSACTION_RESTORED: 'bg-emerald-50 text-emerald-700',
  SERVICE_UPDATED: 'bg-zinc-100 text-zinc-600',
  SMS_SENT: 'bg-sky-50 text-sky-700',
};

export const ENTITY_LABELS: Record<string, string> = {
  transaction: 'Transaction',
  transaction_item: 'Item',
  service: 'Service',
  promo: 'Promo',
  expense: 'Expense',
};

export const SOURCE_LABELS: Record<string, string> = {
  pos: 'POS',
  admin: 'Admin',
};

// ---------------------------------------------------------------------------
// Calendar / Date
// ---------------------------------------------------------------------------

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ---------------------------------------------------------------------------
// Deposit Filters
// ---------------------------------------------------------------------------

export type PaymentFilter = 'all' | 'cash' | 'gcash' | 'card';

export const DEPOSIT_FILTERS: { label: string; value: PaymentFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Cash', value: 'cash' },
  { label: 'GCash', value: 'gcash' },
  { label: 'Card', value: 'card' },
];

// ---------------------------------------------------------------------------
// Staff Detail Page
// ---------------------------------------------------------------------------

export type StaffSection = 'profile' | 'documents';

export const STAFF_SECTIONS: { id: StaffSection; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'documents', label: 'Documents' },
];

// ---------------------------------------------------------------------------
// Auth / Navigation
// ---------------------------------------------------------------------------

export const STAFF_ALLOWED_PATHS = ['/expenses'];

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
  if (cardBank === 'bpi') return 0.035;
  return 0.03;
}
