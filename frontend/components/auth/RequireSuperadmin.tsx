'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUserQuery } from '@/hooks/useCurrentUserQuery';

interface RequireSuperadminProps {
  children: React.ReactNode;
}

export function RequireSuperadmin({ children }: RequireSuperadminProps) {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUserQuery();

  useEffect(() => {
    if (!isLoading && user && user.userType !== 'superadmin') {
      router.replace('/transactions');
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (!user || user.userType !== 'superadmin') return null;

  return <>{children}</>;
}
