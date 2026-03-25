'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export const CARD_BANKS_KEY = ['card-banks'] as const;

export function useCardBanksQuery() {
  return useQuery({
    queryKey: CARD_BANKS_KEY,
    queryFn: () => api.cardBanks.list(),
    staleTime: 5 * 60 * 1000, // 5 min — rarely changes
  });
}

export function useCreateCardBankMutation(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; feePercent: number }) => api.cardBanks.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CARD_BANKS_KEY });
      toast.success('Card bank added');
      onSuccess?.();
    },
    onError: (err: Error) => toast.error('Failed to add card bank', { description: err.message }),
  });
}

export function useUpdateCardBankMutation(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: number; name?: string; feePercent?: number }) =>
      api.cardBanks.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CARD_BANKS_KEY });
      toast.success('Card bank updated');
      onSuccess?.();
    },
    onError: (err: Error) => toast.error('Failed to update card bank', { description: err.message }),
  });
}

export function useDeleteCardBankMutation(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.cardBanks.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CARD_BANKS_KEY });
      toast.success('Card bank removed');
      onSuccess?.();
    },
    onError: (err: Error) => toast.error('Failed to remove card bank', { description: err.message }),
  });
}
