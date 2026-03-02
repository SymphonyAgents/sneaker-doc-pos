'use client';

import { useRef } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { PrinterIcon, EnvelopeIcon, ArrowRightIcon } from '@phosphor-icons/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate, formatPeso } from '@/lib/utils';
import { toTitleCase } from '@/utils/text';
import { generateGmailLink, EMAIL_TEMPLATES } from '@/utils/email';
import type { Transaction } from '@/lib/types';

interface ClaimStubDialogProps {
  open: boolean;
  txn: Transaction | null;
  onViewTransaction: () => void;
}

export function ClaimStubDialog({ open, txn, onViewTransaction }: ClaimStubDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!txn) return null;

  const balance = parseFloat(txn.total) - parseFloat(txn.paid);
  const items = txn.items ?? [];

  function handlePrint() {
    const qrDataUrl = (canvasRef.current as HTMLCanvasElement | null)?.toDataURL() ?? '';
    const win = window.open('', '_blank', 'width=400,height=700');
    if (!win) return;

    win.document.write(`<!DOCTYPE html>
<html><head>
  <title>Claim Stub — #${txn!.number}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Courier New', monospace; font-size: 12px; padding: 24px; color: #000; }
    .stub { max-width: 280px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 2px solid #000; }
    .header h1 { font-size: 15px; font-weight: bold; letter-spacing: 2px; }
    .header h2 { font-size: 10px; margin-top: 2px; font-weight: normal; letter-spacing: 1px; }
    .txn-num { font-size: 18px; font-weight: bold; text-align: center; margin: 12px 0; }
    .section { margin: 10px 0; }
    .row { display: flex; justify-content: space-between; margin: 3px 0; }
    .label { color: #555; }
    .divider { border-top: 1px dashed #000; margin: 8px 0; }
    .bold { font-weight: bold; }
    .qr { display: flex; justify-content: center; margin: 14px 0; }
    .footer { text-align: center; font-size: 10px; color: #555; margin-top: 8px; }
  </style>
</head><body>
  <div class="stub">
    <div class="header">
      <h1>SNEAKER DOCTOR</h1>
      <h2>CLAIM STUB</h2>
    </div>
    <div class="txn-num">#${txn!.number}</div>
    <div class="divider"></div>
    <div class="section">
      <div class="row"><span class="label">Customer</span><span>${toTitleCase(txn!.customerName) || '—'}</span></div>
      <div class="row"><span class="label">Phone</span><span>${txn!.customerPhone || '—'}</span></div>
      <div class="row"><span class="label">Pickup Date</span><span>${formatDate(txn!.pickupDate)}</span></div>
    </div>
    <div class="divider"></div>
    <div class="section">
      ${items.map((item, i) => `<div class="row"><span class="label">${i + 1}. ${item.shoeDescription || 'Item'}</span><span>${formatPeso(item.price ?? '0')}</span></div>`).join('')}
    </div>
    <div class="divider"></div>
    <div class="section">
      <div class="row"><span class="label">Total</span><span>${formatPeso(txn!.total)}</span></div>
      <div class="row"><span class="label">Paid</span><span>${formatPeso(txn!.paid)}</span></div>
      <div class="row bold"><span>Balance</span><span>${balance <= 0 ? 'Fully Paid' : formatPeso(balance)}</span></div>
    </div>
    <div class="qr"><img src="${qrDataUrl}" width="120" height="120" /></div>
    <div class="footer">Present this stub when claiming your shoes.</div>
  </div>
  <script>window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); }</script>
</body></html>`);
    win.document.close();
  }

  const gmailLink = txn.customerEmail
    ? generateGmailLink(txn, EMAIL_TEMPLATES.claim_stub)
    : null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-white sm:max-w-sm overflow-y-auto max-h-[90vh]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-base">Claim Stub</DialogTitle>
        </DialogHeader>

        {/* Hidden canvas used only for print (toDataURL) */}
        <QRCodeCanvas
          ref={canvasRef as React.Ref<HTMLCanvasElement>}
          value={txn.number}
          size={160}
          className="hidden absolute"
        />

        {/* Receipt preview */}
        <div className="font-mono text-xs border border-zinc-200 rounded-md p-4 space-y-3 bg-zinc-50">
          <div className="text-center pb-3 border-b border-zinc-300">
            <p className="font-bold text-sm tracking-widest">SNEAKER DOCTOR</p>
            <p className="text-zinc-500 text-[10px] tracking-wider">CLAIM STUB</p>
          </div>

          <p className="text-center text-xl font-bold tracking-wide">#{txn.number}</p>

          <div className="border-t border-dashed border-zinc-300 pt-3 space-y-1">
            <div className="flex justify-between">
              <span className="text-zinc-500">Customer</span>
              <span>{toTitleCase(txn.customerName) || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Phone</span>
              <span>{txn.customerPhone || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Pickup</span>
              <span>{formatDate(txn.pickupDate)}</span>
            </div>
          </div>

          {items.length > 0 && (
            <div className="border-t border-dashed border-zinc-300 pt-3 space-y-1">
              {items.map((item, i) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-zinc-500 truncate max-w-[160px]">{i + 1}. {item.shoeDescription || 'Item'}</span>
                  <span>{formatPeso(item.price ?? '0')}</span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-dashed border-zinc-300 pt-3 space-y-1">
            <div className="flex justify-between">
              <span className="text-zinc-500">Total</span>
              <span>{formatPeso(txn.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Paid</span>
              <span className="text-emerald-700">{formatPeso(txn.paid)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Balance</span>
              <span className={balance > 0 ? 'text-red-600' : 'text-emerald-700'}>
                {balance <= 0 ? 'Fully Paid' : formatPeso(balance)}
              </span>
            </div>
          </div>

          <div className="flex justify-center pt-1">
            <QRCodeSVG value={txn.number} size={96} />
          </div>
          <p className="text-center text-zinc-400 text-[10px]">Present this stub when claiming your shoes.</p>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <div className="flex gap-2">
            <Button variant="dark" size="sm" className="flex-1" onClick={handlePrint}>
              <PrinterIcon size={13} />
              Print
            </Button>
            {gmailLink && (
              <a
                href={gmailLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border border-zinc-200 rounded-md text-zinc-700 hover:bg-zinc-50 transition-colors duration-150"
              >
                <EnvelopeIcon size={13} />
                Email
              </a>
            )}
          </div>
          <Button variant="ghost" size="sm" className="w-full" onClick={onViewTransaction}>
            View Transaction
            <ArrowRightIcon size={13} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
