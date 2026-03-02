'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { api, ApiError } from '@/lib/api';

interface QrScanDialogProps {
  open: boolean;
  onClose: () => void;
}

export function QrScanDialog({ open, onClose }: QrScanDialogProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setValue('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const number = value.trim();
    if (!number) return;

    setLoading(true);
    setError('');
    try {
      const txn = await api.transactions.getByNumber(number);
      onClose();
      router.push(`/transactions/${txn.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError(`Transaction "${number}" not found.`);
      } else {
        setError('Failed to look up transaction. Try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !loading) onClose(); }}>
      <DialogContent className="bg-white sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Scan QR Code</DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Scan the claim stub QR code or enter the transaction number manually.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(''); }}
            placeholder="e.g. TXN-2024-001"
            className="w-full px-3 py-3 text-base font-mono text-center bg-white border border-zinc-200 rounded-md text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            autoComplete="off"
            spellCheck={false}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button
            type="submit"
            variant="dark"
            size="sm"
            className="w-full"
            disabled={!value.trim() || loading}
          >
            {loading ? <Spinner /> : 'Find Transaction'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
