'use client';

import { useMemo } from 'react';
import { LockSimpleIcon } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { createUserColumns } from '@/columns/users-columns';
import { useUsersQuery, useUpdateUserRoleMutation } from '@/hooks/useUsersQuery';
import { useCurrentUserQuery } from '@/hooks/useCurrentUserQuery';
import { useBranchesQuery } from '@/hooks/useBranchesQuery';
import { toTitleCase } from '@/utils/text';
import type { AppUser } from '@/lib/types';

export default function UsersPage() {
  const { data: currentUser, isSuccess: userLoaded } = useCurrentUserQuery();
  const isAdmin = currentUser?.userType === 'admin' || currentUser?.userType === 'superadmin';

  const { data: users = [], isLoading } = useUsersQuery();
  const { data: branches = [] } = useBranchesQuery(false);
  const updateRoleMut = useUpdateUserRoleMutation();

  const columns = useMemo(
    () => createUserColumns({
      onRoleChange: (id, userType) => {
        updateRoleMut.mutate(
          { id, userType },
          { onSuccess: () => toast.success('Role updated') },
        );
      },
      currentUserId: currentUser?.id,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser?.id],
  );

  const grouped = useMemo(() => {
    const allUsers = users as AppUser[];
    const branchMap = new Map(branches.map((b) => [b.id, b.name]));

    const groups = new Map<string, { label: string; users: AppUser[] }>();

    for (const user of allUsers) {
      const key = user.branchId !== null ? String(user.branchId) : '__none__';
      if (!groups.has(key)) {
        const label = user.branchId !== null
          ? toTitleCase(branchMap.get(user.branchId) ?? `Branch #${user.branchId}`)
          : 'No Branch';
        groups.set(key, { label, users: [] });
      }
      groups.get(key)!.users.push(user);
    }

    // Sort: named branches first (alphabetically), unassigned last
    return [...groups.entries()]
      .sort(([a], [b]) => {
        if (a === '__none__') return 1;
        if (b === '__none__') return -1;
        return (groups.get(a)!.label).localeCompare(groups.get(b)!.label);
      })
      .map(([, group]) => group);
  }, [users, branches]);

  if (userLoaded && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
          <LockSimpleIcon size={20} className="text-zinc-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-950">Access restricted</p>
          <p className="text-xs text-zinc-400 mt-0.5">User management is only available to admins.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage team roles and access"
      />
      {isLoading ? (
        <DataTable
          columns={columns}
          data={[]}
          isLoading
          loadingRows={4}
          emptyTitle="No users found"
          emptyDescription="Users appear here once they sign in."
        />
      ) : grouped.length === 0 ? (
        <p className="text-sm text-zinc-400">No users found.</p>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
                {group.label}
                <span className="ml-2 font-normal normal-case tracking-normal text-zinc-300">
                  {group.users.length} {group.users.length === 1 ? 'user' : 'users'}
                </span>
              </p>
              <DataTable
                columns={columns}
                data={group.users}
                isLoading={false}
                emptyTitle="No users"
                emptyDescription=""
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
