'use client';

import { useState } from 'react';
import { PlusIcon, PencilSimpleIcon, CheckIcon, XIcon } from '@phosphor-icons/react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import {
  useBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
} from '@/hooks/useBranchesQuery';
import type { Branch } from '@/lib/types';

export default function BranchesPage() {
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const { data: branches = [], isLoading } = useBranchesQuery(false);

  const createMut = useCreateBranchMutation(() => {
    setShowForm(false);
    setNewName('');
  });

  const updateMut = useUpdateBranchMutation(() => {
    setEditId(null);
    setEditName('');
  });

  function startEdit(b: Branch) {
    setEditId(b.id);
    setEditName(b.name);
    setShowForm(false);
  }

  function cancelEdit() {
    setEditId(null);
    setEditName('');
  }

  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    createMut.mutate(name);
  }

  function handleUpdate() {
    const name = editName.trim();
    if (!name || !editId) return;
    updateMut.mutate({ id: editId, name });
  }

  function handleToggle(b: Branch) {
    updateMut.mutate({ id: b.id, isActive: !b.isActive });
  }

  const active = branches.filter((b) => b.isActive);
  const inactive = branches.filter((b) => !b.isActive);

  return (
    <div>
      <PageHeader
        title="Branches"
        subtitle={`${branches.length} total`}
        action={
          !showForm ? (
            <Button onClick={() => { setShowForm(true); cancelEdit(); }}>
              <PlusIcon size={14} weight="bold" />
              New Branch
            </Button>
          ) : null
        }
      />

      {/* Create form */}
      {showForm && (
        <div className="bg-white border border-zinc-200 rounded-lg p-4 mb-5 flex items-center gap-3">
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') { setShowForm(false); setNewName(''); } }}
            placeholder="Branch name..."
            className="flex-1 px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <Button
            size="sm"
            variant="dark"
            disabled={!newName.trim() || createMut.isPending}
            onClick={handleCreate}
          >
            {createMut.isPending ? <Spinner /> : 'Save'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => { setShowForm(false); setNewName(''); }}
          >
            Cancel
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-white border border-zinc-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : branches.length === 0 ? (
        <div className="text-center py-16 text-sm text-zinc-400">
          No branches yet. Create the first one.
        </div>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <section>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Active</p>
              <div className="bg-white border border-zinc-200 rounded-lg divide-y divide-zinc-100">
                {active.map((b) => (
                  <BranchRow
                    key={b.id}
                    branch={b}
                    isEditing={editId === b.id}
                    editName={editName}
                    setEditName={setEditName}
                    onStartEdit={() => startEdit(b)}
                    onCancelEdit={cancelEdit}
                    onSaveEdit={handleUpdate}
                    onToggle={() => handleToggle(b)}
                    isSaving={updateMut.isPending && (editId === b.id || updateMut.variables?.id === b.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {inactive.length > 0 && (
            <section>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Inactive</p>
              <div className="bg-white border border-zinc-200 rounded-lg divide-y divide-zinc-100">
                {inactive.map((b) => (
                  <BranchRow
                    key={b.id}
                    branch={b}
                    isEditing={editId === b.id}
                    editName={editName}
                    setEditName={setEditName}
                    onStartEdit={() => startEdit(b)}
                    onCancelEdit={cancelEdit}
                    onSaveEdit={handleUpdate}
                    onToggle={() => handleToggle(b)}
                    isSaving={updateMut.isPending && (editId === b.id || updateMut.variables?.id === b.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

interface BranchRowProps {
  branch: Branch;
  isEditing: boolean;
  editName: string;
  setEditName: (v: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onToggle: () => void;
  isSaving: boolean;
}

function BranchRow({
  branch,
  isEditing,
  editName,
  setEditName,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggle,
  isSaving,
}: BranchRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {isEditing ? (
        <>
          <input
            autoFocus
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSaveEdit(); if (e.key === 'Escape') onCancelEdit(); }}
            className="flex-1 px-2 py-1 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            onClick={onSaveEdit}
            disabled={!editName.trim() || isSaving}
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors disabled:opacity-40"
          >
            {isSaving ? <Spinner /> : <CheckIcon size={14} weight="bold" />}
          </button>
          <button
            onClick={onCancelEdit}
            className="p-1.5 text-zinc-400 hover:bg-zinc-100 rounded-md transition-colors"
          >
            <XIcon size={14} />
          </button>
        </>
      ) : (
        <>
          <span className={cn('flex-1 text-sm font-medium', branch.isActive ? 'text-zinc-950' : 'text-zinc-400 line-through')}>
            {branch.name}
          </span>
          <span className="text-xs text-zinc-400 font-mono hidden sm:block">
            #{branch.id}
          </span>
          <button
            onClick={onStartEdit}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
            title="Edit name"
          >
            <PencilSimpleIcon size={13} />
          </button>
          <button
            onClick={onToggle}
            disabled={isSaving}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150 disabled:opacity-40',
              branch.isActive
                ? 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
            )}
          >
            {isSaving ? <Spinner /> : branch.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </>
      )}
    </div>
  );
}
