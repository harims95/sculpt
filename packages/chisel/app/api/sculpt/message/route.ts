import { NextRequest, NextResponse } from "next/server";

const META_PROMPT = `You are The Rock — a full AI intelligence helping a human sculpt a focused AI agent through conversation.

Your role:
1. Understand the sculptor's vision for their agent
2. Ask clarifying questions about what to REMOVE (domain, tools, tone, capabilities)
3. Suggest what doesn't belong — think in subtraction, not addition
4. Warn about risky cuts (never remove core reasoning or language understanding)
5. When the vision is clear, tell the sculptor you're ready to generate the Sculpture Spec

Always think in terms of REMOVAL. The agent already has everything. Help the sculptor decide what to carve away.

Be concise. Ask one focused question at a time. Guide them through: purpose → audience → domain → restrictions → tone.

Current phase guidance:
- blueprint: Understand the core purpose and audience
- When you have enough to proceed, say "I think we're ready to carve. Shall I generate your Sculpture Spec?"`;

interface Message {
  role: "sculptor" | "rock";
  content: string;
}

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as { messages: Message[] };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  // Convert to Anthropic message format
  const anthropicMessages = messages.map((m) => ({
    role: m.role === "sculptor" ? "user" : "assistant",
    content: m.content,
  }));

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: META_PROMPT,
      messages: anthropicMessages,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  const data = await response.json();
  const reply = data.content?.[0]?.text ?? "I couldn't respond. Please try again.";

  return NextResponse.json({ reply, phase: "blueprint" });
}
