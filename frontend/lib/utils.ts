import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toTitleCase } from '@/utils/text';
import { STATUS_LABELS, STATUS_COLORS, PAYMENT_METHOD_LABELS } from '@/lib/constants';

// Re-export for backwards compatibility — consumers should migrate to @/lib/constants
export { STATUS_LABELS, STATUS_COLORS, PAYMENT_METHOD_LABELS };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPeso(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '₱0.00';
  return `₱${num.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value.includes('T') ? value : value + 'T00:00:00');
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatAddress(parts: {
  streetName?: string | null;
  barangay?: string | null;
  city?: string | null;
  province?: string | null;
}): string {
  const { streetName, barangay, city, province } = parts;
  const localPart = [toTitleCase(streetName), toTitleCase(barangay)].filter(Boolean).join(' ');
  return [localPart, toTitleCase(city), toTitleCase(province)].filter(Boolean).join(', ') || '—';
}

export function formatDatetime(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  return d.toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function today(): string {
  return new Date().toISOString().split('T')[0];
}

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export function statusColor(status: string): string {
  return STATUS_COLORS[status] ?? 'text-zinc-500 bg-zinc-100';
}
