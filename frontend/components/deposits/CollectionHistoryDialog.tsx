'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { formatPeso, formatDatetime } from '@/lib/utils';
import { useCollectionsHistoryQuery } from '@/hooks/useTransactionsQuery';

interface CollectionHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  year: number;
  month: number;
  monthLabel: string;
  method: string;
  methodLabel: string;
  branchId?: number;
}

export function CollectionHistoryDialog({
  open,
  onClose,
  year,
  month,
  monthLabel,
  method,
  methodLabel,
  branchId,
}: CollectionHistoryDialogProps) {
  const { data = [], isLoading } = useCollectionsHistoryQuery(year, month, method, { branchId, enabled: open });

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="bg-white sm:max-w-2xl flex flex-col max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-base">{methodLabel} Collection History</DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">{monthLabel}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          ) : data.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-12">No {methodLabel} collections recorded.</p>
          ) : (() => {
            const isCard = method === 'card';
            const totalGross = data.reduce((s, e) => s + parseFloat(e.amount), 0);
            const totalFee = isCard ? data.reduce((s, e) => s + parseFloat(e.fee ?? '0'), 0) : 0;
            const totalNet = isCard ? data.reduce((s, e) => s + parseFloat(e.net ?? e.amount), 0) : totalGross;
            return (
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-zinc-100">
                    <th className="py-2.5 text-left font-medium text-zinc-400">Txn #</th>
                    <th className="py-2.5 text-left font-medium text-zinc-400">Customer</th>
                    <th className="py-2.5 text-right font-medium text-zinc-400">{isCard ? 'Gross' : 'Amount'}</th>
                    {isCard && <th className="py-2.5 text-right font-medium text-zinc-400">Fee</th>}
                    {isCard && <th className="py-2.5 text-right font-medium text-zinc-400">Net</th>}
                    <th className="py-2.5 text-right font-medium text-zinc-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {data.map((entry) => (
                    <tr key={entry.id} className="hover:bg-zinc-50/50 transition-colors duration-100">
                      <td className="py-2.5 font-mono text-zinc-700">#{entry.txnNumber}</td>
                      <td className="py-2.5 text-zinc-700 max-w-[140px] truncate">
                        {entry.customerName ?? '—'}
                      </td>
                      <td className="py-2.5 text-right font-mono text-zinc-950">
                        {formatPeso(entry.amount)}
                      </td>
                      {isCard && (
                        <td className="py-2.5 text-right font-mono text-red-500">
                          -{formatPeso(entry.fee ?? '0')}
                        </td>
                      )}
                      {isCard && (
                        <td className="py-2.5 text-right font-mono text-emerald-600 font-medium">
                          {formatPeso(entry.net ?? entry.amount)}
                        </td>
                      )}
                      <td className="py-2.5 text-right text-zinc-400 whitespace-nowrap pl-4">
                        {formatDatetime(entry.paidAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-zinc-200">
                  <tr className="bg-zinc-50">
                    <td colSpan={2} className="py-2.5 text-xs font-semibold text-zinc-500">Total</td>
                    <td className="py-2.5 text-right font-mono font-semibold text-zinc-950">{formatPeso(String(totalGross))}</td>
                    {isCard && <td className="py-2.5 text-right font-mono font-semibold text-red-500">-{formatPeso(String(totalFee))}</td>}
                    {isCard && <td className="py-2.5 text-right font-mono font-semibold text-emerald-600">{formatPeso(String(totalNet))}</td>}
                    <td />
                  </tr>
                </tfoot>
              </table>
            );
          })()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
