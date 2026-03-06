'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useCustomersQuery() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: () => api.customers.list(),
  });
}

export function useCustomerByPhoneQuery(phone: string) {
  return useQuery({
    queryKey: ['customer-by-phone', phone],
    queryFn: () => api.customers.findByPhone(phone),
    enabled: phone.length === 11,
    retry: false,
  });
}
