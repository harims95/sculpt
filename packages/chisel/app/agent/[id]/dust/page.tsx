"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { RockDustEntry } from "@sculpt/spec";
import Link from "next/link";

export default function DustPage() {
  const { id } = useParams<{ id: string }>();
  const [dust, setDust] = useState<RockDustEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/agent/${id}/dust`)
      .then((r) => r.json())
      .then((data) => setDust(data.dust ?? []))
      .catch(() => setDust([]))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs font-mono mb-1" style={{ color: "var(--rock-muted)" }}>
            ROCK DUST — AUDIT LOG
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--sculptor-text)" }}>
            Agent {id}
          </h1>
        </div>
        <Link href={`/agent/${id}`}
          className="text-sm px-4 py-2 rounded-full border"
          style={{ borderColor: "var(--rock-border)", color: "var(--rock-muted)" }}>
          ← Back to Chat
        </Link>
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: "var(--rock-muted)" }}>Loading...</p>
      ) : dust.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm" style={{ color: "var(--rock-muted)" }}>
            No rock dust yet. Dust is recorded when Wall 2 blocks a response.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {dust.map((entry) => (
            <DustEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

function DustEntry({ entry }: { entry: RockDustEntry }) {
  const actionColor: Record<string, string> = {
    added: "var(--sculptor-primary)",
    removed: "#e57373",
    modified: "var(--rock-primary)",
    locked: "var(--sculptor-primary)",
    rolled_back: "#e57373",
  };

  return (
    <div className="p-4 rounded-xl border" style={{ background: "var(--rock-surface)", borderColor: "var(--rock-border)" }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded"
              style={{ background: "var(--rock-bg)", color: actionColor[entry.action] ?? "var(--rock-muted)" }}>
              {entry.action}
            </span>
            <span className="text-xs" style={{ color: "var(--rock-muted)" }}>
              {entry.target}
            </span>
          </div>
          <p className="text-sm mb-1" style={{ color: "var(--sculptor-text)" }}>{entry.detail}</p>
          <p className="text-xs" style={{ color: "var(--rock-muted)" }}>
            Reason: {entry.reasoning}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs font-mono" style={{ color: "var(--rock-muted)" }}>
            {new Date(entry.timestamp).toLocaleTimeString()}
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--rock-muted)" }}>
            {entry.approved_by}
          </div>
        </div>
      </div>
    </div>
  );
}
