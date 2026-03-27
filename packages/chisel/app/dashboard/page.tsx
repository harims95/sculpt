"use client";

import { useState, useEffect } from "react";
import type { SculptureSpec } from "@sculpt/spec";
import Link from "next/link";

export default function DashboardPage() {
  const [agents, setAgents] = useState<SculptureSpec[]>([]);

  useEffect(() => {
    // In v1, agents are stored in sessionStorage
    // v2 will fetch from /api/agents (PostgreSQL)
    const keys = Object.keys(sessionStorage).filter((k) => k.startsWith("agent_spec_"));
    const loaded: SculptureSpec[] = keys
      .map((k) => {
        try { return JSON.parse(sessionStorage.getItem(k)!); } catch { return null; }
      })
      .filter(Boolean);

    // Also include the most recently sculpted spec
    const recent = sessionStorage.getItem("sculpture_spec");
    if (recent) {
      try {
        const spec = JSON.parse(recent);
        if (!loaded.find((a) => a.id === spec.id)) loaded.unshift(spec);
      } catch {}
    }

    setAgents(loaded);
  }, []);

  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--sculptor-text)" }}>
            Your Agents
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--rock-muted)" }}>
            {agents.length} sculpted {agents.length === 1 ? "agent" : "agents"}
          </p>
        </div>
        <Link href="/sculpt"
          className="px-5 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "var(--sculptor-primary)", color: "var(--sculptor-surface)" }}>
          + New Agent
        </Link>
      </div>

      {/* Agent list */}
      {agents.length === 0 ? (
        <Empty />
      ) : (
        <div className="space-y-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}

function AgentCard({ agent }: { agent: SculptureSpec }) {
  const deniedCount = agent.walls.wall_1_tools.denied.length;
  const patternCount = agent.walls.wall_2_interception.patterns.length;

  return (
    <div className="p-5 rounded-2xl border flex items-start justify-between gap-4"
      style={{ background: "var(--rock-surface)", borderColor: "var(--rock-border)" }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-semibold" style={{ color: "var(--sculptor-text)" }}>
            {agent.identity.name}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "var(--rock-bg)", color: "var(--rock-muted)" }}>
            {agent.rock.provider}
          </span>
        </div>
        <p className="text-sm truncate mb-3" style={{ color: "var(--rock-text)" }}>
          {agent.identity.description}
        </p>
        <div className="flex gap-4 text-xs" style={{ color: "var(--rock-muted)" }}>
          <span>{deniedCount} tools carved away</span>
          <span>{patternCount} output filters</span>
          <span>{agent.heartbeat.length} heartbeat capabilities</span>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Link href={`/sculpt/xray?id=${agent.id}`}
          className="px-3 py-2 rounded-lg text-xs border transition-all"
          style={{ borderColor: "var(--rock-border)", color: "var(--rock-muted)" }}>
          X-Ray
        </Link>
        <Link href={`/agent/${agent.id}`}
          className="px-3 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-90"
          style={{ background: "var(--sculptor-primary)", color: "var(--sculptor-surface)" }}>
          Chat →
        </Link>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="text-center py-24">
      <div className="text-4xl mb-4">⛏</div>
      <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--sculptor-text)" }}>
        No agents yet
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--rock-muted)" }}>
        Sculpt your first agent in under 5 minutes.
      </p>
      <Link href="/sculpt"
        className="inline-flex px-6 py-3 rounded-full text-sm font-semibold"
        style={{ background: "var(--sculptor-primary)", color: "var(--sculptor-surface)" }}>
        Begin Sculpting
      </Link>
    </div>
  );
}
