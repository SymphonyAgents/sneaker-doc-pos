'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ReceiptIcon } from '@phosphor-icons/react';
import { formatPeso, today } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ExpenseForm } from '@/components/forms/expense-form';
import { createExpenseColumns, type ExpenseEditForm } from '@/columns/expenses-columns';
import {
  useExpensesQuery,
  useExpensesSummaryQuery,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} from '@/hooks/useExpensesQuery';
import { useCurrentUserQuery } from '@/hooks/useCurrentUserQuery';
import type { Expense } from '@/lib/types';

const EMPTY_EDIT: ExpenseEditForm = { category: '', note: '', method: '', amount: '' };

export default function ExpensesPage() {
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(today());
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ExpenseEditForm>(EMPTY_EDIT);

  useEffect(() => {
    if (searchParams.get('new') === '1') setShowForm(true);
  }, [searchParams]);

  const { data: currentUser } = useCurrentUserQuery();
  const isAdmin = currentUser?.userType === 'admin' || currentUser?.userType === 'superadmin';

  const { data: expenses = [], isLoading } = useExpensesQuery(selectedDate);
  const { data: summary } = useExpensesSummaryQuery(selectedDate);
  const updateMut = useUpdateExpenseMutation(selectedDate, () => {
    setEditId(null);
    setForm(EMPTY_EDIT);
  });
  const deleteMut = useDeleteExpenseMutation(selectedDate);

  const startEdit = (e: Expense) => {
    setEditId(e.id);
    setForm({
      category: e.category ?? '',
      note: e.note ?? '',
      method: e.method ?? '',
      amount: e.amount ?? '',
    });
    setShowForm(false);
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(EMPTY_EDIT);
  };

  const columns = useMemo(
    () => createExpenseColumns({
      onDelete: setDeleteTarget,
      editId: isAdmin ? editId : null,
      form,
      setForm,
      onUpdate: () => updateMut.mutate({
        id: editId!,
        category: form.category || undefined,
        note: form.note || undefined,
        method: form.method || undefined,
        amount: form.amount || undefined,
      }),
      onCancelEdit: cancelEdit,
      onStartEdit: isAdmin ? startEdit : undefined,
      isAdmin,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editId, form, isAdmin],
  );

  return (
    <div>
      <PageHeader
        title="Expenses"
        subtitle="Daily operational expenses"
        action={
          <Button onClick={() => setShowForm((v) => !v)}>
            <ReceiptIcon size={14} weight="bold" />
            Add Expense
          </Button>
        }
      />

      <div className="flex items-center gap-4 mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        {summary && (
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-zinc-400">Daily total:</span>
            <span className="font-mono font-semibold text-zinc-950">{formatPeso(summary.total)}</span>
          </div>
        )}
      </div>

      {showForm && (
        <ExpenseForm
          dateKey={selectedDate}
          onSuccess={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}

      <DataTable
        columns={columns}
        data={expenses as Expense[]}
        isLoading={isLoading}
        loadingRows={3}
        emptyTitle="No expenses"
        emptyDescription="No expenses recorded for this date."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete expense?"
        description="Delete this expense? This cannot be undone."
        onConfirm={() => { if (deleteTarget) deleteMut.mutate(deleteTarget.id); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />
    </div>
  );
}
