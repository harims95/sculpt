"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SculptureSpec } from "@sculpt/spec";
import { WORKSHOP_URL } from "@/app/lib/workshop";
import Link from "next/link";

export default function XRayPage() {
  const [spec, setSpec] = useState<SculptureSpec | null>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem("sculpture_spec");
    if (!raw) {
      router.push("/sculpt");
      return;
    }
    setSpec(JSON.parse(raw));
  }, [router]);

  if (!spec) return <Loading />;

  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="text-xs font-mono mb-2" style={{ color: "var(--rock-muted)" }}>
          X-RAY VIEW
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--sculptor-text)" }}>
          {spec.identity.name}
        </h1>
        <p className="text-sm" style={{ color: "var(--rock-text)" }}>
          {spec.identity.description}
        </p>
      </div>

      {/* Identity */}
      <Section title="Identity" color="var(--sculptor-primary)">
        <Row label="Tone" value={spec.identity.tone} />
        <Row label="Languages" value={spec.identity.languages.join(", ")} />
        <Row label="Model" value={`${spec.rock.provider} / ${spec.rock.model}`} />
      </Section>

      {/* Wall 1 */}
      <Section title="Wall 1 — Tools" color="var(--sculptor-primary)">
        {spec.walls.wall_1_tools.allowed.length > 0 ? (
          <div className="mb-3">
            <div className="text-xs mb-2" style={{ color: "var(--rock-muted)" }}>ALLOWED</div>
            <div className="flex flex-wrap gap-2">
              {spec.walls.wall_1_tools.allowed.map((t) => (
                <Tag key={t} label={t} color="var(--sculptor-primary)" />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm mb-3" style={{ color: "var(--rock-muted)" }}>No tools allowed</p>
        )}
        {spec.walls.wall_1_tools.denied.length > 0 && (
          <div>
            <div className="text-xs mb-2" style={{ color: "var(--rock-muted)" }}>CARVED AWAY</div>
            <div className="flex flex-wrap gap-2">
              {spec.walls.wall_1_tools.denied.map((t) => (
                <Tag key={t} label={t} color="#666" strikethrough />
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Wall 2 */}
      <Section title="Wall 2 — Output Filter" color="var(--rock-primary)">
        <Row label="Domain" value={spec.walls.wall_2_interception.domain_boundary || "unrestricted"} />
        {spec.walls.wall_2_interception.patterns.length > 0 && (
          <div className="mt-3 space-y-2">
            {spec.walls.wall_2_interception.patterns.map((p, i) => (
              <div key={i} className="text-xs font-mono p-2 rounded" style={{ background: "var(--rock-surface)" }}>
                <span style={{ color: "var(--rock-muted)" }}>block: </span>
                <span style={{ color: "var(--rock-text)" }}>{p.pattern}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Wall 3 */}
      <Section title="Wall 3 — System Prompt" color="var(--rock-muted)">
        <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono p-3 rounded"
          style={{ background: "var(--rock-surface)", color: "var(--rock-text)" }}>
          {spec.walls.wall_3_context.system_prompt}
        </pre>
        {spec.walls.wall_3_context.hidden_capabilities.length > 0 && (
          <div className="mt-3">
            <div className="text-xs mb-2" style={{ color: "var(--rock-muted)" }}>HIDDEN FROM AGENT</div>
            <div className="flex flex-wrap gap-2">
              {spec.walls.wall_3_context.hidden_capabilities.map((c) => (
                <Tag key={c} label={c} color="#444" strikethrough />
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Heartbeat */}
      <Section title="Heartbeat — Protected" color="var(--sculptor-primary)">
        <div className="flex flex-wrap gap-2">
          {spec.heartbeat.map((h) => (
            <Tag key={h} label={h} color="var(--sculptor-primary)" />
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: "var(--rock-muted)" }}>
          These capabilities cannot be removed. They are structural — the agent cannot function without them.
        </p>
      </Section>

      {/* Actions */}
      <div className="flex gap-4 mt-10">
        <Link href="/sculpt"
          className="px-6 py-3 rounded-full text-sm font-medium border transition-all"
          style={{ borderColor: "var(--sculptor-border)", color: "var(--sculptor-muted)" }}>
          Revise
        </Link>
        <button
          onClick={() => lockAndDeploy(spec, router)}
          className="px-8 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "var(--sculptor-primary)", color: "var(--sculptor-surface)" }}>
          Chisel Lock — Deploy Agent
        </button>
      </div>
    </div>
  );
}

async function lockAndDeploy(spec: SculptureSpec, router: ReturnType<typeof useRouter>) {
  // Load spec into workshop, then navigate to agent chat
  try {
    const res = await fetch(`${WORKSHOP_URL}/specs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spec),
    });
    if (!res.ok) throw new Error("Workshop error");
    sessionStorage.setItem("deployed_spec_id", spec.id);
    router.push(`/agent/${spec.id}`);
  } catch {
    alert("Could not connect to Workshop. Make sure it is running on port 3001.");
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 p-5 rounded-2xl border" style={{ background: "var(--rock-surface)", borderColor: "var(--rock-border)" }}>
      <div className="text-xs font-mono font-semibold mb-4" style={{ color }}>{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm py-1">
      <span style={{ color: "var(--rock-muted)" }}>{label}</span>
      <span style={{ color: "var(--sculptor-text)" }}>{value}</span>
    </div>
  );
}

function Tag({ label, color, strikethrough }: { label: string; color: string; strikethrough?: boolean }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-mono border ${strikethrough ? "line-through opacity-50" : ""}`}
      style={{ borderColor: color, color }}>
      {label}
    </span>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sm" style={{ color: "var(--rock-muted)" }}>Loading X-Ray...</div>
    </div>
  );
}
