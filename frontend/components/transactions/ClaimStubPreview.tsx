'use client';

import { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDate, formatPeso } from '@/lib/utils';
import { toTitleCase } from '@/utils/text';
import type { Transaction } from '@/lib/types';

interface ClaimStubPreviewProps {
  txn: Transaction;
}

export const ClaimStubPreview = forwardRef<HTMLDivElement, ClaimStubPreviewProps>(
  function ClaimStubPreview({ txn }, ref) {
    const balance = parseFloat(txn.total) - parseFloat(txn.paid);
    const items = txn.items ?? [];
    const logoUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/sneaker-doc-logo.png`
      : '/sneaker-doc-logo.png';

    const branchAddressLine = [txn.branchBarangay, txn.branchCity, txn.branchProvince]
      .filter(Boolean)
      .join(', ');

    return (
      <div
        ref={ref}
        className="font-mono text-[11px] bg-white w-[280px] border border-zinc-200 rounded-md overflow-hidden"
      >
        {/* Header: Logo + Name + Claim Stub */}
        <div className="text-center py-4 px-4 border-b border-zinc-200">
          <img
            src={logoUrl}
            alt="Sneaker Doctor"
            width={48}
            height={48}
            className="mx-auto mb-2 object-contain"
            style={{ display: 'block', margin: '0 auto 8px' }}
          />
          <p className="font-bold text-sm tracking-widest">SNEAKER DOCTOR</p>
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase mt-0.5">Claim Stub</p>
        </div>

        {/* Branch address */}
        {(txn.branchStreetName || txn.branchCity) && (
          <div className="text-center px-4 py-2 border-b border-dashed border-zinc-200 text-[10px] text-zinc-500 leading-relaxed">
            {txn.branchStreetName && <p>{txn.branchStreetName}</p>}
            {branchAddressLine && <p>{branchAddressLine}</p>}
            {txn.branchPhone && <p>{txn.branchPhone}</p>}
          </div>
        )}

        {/* QR Code — under address */}
        <div className="flex flex-col items-center py-3 border-b border-dashed border-zinc-200">
          <QRCodeSVG value={txn.number} size={80} level="M" />
          <p className="text-[10px] text-zinc-400 mt-1.5 font-mono tracking-wider">#{txn.number}</p>
        </div>

        {/* Customer info */}
        <div className="px-4 py-3 border-b border-dashed border-zinc-200 space-y-1">
          <div className="flex justify-between gap-2">
            <span className="text-zinc-400">Customer</span>
            <span className="text-right">{toTitleCase(txn.customerName) || '—'}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-zinc-400">Phone</span>
            <span>{txn.customerPhone || '—'}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-zinc-400">Pickup</span>
            <span>{formatDate(txn.newPickupDate ?? txn.pickupDate)}</span>
          </div>
        </div>

        {/* Items */}
        {items.length > 0 && (
          <div className="px-4 py-3 border-b border-dashed border-zinc-200 space-y-1.5">
            {items.map((item) => {
              const cancelled = item.status === 'cancelled';
              return (
                <div key={item.id} className="flex justify-between gap-2">
                  <span className={cancelled ? 'text-zinc-300 line-through truncate' : 'text-zinc-500 truncate'}>
                    • {item.shoeDescription || 'Item'}
                  </span>
                  <span className={`shrink-0 ${cancelled ? 'text-zinc-300 line-through' : ''}`}>
                    {formatPeso(item.price ?? '0')}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Totals */}
        <div className="px-4 py-3 border-b border-dashed border-zinc-200 space-y-1">
          <div className="flex justify-between gap-2">
            <span className="text-zinc-400">Total</span>
            <span>{formatPeso(txn.total)}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-zinc-400">Paid</span>
            <span className="text-emerald-700">{formatPeso(txn.paid)}</span>
          </div>
          <div className="flex justify-between gap-2 font-semibold">
            <span>Balance</span>
            <span className={balance > 0 ? 'text-red-600' : 'text-emerald-700'}>
              {balance <= 0 ? 'Fully Paid' : formatPeso(balance)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-400 text-[10px] py-3 px-4">
          Present this stub when claiming your shoes.
        </p>
      </div>
    );
  },
);
