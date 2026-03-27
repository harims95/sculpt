import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import type { SculptureSpec } from '@sculpt/spec';
import { applyWall1 } from './walls/wall1';
import { applyWall2 } from './walls/wall2';
import { applyWall3 } from './walls/wall3';
import { getSpec, loadSpec } from './specLoader';
import { appendRockDust as appendRockDustMemory, getDust as getDustMemory } from './rockDust';
import { callAnthropic } from './adapters/anthropic';
import type { ChatMessage } from './adapters/anthropic';

// Use DB rock dust if DATABASE_URL is set, otherwise use in-memory
const useDb = !!process.env.DATABASE_URL;

async function persistRockDust(agentId: string, detail: string, reasoning: string) {
  if (useDb) {
    const { appendRockDust } = await import('@sculpt/db');
    await appendRockDust({ agentId, action: 'modified', target: 'prompt', detail, reasoning, approvedBy: 'system' });
  } else {
    appendRockDustMemory(agentId, 'modified', 'prompt', detail, reasoning, 'system');
  }
}

async function fetchRockDust(agentId: string) {
  if (useDb) {
    const { getDustByAgent } = await import('@sculpt/db');
    return getDustByAgent(agentId);
  }
  return getDustMemory(agentId);
}

const app = express();
app.use(express.json({ limit: '1mb' }));

// CORS for chisel frontend
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:3000'];
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.sendStatus(204); return; }
  next();
});

// ─── Health ───────────────────────────────────────────────────────────────────

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'workshop', db: useDb });
});

// ─── Load a spec into the workshop ────────────────────────────────────────────

app.post('/specs', async (req: Request, res: Response) => {
  try {
    const spec = req.body as SculptureSpec;

    // Always load into memory cache for fast access
    loadSpec(spec);

    // If DB is available, also load from DB on next request
    res.json({ ok: true, id: spec.id });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// ─── Chat with a sculpted agent ───────────────────────────────────────────────

app.post('/agent/:id/chat', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { messages, api_key } = req.body as {
    messages: ChatMessage[];
    api_key: string;
  };

  if (!api_key) {
    res.status(400).json({ error: 'api_key is required' });
    return;
  }

  // Try memory cache first, then DB
  let spec = getSpec(id);
  if (!spec && useDb) {
    try {
      const { getAgent, getSpecFromAgent } = await import('@sculpt/db');
      const agent = await getAgent(id);
      if (agent) {
        spec = getSpecFromAgent(agent);
        loadSpec(spec); // warm the cache
      }
    } catch { /* fall through */ }
  }

  if (!spec) {
    res.status(404).json({ error: `No spec found for agent ${id}` });
    return;
  }

  try {
    const systemPrompt = applyWall3(spec.walls.wall_3_context, spec.identity);
    const filteredTools = applyWall1([], spec.walls.wall_1_tools);

    const raw = await callAnthropic({
      systemPrompt,
      messages,
      tools: filteredTools,
      model: spec.rock.model,
      apiKey: api_key,
    });

    const filtered = applyWall2(raw.text, spec.walls.wall_2_interception);

    if (!filtered.passed) {
      await persistRockDust(id, 'Wall 2 blocked response', filtered.violation ?? 'pattern match');
    }

    res.json({
      response: filtered.output,
      wall2_triggered: !filtered.passed,
      usage: { input_tokens: raw.inputTokens, output_tokens: raw.outputTokens },
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ─── Rock Dust log ────────────────────────────────────────────────────────────

app.get('/agent/:id/dust', async (req: Request, res: Response) => {
  const dust = await fetchRockDust(req.params.id);
  res.json({ dust });
});

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT ?? 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Workshop running on http://localhost:${PORT} (db: ${useDb})`);
  });
}

export { app };
