'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { formatDatetime, formatPeso } from '@/lib/utils';
import {
  ITEM_STATUS,
  PAYMENT_METHOD_LABELS,
  STATUS_LABELS,
  AUDIT_TYPE_LABELS,
  AUDIT_TYPE_STYLES,
  ENTITY_LABELS,
  SOURCE_LABELS,
} from '@/lib/constants';
import type { AuditEntry } from '@/lib/types';

function getEventLabel(entry: AuditEntry): string {
  if (entry.auditType && AUDIT_TYPE_LABELS[entry.auditType]) {
    return AUDIT_TYPE_LABELS[entry.auditType];
  }
  return entry.action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function getEventStyle(entry: AuditEntry): string {
  if (entry.auditType && AUDIT_TYPE_STYLES[entry.auditType]) {
    return AUDIT_TYPE_STYLES[entry.auditType];
  }
  return 'bg-zinc-100 text-zinc-600';
}

export const auditColumns: ColumnDef<AuditEntry>[] = [
  {
    accessorKey: 'createdAt',
    header: 'When',
    cell: ({ row }) => (
      <span className="font-mono text-xs text-zinc-400 whitespace-nowrap">
        {formatDatetime(row.original.createdAt)}
      </span>
    ),
  },
  {
    accessorKey: 'auditType',
    header: 'Event',
    cell: ({ row }) => {
      const entry = row.original;
      const isDeposit = entry.entityType === 'deposit';
      const details = entry.details as { method?: string; added?: string; to?: string; refundedAmount?: string } | null;
      const depositMethod = isDeposit && details?.method ? (PAYMENT_METHOD_LABELS[details.method] ?? details.method) : null;
      const depositAdded = isDeposit && details?.added ? formatPeso(details.added) : null;
      const isItemStatusChanged = entry.auditType === 'ITEM_STATUS_CHANGED' && details?.to;
      const toStatusLabel = isItemStatusChanged ? (STATUS_LABELS[details!.to!] ?? details!.to) : null;
      const isCancelledWithRefund = isItemStatusChanged && details?.to === ITEM_STATUS.CANCELLED && details?.refundedAmount;
      const isTxnCancelledWithRefund = entry.auditType === 'TRANSACTION_CANCELLED' && details?.refundedAmount;
      return (
        <div className="flex flex-col items-start gap-0.5">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${getEventStyle(entry)}`}
          >
            {isDeposit ? 'Recorded deposit' : getEventLabel(entry)}
          </span>
          {isDeposit && depositMethod && depositAdded && (
            <span className="text-[10px] text-zinc-400 pl-0.5">{depositMethod} +{depositAdded}</span>
          )}
          {isItemStatusChanged && toStatusLabel && (
            <span className={`text-[10px] pl-0.5 ${details?.to === ITEM_STATUS.CANCELLED ? 'text-red-400' : 'text-zinc-400'}`}>
              {toStatusLabel}{isCancelledWithRefund ? ` · Refunded ${formatPeso(details!.refundedAmount!)}` : ''}
            </span>
          )}
          {isTxnCancelledWithRefund && (
            <span className="text-[10px] text-red-400 pl-0.5">Refunded {formatPeso(details!.refundedAmount!)}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'entityType',
    header: 'On',
    cell: ({ row }) => {
      const { entityType, entityId } = row.original;
      const label = ENTITY_LABELS[entityType] ?? entityType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      return (
        <div>
          <span className="text-sm text-zinc-700">{label}</span>
          {entityId && (
            <span className="block font-mono text-xs text-zinc-400">#{entityId}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'performedByEmail',
    header: 'By',
    cell: ({ row }) => {
      const email = row.original.performedByEmail;
      const fullName = row.original.performedByFullName;
      if (!email) {
        return <span className="text-xs text-zinc-400">System</span>;
      }
      const [user, domain] = email.split('@');
      return (
        <div>
          <span className="text-sm text-zinc-700">{fullName ? fullName : user}</span>
          <span className="block text-xs text-zinc-400">@{domain ?? '—'}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'source',
    header: 'Via',
    cell: ({ row }) => {
      const raw = row.original.source?.toLowerCase() ?? '';
      const label = SOURCE_LABELS[raw] ?? (raw || '—');
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-500">
          {label}
        </span>
      );
    },
  },
];
