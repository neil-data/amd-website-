'use client';

export function DashboardLoading({ label }: { label: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
    </div>
  );
}

export function DashboardError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <p className="text-sm text-zinc-300">{message}</p>
    </div>
  );
}
