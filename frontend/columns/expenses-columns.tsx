'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { TrashIcon, ReceiptIcon, PencilSimpleIcon, CheckIcon, XIcon } from '@phosphor-icons/react';
import { formatPeso, PAYMENT_METHOD_LABELS } from '@/lib/utils';
import { toTitleCase } from '@/utils/text';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Expense } from '@/lib/types';

const METHOD_STYLES: Record<string, string> = {
  cash: 'bg-emerald-50 text-emerald-700',
  gcash: 'bg-blue-50 text-blue-700',
  card: 'bg-violet-50 text-violet-700',
  bank_deposit: 'bg-amber-50 text-amber-700',
};

const PAYMENT_METHODS = ['cash', 'gcash', 'card', 'bank_deposit'] as const;

export interface ExpenseEditForm {
  category: string;
  note: string;
  method: string;
  amount: string;
}

interface ExpenseColumnsOptions {
  onDelete: (expense: Expense) => void;
  editId?: number | null;
  form?: ExpenseEditForm;
  setForm?: (updater: (f: ExpenseEditForm) => ExpenseEditForm) => void;
  onUpdate?: () => void;
  onCancelEdit?: () => void;
  onStartEdit?: (e: Expense) => void;
  isAdmin?: boolean;
}

export const createExpenseColumns = ({
  onDelete,
  editId,
  form,
  setForm,
  onUpdate,
  onCancelEdit,
  onStartEdit,
  isAdmin,
}: ExpenseColumnsOptions): ColumnDef<Expense>[] => [
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const e = row.original;
      if (editId === e.id && form && setForm) {
        return (
          <input
            value={form.category}
            onChange={(ev) => setForm((f) => ({ ...f, category: ev.target.value }))}
            placeholder="Category"
            className="w-full px-2 py-1 text-sm border border-zinc-200 rounded focus:outline-none focus:border-blue-500"
          />
        );
      }
      return (
        <div className="flex items-center gap-2">
          <ReceiptIcon size={13} className="text-zinc-400 shrink-0" />
          <span className="font-medium text-zinc-950">{toTitleCase(e.category) || '—'}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'note',
    header: 'Note',
    cell: ({ row }) => {
      const e = row.original;
      if (editId === e.id && form && setForm) {
        return (
          <input
            value={form.note}
            onChange={(ev) => setForm((f) => ({ ...f, note: ev.target.value }))}
            placeholder="Note"
            className="w-full px-2 py-1 text-sm border border-zinc-200 rounded focus:outline-none focus:border-blue-500"
          />
        );
      }
      return <span className="text-zinc-500">{toTitleCase(e.note) || '—'}</span>;
    },
  },
  {
    accessorKey: 'method',
    header: 'Method',
    cell: ({ row }) => {
      const e = row.original;
      if (editId === e.id && form && setForm) {
        return (
          <Select value={form.method} onValueChange={(v) => setForm((f) => ({ ...f, method: v }))}>
            <SelectTrigger className="h-8 text-sm w-36 border-zinc-200">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((m) => (
                <SelectItem key={m} value={m}>{PAYMENT_METHOD_LABELS[m] ?? m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      const m = e.method;
      if (!m) return <span className="text-xs text-zinc-400">—</span>;
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${METHOD_STYLES[m] ?? 'bg-zinc-100 text-zinc-500'}`}>
          {PAYMENT_METHOD_LABELS[m] ?? m}
        </span>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: () => <span className="block text-right">Amount</span>,
    cell: ({ row }) => {
      const e = row.original;
      if (editId === e.id && form && setForm) {
        return (
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(ev) => setForm((f) => ({ ...f, amount: ev.target.value }))}
            className="w-24 px-2 py-1 text-sm border border-zinc-200 rounded font-mono text-right focus:outline-none focus:border-blue-500"
          />
        );
      }
      return <span className="block text-right font-mono text-zinc-950">{formatPeso(e.amount)}</span>;
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const e = row.original;
      if (editId === e.id) {
        return (
          <div className="flex items-center justify-end gap-1">
            <button onClick={onUpdate} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
              <CheckIcon size={14} weight="bold" />
            </button>
            <button onClick={onCancelEdit} className="p-1.5 text-zinc-400 hover:bg-zinc-100 rounded transition-colors">
              <XIcon size={14} />
            </button>
          </div>
        );
      }
      if (!isAdmin) return null;
      return (
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onStartEdit && (
            <button
              onClick={(ev) => { ev.stopPropagation(); onStartEdit(e); }}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded transition-colors"
            >
              <PencilSimpleIcon size={13} />
            </button>
          )}
          <button
            onClick={(ev) => { ev.stopPropagation(); onDelete(e); }}
            className="p-1.5 text-zinc-400 hover:text-red-500 rounded transition-all"
          >
            <TrashIcon size={14} />
          </button>
        </div>
      );
    },
  },
];
