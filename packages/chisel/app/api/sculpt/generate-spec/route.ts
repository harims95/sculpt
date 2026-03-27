import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { validateSpec } from "@sculpt/spec";
import type { SculptureSpec } from "@sculpt/spec";
import { getUserByClerkId, createAgent } from "@sculpt/db";

interface Message {
  role: "sculptor" | "rock";
  content: string;
}

const SPEC_GENERATION_PROMPT = `You are a Sculpture Spec generator. Based on the conversation between the sculptor and The Rock, generate a complete Sculpture Spec JSON.

The spec must follow this exact structure:
{
  "id": "sculpt_<random 6 char alphanumeric>",
  "version": 1,
  "created_at": "<ISO 8601 timestamp>",
  "sculptor_id": "user_unknown",
  "rock": {
    "provider": "anthropic",
    "model": "claude-haiku-4-5-20251001"
  },
  "identity": {
    "name": "<agent name from conversation>",
    "description": "<what the agent does>",
    "tone": "<tone from conversation>",
    "languages": ["en"]
  },
  "walls": {
    "wall_1_tools": {
      "allowed": [],
      "denied": ["web_search", "code_execution", "file_write", "image_gen"]
    },
    "wall_2_interception": {
      "patterns": [
        { "pattern": "<relevant block pattern>", "replacement": "<safe fallback>" }
      ],
      "domain_boundary": "<domain from conversation>"
    },
    "wall_3_context": {
      "system_prompt": "<full system prompt for the agent based on conversation>",
      "hidden_capabilities": ["<capabilities to hide based on conversation>"]
    }
  },
  "heartbeat": ["reasoning", "language_understanding", "context_awareness"],
  "escalation": {
    "enabled": false,
    "trigger": "",
    "fallback": ""
  },
  "snapshots": [],
  "rock_dust": []
}

Rules:
- wall_1_tools.denied must NOT include any heartbeat capabilities
- wall_2_interception.patterns should reflect domain restrictions discussed
- wall_3_context.system_prompt should be detailed and reflect the agent's purpose, tone, and restrictions
- hidden_capabilities should list domains the agent should have no awareness of
- Only output valid JSON, nothing else — no markdown, no explanation`;

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  const { messages } = (await req.json()) as { messages: Message[] };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  // Build a summary of the conversation for spec generation
  const conversationSummary = messages
    .map((m) => `${m.role === "sculptor" ? "Sculptor" : "Rock"}: ${m.content}`)
    .join("\n\n");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: SPEC_GENERATION_PROMPT,
      messages: [
        {
          role: "user",
          content: `Here is the sculpting conversation:\n\n${conversationSummary}\n\nGenerate the Sculpture Spec JSON now.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  const data = await response.json();
  const rawText = data.content?.[0]?.text ?? "";

  // Parse JSON from response
  let spec: SculptureSpec;
  try {
    // Strip any accidental markdown code fences
    const cleaned = rawText.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    spec = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse spec JSON from model", raw: rawText },
      { status: 500 }
    );
  }

  // Resolve real user ID
  let dbUserId = "guest";
  if (clerkId) {
    const user = await getUserByClerkId(clerkId);
    if (user) dbUserId = user.id;
  }

  // Override id and sculptor_id with real values
  spec.id = `sculpt_${Math.random().toString(36).slice(2, 8)}`;
  spec.created_at = new Date().toISOString();
  spec.sculptor_id = dbUserId;
  spec.snapshots = [];
  spec.rock_dust = [];

  // Validate
  const validation = validateSpec(spec);
  if (!validation.valid) {
    // Try to auto-fix common issues
    spec = autoFix(spec);
    const recheck = validateSpec(spec);
    if (!recheck.valid) {
      return NextResponse.json(
        { error: "Generated spec failed validation", errors: recheck.errors, spec },
        { status: 422 }
      );
    }
  }

  // Persist agent to database if user is authenticated
  if (dbUserId !== "guest") {
    try {
      await createAgent(dbUserId, spec);
    } catch {
      // Non-fatal — spec is still returned to client
    }
  }

  return NextResponse.json({ spec });
}

function autoFix(spec: SculptureSpec): SculptureSpec {
  // Ensure heartbeat is never empty
  if (!spec.heartbeat || spec.heartbeat.length === 0) {
    spec.heartbeat = ["reasoning", "language_understanding", "context_awareness"];
  }

  // Remove heartbeat capabilities from denied list
  const heartbeatSet = new Set(spec.heartbeat);
  if (spec.walls?.wall_1_tools?.denied) {
    spec.walls.wall_1_tools.denied = spec.walls.wall_1_tools.denied.filter(
      (d) => !heartbeatSet.has(d)
    );
  }

  // Remove overlap between allowed and denied
  if (spec.walls?.wall_1_tools) {
    const deniedSet = new Set(spec.walls.wall_1_tools.denied);
    spec.walls.wall_1_tools.allowed = (spec.walls.wall_1_tools.allowed ?? []).filter(
      (a) => !deniedSet.has(a)
    );
  }

  return spec;
}
