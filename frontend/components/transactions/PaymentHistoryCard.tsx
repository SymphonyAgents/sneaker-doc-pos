'use client';

import { useState } from 'react';
import { formatPeso, formatDatetime, PAYMENT_METHOD_LABELS } from '@/lib/utils';
import { toTitleCase } from '@/utils/text';
import { useTransactionAuditQuery } from '@/hooks/useAuditQuery';
import type { Transaction } from '@/lib/types';

interface PaymentHistoryCardProps {
  txn: Transaction;
}

export function PaymentHistoryCard({ txn }: PaymentHistoryCardProps) {
  const [activeTab, setActiveTab] = useState<'sms' | 'payment'>('sms');
  const { data: smsLogs = [], isLoading: smsLoading } = useTransactionAuditQuery(txn.number, 'SMS_SENT');

  const hasPayments = txn.payments && txn.payments.length > 0;
  const hasSmsLogs = smsLogs.length > 0;

  // Don't render the card at all if there's nothing to show and no SMS logs
  if (!hasPayments && !smsLoading && !hasSmsLogs) return null;

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-3">
        <button
          type="button"
          onClick={() => setActiveTab('sms')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-150 ${
            activeTab === 'sms'
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100'
          }`}
        >
          SMS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('payment')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-150 ${
            activeTab === 'payment'
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100'
          }`}
        >
          Payment
        </button>
      </div>

      {/* SMS Tab */}
      {activeTab === 'sms' && (
        <div className="space-y-2">
          {smsLoading ? (
            <div className="space-y-2">
              {[0, 1].map((i) => (
                <div key={i} className="h-8 bg-zinc-100 rounded animate-pulse" />
              ))}
            </div>
          ) : smsLogs.length === 0 ? (
            <p className="text-xs text-zinc-400">No SMS sent for this transaction.</p>
          ) : (
            smsLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-700">
                    SMS Sent
                  </p>
                  <p className="text-xs text-zinc-400">
                    {formatDatetime(log.createdAt)}
                    {(log.performedByNickname || log.performedByFullName) && (
                      <span className="ml-1.5">
                        by {toTitleCase(log.performedByNickname ?? log.performedByFullName ?? '')}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Payment Tab */}
      {activeTab === 'payment' && (
        <div className="space-y-2">
          {!hasPayments ? (
            <p className="text-xs text-zinc-400">No payments recorded yet.</p>
          ) : (
            txn.payments!.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-700">
                    {p.method === 'card'
                      ? `Card${p.cardBank ? ` · ${p.cardBank.toUpperCase()}` : ''}`
                      : (PAYMENT_METHOD_LABELS[p.method] ?? p.method)}
                    {p.referenceNumber && (
                      <span className="ml-1.5 font-mono font-normal text-zinc-400">#{p.referenceNumber}</span>
                    )}
                  </p>
                  {p.method === 'card' && Number(p.fee) > 0 && (
                    <p className="text-xs text-violet-500 font-mono">
                      fee {p.feePercent}% · -{formatPeso(p.fee)}
                    </p>
                  )}
                  <p className="text-xs text-zinc-400">{formatDatetime(p.paidAt)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-sm text-zinc-950">{formatPeso(p.amount)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
