'use client';

import { useState, useRef } from 'react';
import { PlusIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { RequireAdmin } from '@/components/auth/RequireAdmin';
import {
  useCardBanksQuery,
  useCreateCardBankMutation,
  useUpdateCardBankMutation,
  useDeleteCardBankMutation,
} from '@/hooks/useCardBanksQuery';
import { useCurrentUserQuery } from '@/hooks/useCurrentUserQuery';
import type { CardBank } from '@/lib/types';

const INPUT_CLS =
  'w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500';

interface CardBankForm {
  name: string;
  feePercent: string;
}

const EMPTY_FORM: CardBankForm = { name: '', feePercent: '' };

export default function CardBanksPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CardBank | null>(null);
  const [form, setForm] = useState<CardBankForm>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<CardBank | null>(null);
  const origFormRef = useRef<CardBankForm | null>(null);

  const { data: currentUser } = useCurrentUserQuery();
  const isSuperadmin = currentUser?.userType === 'superadmin';

  const { data: cardBanks = [], isLoading } = useCardBanksQuery();

  const closeDialog = () => setDialogOpen(false);

  const createMut = useCreateCardBankMutation(closeDialog);
  const updateMut = useUpdateCardBankMutation(closeDialog);
  const deleteMut = useDeleteCardBankMutation(() => setDeleteTarget(null));

  const isBusy = createMut.isPending || updateMut.isPending;
  const isUnchanged =
    editTarget !== null &&
    origFormRef.current !== null &&
    JSON.stringify(form) === JSON.stringify(origFormRef.current);

  function openCreate() {
    origFormRef.current = null;
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(b: CardBank) {
    const snap: CardBankForm = { name: b.name, feePercent: b.feePercent };
    origFormRef.current = snap;
    setEditTarget(b);
    setForm(snap);
    setDialogOpen(true);
  }

  function handleSave() {
    const name = form.name.trim();
    const feePercent = parseFloat(form.feePercent);
    if (!name || isNaN(feePercent)) return;

    if (editTarget) {
      updateMut.mutate({ id: editTarget.id, name, feePercent });
    } else {
      createMut.mutate({ name, feePercent });
    }
  }

  return (
    <RequireAdmin>
      <div>
        <PageHeader
          title="Card Banks"
          subtitle="Manage card payment fee rates by bank"
          action={
            isSuperadmin ? (
              <Button onClick={openCreate}>
                <PlusIcon size={14} weight="bold" />
                Add Card Bank
              </Button>
            ) : undefined
          }
        />

        <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50">
                <TableHead className="pl-4">Bank Name</TableHead>
                <TableHead>Fee %</TableHead>
                <TableHead>Fee on ₱1,000</TableHead>
                {isSuperadmin && <TableHead className="w-24 text-right pr-4">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  {[0, 1, 2].map((i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-4"><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      {isSuperadmin && <TableCell />}
                    </TableRow>
                  ))}
                </>
              ) : cardBanks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isSuperadmin ? 4 : 3} className="pl-4 py-10 text-center text-sm text-zinc-400">
                    No card banks configured.
                  </TableCell>
                </TableRow>
              ) : (
                cardBanks.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="pl-4 font-medium text-zinc-900">
                      {b.name}
                      {b.isDefault && (
                        <span className="ml-2 text-[10px] font-mono bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded">
                          default
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-zinc-700">
                      {parseFloat(b.feePercent).toFixed(2)}%
                    </TableCell>
                    <TableCell className="font-mono text-sm text-zinc-500">
                      ₱{(10 * parseFloat(b.feePercent)).toFixed(2)}
                    </TableCell>
                    {isSuperadmin && (
                      <TableCell className="text-right pr-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(b)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded transition-colors"
                          >
                            <PencilSimpleIcon size={15} />
                          </button>
                          {!b.isDefault && (
                            <button
                              onClick={() => setDeleteTarget(b)}
                              className="p-1.5 text-zinc-400 hover:text-red-500 rounded transition-colors"
                            >
                              <TrashIcon size={15} />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open && !isBusy) closeDialog(); }}>
          <DialogContent className="bg-white sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-base">
                {editTarget ? 'Edit Card Bank' : 'Add Card Bank'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-700">Bank Name</label>
                <input
                  autoFocus
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. BPI, BDO, Metrobank"
                  className={INPUT_CLS}
                  disabled={editTarget?.isDefault}
                />
                {editTarget?.isDefault && (
                  <p className="text-[11px] text-zinc-400">Default bank name cannot be changed.</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-700">Fee Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.feePercent}
                  onChange={(e) => setForm((f) => ({ ...f, feePercent: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                  placeholder="e.g. 3.50"
                  className={`${INPUT_CLS} font-mono`}
                />
                {form.feePercent && !isNaN(parseFloat(form.feePercent)) && (
                  <p className="text-[11px] text-zinc-400 font-mono">
                    On a ₱1,000 card payment → ₱{(10 * parseFloat(form.feePercent)).toFixed(2)} fee
                  </p>
                )}
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={isBusy || !form.name.trim() || !form.feePercent || isNaN(parseFloat(form.feePercent)) || isUnchanged}
                  onClick={handleSave}
                >
                  {isBusy ? <Spinner /> : editTarget ? 'Save Changes' : 'Add Bank'}
                </Button>
                <Button size="sm" variant="ghost" disabled={isBusy} onClick={closeDialog}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={!!deleteTarget}
          title="Remove card bank?"
          description={`Remove "${deleteTarget?.name}"? This cannot be undone. Existing transactions that used this bank rate will not be affected.`}
          confirmLabel="Remove"
          onConfirm={() => { if (deleteTarget) deleteMut.mutate(deleteTarget.id); }}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteMut.isPending}
        />
      </div>
    </RequireAdmin>
  );
}
