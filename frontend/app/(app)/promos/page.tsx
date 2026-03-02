'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlusIcon } from '@phosphor-icons/react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PromoForm } from '@/components/forms/promo-form';
import { createPromoColumns, type PromoEditForm } from '@/columns/promos-columns';
import { usePromosQuery, useUpdatePromoMutation, useDeletePromoMutation } from '@/hooks/usePromosQuery';
import type { Promo } from '@/lib/types';

const EMPTY_EDIT: PromoEditForm = { name: '', code: '', percent: '', dateFrom: '', dateTo: '' };

export default function PromosPage() {
  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Promo | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<PromoEditForm>(EMPTY_EDIT);

  useEffect(() => {
    if (searchParams.get('new') === '1') setShowForm(true);
  }, [searchParams]);

  const { data: promos = [], isLoading } = usePromosQuery();
  const updateMut = useUpdatePromoMutation(() => {
    setEditId(null);
    setForm(EMPTY_EDIT);
  });
  const deleteMut = useDeletePromoMutation();

  const startEdit = (p: Promo) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      code: p.code,
      percent: p.percent,
      dateFrom: p.dateFrom ?? '',
      dateTo: p.dateTo ?? '',
    });
    setShowForm(false);
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(EMPTY_EDIT);
  };

  const columns = useMemo(
    () => createPromoColumns({
      onDelete: setDeleteTarget,
      onToggle: (id, isActive) => updateMut.mutate({ id, isActive }),
      editId,
      form,
      setForm,
      onUpdate: () => updateMut.mutate({
        id: editId!,
        name: form.name,
        code: form.code,
        percent: form.percent,
        dateFrom: form.dateFrom || undefined,
        dateTo: form.dateTo || undefined,
      }),
      onCancelEdit: cancelEdit,
      onStartEdit: startEdit,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editId, form],
  );

  return (
    <div>
      <PageHeader
        title="Promos"
        subtitle="Promotional codes and discounts"
        action={
          <Button onClick={() => setShowForm((v) => !v)}>
            <PlusIcon size={14} weight="bold" />
            Add Promo
          </Button>
        }
      />

      {showForm && (
        <PromoForm
          onSuccess={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}

      <DataTable
        columns={columns}
        data={promos as Promo[]}
        isLoading={isLoading}
        loadingRows={3}
        emptyTitle="No promos yet"
        emptyDescription="Create your first promo code."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Deactivate promo?"
        description={`Deactivate promo "${deleteTarget?.code}"? This cannot be undone.`}
        confirmLabel="Deactivate"
        onConfirm={() => { if (deleteTarget) deleteMut.mutate(deleteTarget.id); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />
    </div>
  );
}
