import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center min-h-screen px-6 py-24">
      {/* Header */}
      <div className="text-center max-w-2xl">
        <div className="inline-block mb-6 px-4 py-1 rounded-full text-sm font-medium border"
          style={{ borderColor: "var(--sculptor-border)", color: "var(--sculptor-muted)", background: "var(--sculptor-surface)" }}>
          We don&apos;t build agents. We sculpt them.
        </div>

        <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
          <span style={{ color: "var(--sculptor-text)" }}>Shape AI through</span>
          <br />
          <span style={{ color: "var(--sculptor-primary)" }}>subtraction</span>
          <span style={{ color: "var(--sculptor-text)" }}>.</span>
        </h1>

        <p className="text-lg mb-10 leading-relaxed" style={{ color: "var(--rock-text)" }}>
          Start with the full intelligence of a foundation model.
          Then carve away everything that doesn&apos;t belong.
          What remains is your agent — focused, safe, and purposeful.
        </p>

        <Link
          href="/sculpt"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all hover:opacity-90 hover:scale-105"
          style={{ background: "var(--sculptor-primary)", color: "var(--sculptor-surface)" }}
        >
          Begin Sculpting
          <span>→</span>
        </Link>
      </div>

      {/* Three walls preview */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
        {[
          {
            wall: "Wall 1",
            title: "Tool Removal",
            desc: "Denied tools are never passed to the model. Infrastructure-level enforcement.",
            color: "var(--sculptor-primary)",
          },
          {
            wall: "Wall 2",
            title: "Output Filter",
            desc: "Every response is checked against your rules before reaching the user.",
            color: "var(--rock-primary)",
          },
          {
            wall: "Wall 3",
            title: "Context Shape",
            desc: "The model is told what it is — and what it is not. Identity carved in.",
            color: "var(--rock-muted)",
          },
        ].map(({ wall, title, desc, color }) => (
          <div
            key={wall}
            className="p-6 rounded-2xl border"
            style={{ background: "var(--rock-surface)", borderColor: "var(--rock-border)" }}
          >
            <div className="text-xs font-mono mb-2" style={{ color }}>
              {wall}
            </div>
            <div className="font-semibold mb-2" style={{ color: "var(--sculptor-text)" }}>
              {title}
            </div>
            <div className="text-sm leading-relaxed" style={{ color: "var(--rock-muted)" }}>
              {desc}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
