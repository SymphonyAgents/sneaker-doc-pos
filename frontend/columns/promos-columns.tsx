'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { TrashIcon, PencilSimpleIcon, CheckIcon, XIcon } from '@phosphor-icons/react';
import { formatDate } from '@/lib/utils';
import { toTitleCase } from '@/utils/text';
import { Switch } from '@/components/ui/switch';
import type { Promo } from '@/lib/types';

export interface PromoEditForm {
  name: string;
  code: string;
  percent: string;
  dateFrom: string;
  dateTo: string;
}

interface PromoColumnsOptions {
  onDelete: (promo: Promo) => void;
  onToggle: (id: number, isActive: boolean) => void;
  editId?: number | null;
  form?: PromoEditForm;
  setForm?: (updater: (f: PromoEditForm) => PromoEditForm) => void;
  onUpdate?: () => void;
  onCancelEdit?: () => void;
  onStartEdit?: (p: Promo) => void;
}

const isPromoActive = (p: Promo): boolean => {
  if (!p.isActive) return false;
  const today = new Date().toISOString().split('T')[0];
  if (p.dateFrom && p.dateFrom > today) return false;
  if (p.dateTo && p.dateTo < today) return false;
  return true;
};

export const createPromoColumns = ({
  onDelete,
  onToggle,
  editId,
  form,
  setForm,
  onUpdate,
  onCancelEdit,
  onStartEdit,
}: PromoColumnsOptions): ColumnDef<Promo>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const p = row.original;
      if (editId === p.id && form && setForm) {
        return (
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full px-2 py-1 text-sm border border-zinc-200 rounded focus:outline-none focus:border-blue-500"
          />
        );
      }
      return <span className="font-medium text-zinc-950">{toTitleCase(p.name)}</span>;
    },
  },
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => {
      const p = row.original;
      if (editId === p.id && form && setForm) {
        return (
          <input
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
            className="w-full px-2 py-1 text-sm border border-zinc-200 rounded font-mono uppercase focus:outline-none focus:border-blue-500"
          />
        );
      }
      return (
        <span className="font-mono text-sm bg-zinc-100 px-2 py-0.5 rounded text-zinc-700">
          {p.code}
        </span>
      );
    },
  },
  {
    accessorKey: 'percent',
    header: 'Discount',
    cell: ({ row }) => {
      const p = row.original;
      if (editId === p.id && form && setForm) {
        return (
          <input
            type="number"
            min="1"
            max="100"
            step="0.5"
            value={form.percent}
            onChange={(e) => setForm((f) => ({ ...f, percent: e.target.value }))}
            className="w-20 px-2 py-1 text-sm border border-zinc-200 rounded font-mono focus:outline-none focus:border-blue-500"
          />
        );
      }
      return <span className="font-mono text-zinc-700">{parseFloat(p.percent).toFixed(0)}%</span>;
    },
  },
  {
    accessorKey: 'dateFrom',
    header: 'Valid Period',
    cell: ({ row }) => {
      const p = row.original;
      if (editId === p.id && form && setForm) {
        return (
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={form.dateFrom}
              onChange={(e) => setForm((f) => ({ ...f, dateFrom: e.target.value }))}
              className="px-2 py-1 text-sm border border-zinc-200 rounded focus:outline-none focus:border-blue-500"
            />
            <span className="text-xs text-zinc-400">—</span>
            <input
              type="date"
              value={form.dateTo}
              onChange={(e) => setForm((f) => ({ ...f, dateTo: e.target.value }))}
              className="px-2 py-1 text-sm border border-zinc-200 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        );
      }
      return (
        <span className="text-zinc-500 text-xs">
          {p.dateFrom || p.dateTo
            ? `${formatDate(p.dateFrom)} — ${formatDate(p.dateTo)}`
            : 'No expiry'}
        </span>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const active = isPromoActive(row.original);
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${active ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}>
          {active ? 'Active' : 'Inactive'}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const p = row.original;
      if (editId === p.id) {
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
      return (
        <div className="flex items-center justify-end gap-3">
          <Switch
            checked={p.isActive}
            onCheckedChange={(checked) => { onToggle(p.id, checked); }}
            onClick={(e) => e.stopPropagation()}
          />
          {onStartEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onStartEdit(p); }}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded transition-all"
            >
              <PencilSimpleIcon size={13} />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(p); }}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
          >
            <TrashIcon size={14} />
          </button>
        </div>
      );
    },
  },
];
