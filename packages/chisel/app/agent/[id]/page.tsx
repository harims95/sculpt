"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import type { SculptureSpec } from "@sculpt/spec";
import { WORKSHOP_URL } from "@/app/lib/workshop";

interface Message {
  role: "user" | "agent";
  content: string;
}

export default function AgentPage() {
  const { id } = useParams<{ id: string }>();
  const [spec, setSpec] = useState<SculptureSpec | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [keySet, setKeySet] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("sculpture_spec");
    if (raw) {
      const s: SculptureSpec = JSON.parse(raw);
      if (s.id === id) setSpec(s);
    }
    const savedKey = sessionStorage.getItem("anthropic_api_key");
    if (savedKey) { setApiKey(savedKey); setKeySet(true); }
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (spec && keySet && messages.length === 0) {
      setMessages([{
        role: "agent",
        content: `Hi! I'm ${spec.identity.name}. ${spec.identity.description} How can I help you today?`,
      }]);
    }
  }, [spec, keySet, messages.length]);

  const saveKey = () => {
    if (!apiKey.trim()) return;
    sessionStorage.setItem("anthropic_api_key", apiKey.trim());
    setKeySet(true);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${WORKSHOP_URL}/agent/${id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
          api_key: apiKey,
        }),
      });

      if (!res.ok) throw new Error("Workshop error");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "agent", content: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "I'm having trouble connecting right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // API key gate
  if (!keySet) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md p-8 rounded-2xl border"
          style={{ background: "var(--rock-surface)", borderColor: "var(--rock-border)" }}>
          <div className="text-xs font-mono mb-2" style={{ color: "var(--rock-muted)" }}>TO START</div>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--sculptor-text)" }}>
            Enter your Anthropic API key
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--rock-text)" }}>
            Your key is stored in your browser session only — never sent to our servers.
          </p>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-4 font-mono"
            style={{ background: "var(--rock-bg)", color: "var(--rock-text)", border: "1px solid var(--rock-border)" }}
            placeholder="sk-ant-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveKey()}
          />
          <button onClick={saveKey} disabled={!apiKey.trim()}
            className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-40"
            style={{ background: "var(--sculptor-primary)", color: "var(--sculptor-surface)" }}>
            Start Chatting
          </button>
        </div>
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm" style={{ color: "var(--rock-muted)" }}>
          Agent not found. <a href="/sculpt" style={{ color: "var(--sculptor-primary)" }}>Sculpt one →</a>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--background)" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "var(--rock-border)" }}>
        <div>
          <div className="font-semibold text-sm" style={{ color: "var(--sculptor-text)" }}>
            {spec.identity.name}
          </div>
          <div className="text-xs" style={{ color: "var(--rock-muted)" }}>
            {spec.identity.description}
          </div>
        </div>
        <a href={`/agent/${id}/xray`}
          className="text-xs px-3 py-1 rounded-full border"
          style={{ borderColor: "var(--rock-border)", color: "var(--rock-muted)" }}>
          X-Ray
        </a>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1"
              style={{
                background: msg.role === "user" ? "var(--sculptor-primary)" : "var(--rock-primary)",
                color: msg.role === "user" ? "var(--sculptor-surface)" : "var(--rock-surface)",
              }}>
              {msg.role === "user" ? "U" : spec.identity.name[0]}
            </div>
            <div className="max-w-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
              style={{
                background: msg.role === "user" ? "var(--sculptor-bg)" : "var(--rock-bg)",
                color: msg.role === "user" ? "var(--sculptor-text)" : "var(--rock-text)",
                border: `1px solid ${msg.role === "user" ? "var(--sculptor-border)" : "var(--rock-border)"}`,
                borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
              }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "var(--rock-primary)", color: "var(--rock-surface)" }}>
              {spec.identity.name[0]}
            </div>
            <div className="px-4 py-3 flex gap-1 items-center"
              style={{ background: "var(--rock-bg)", border: "1px solid var(--rock-border)", borderRadius: "4px 18px 18px 18px" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: "var(--rock-muted)", animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t" style={{ borderColor: "var(--rock-border)" }}>
        <div className="flex gap-3 items-end rounded-2xl p-3 border"
          style={{ background: "var(--rock-surface)", borderColor: "var(--rock-border)" }}>
          <textarea
            className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed"
            style={{ color: "var(--sculptor-text)" }}
            placeholder={`Message ${spec.identity.name}...`}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button onClick={send} disabled={!input.trim() || loading}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
            style={{ background: "var(--rock-primary)", color: "var(--rock-surface)" }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
