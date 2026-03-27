import express from 'express';
import type { Request, Response } from 'express';
import type { SculptureSpec } from '@sculpt/spec';
import { applyWall1 } from './walls/wall1';
import { applyWall2 } from './walls/wall2';
import { applyWall3 } from './walls/wall3';
import { getSpec, loadSpec } from './specLoader';
import { appendRockDust } from './rockDust';
import { callAnthropic } from './adapters/anthropic';
import type { ChatMessage } from './adapters/anthropic';

const app = express();
app.use(express.json());

// ─── Health ───────────────────────────────────────────────────────────────────

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'workshop' });
});

// ─── Load a spec into the workshop ────────────────────────────────────────────

app.post('/specs', (req: Request, res: Response) => {
  try {
    const spec = req.body as SculptureSpec;
    loadSpec(spec);
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

  // Load spec
  const spec = getSpec(id);
  if (!spec) {
    res.status(404).json({ error: `No spec found for agent ${id}` });
    return;
  }

  if (!api_key) {
    res.status(400).json({ error: 'api_key is required' });
    return;
  }

  try {
    // Wall 3: build system prompt
    const systemPrompt = applyWall3(spec.walls.wall_3_context, spec.identity);

    // Wall 1: filter tools
    const filteredTools = applyWall1([], spec.walls.wall_1_tools);

    // Call model
    const raw = await callAnthropic({
      systemPrompt,
      messages,
      tools: filteredTools,
      model: spec.rock.model,
      apiKey: api_key,
    });

    // Wall 2: filter output
    const filtered = applyWall2(raw.text, spec.walls.wall_2_interception);

    // Log to rock dust
    if (!filtered.passed) {
      appendRockDust(
        id,
        'modified',
        'prompt',
        `Wall 2 blocked response`,
        filtered.violation ?? 'pattern match',
        'system'
      );
    }

    res.json({
      response: filtered.output,
      wall2_triggered: !filtered.passed,
      usage: {
        input_tokens: raw.inputTokens,
        output_tokens: raw.outputTokens,
      },
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ─── Rock Dust log ────────────────────────────────────────────────────────────

app.get('/agent/:id/dust', (req: Request, res: Response) => {
  const { getDust } = require('./rockDust');
  res.json({ dust: getDust(req.params.id) });
});

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT ?? 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Workshop running on http://localhost:${PORT}`);
  });
}

export { app };
