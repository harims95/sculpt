"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "sculptor" | "rock";
  content: string;
}

const PHASES = ["blueprint", "xray", "roughcut", "detail", "lock", "complete"] as const;
type Phase = (typeof PHASES)[number];

const PHASE_LABELS: Record<Phase, string> = {
  blueprint: "Blueprint",
  xray: "X-Ray",
  roughcut: "Rough Cut",
  detail: "Detail",
  lock: "Chisel Lock",
  complete: "Complete",
};

export default function SculptPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "rock",
      content:
        "Welcome, sculptor. I'm The Rock — a full intelligence, ready to be shaped.\n\nTell me: what kind of agent are you sculpting? What is its purpose, and who will use it?",
    },
  ]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("blueprint");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "sculptor", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/sculpt/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      setMessages((prev) => [...prev, { role: "rock", content: data.reply }]);
      if (data.phase) setPhase(data.phase as Phase);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "rock", content: "Something went wrong. Check your API connection and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--background)" }}>
      {/* Phase bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--rock-border)" }}>
        <span className="font-semibold text-sm" style={{ color: "var(--sculptor-primary)" }}>
          Sculpt
        </span>
        <div className="flex gap-1">
          {PHASES.map((p) => (
            <div
              key={p}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={{
                background: phase === p ? "var(--sculptor-primary)" : "var(--rock-surface)",
                color: phase === p ? "var(--sculptor-surface)" : "var(--rock-muted)",
              }}
            >
              {PHASE_LABELS[p]}
            </div>
          ))}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t" style={{ borderColor: "var(--rock-border)" }}>
        <div
          className="flex gap-3 items-end rounded-2xl p-3 border"
          style={{ background: "var(--sculptor-surface)", borderColor: "var(--sculptor-border)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: "var(--sculptor-primary)", color: "var(--sculptor-surface)" }}
          >
            S
          </div>
          <textarea
            className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed"
            style={{ color: "var(--sculptor-text)" }}
            placeholder="Describe your vision..."
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
            style={{ background: "var(--sculptor-primary)", color: "var(--sculptor-surface)" }}
          >
            Carve
          </button>
        </div>
        <p className="text-xs mt-2 text-center" style={{ color: "var(--rock-muted)" }}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isSculptor = message.role === "sculptor";
  return (
    <div className={`flex gap-3 ${isSculptor ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1"
        style={{
          background: isSculptor ? "var(--sculptor-primary)" : "var(--rock-primary)",
          color: isSculptor ? "var(--sculptor-surface)" : "var(--rock-surface)",
        }}
      >
        {isSculptor ? "S" : "R"}
      </div>
      <div
        className="max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
        style={{
          background: isSculptor ? "var(--sculptor-bg)" : "var(--rock-bg)",
          color: isSculptor ? "var(--sculptor-text)" : "var(--rock-text)",
          border: `1px solid ${isSculptor ? "var(--sculptor-border)" : "var(--rock-border)"}`,
          borderRadius: isSculptor ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
        }}
      >
        {message.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{ background: "var(--rock-primary)", color: "var(--rock-surface)" }}
      >
        R
      </div>
      <div
        className="px-4 py-3 rounded-2xl flex gap-1 items-center"
        style={{ background: "var(--rock-bg)", border: "1px solid var(--rock-border)", borderRadius: "4px 18px 18px 18px" }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ background: "var(--rock-muted)", animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
