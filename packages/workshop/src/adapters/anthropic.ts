import Anthropic from '@anthropic-ai/sdk';
import type { ModelTool } from '../walls/wall1';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AdapterRequest {
  systemPrompt: string;
  messages: ChatMessage[];
  tools: ModelTool[];
  model: string;
  apiKey: string;
}

export interface AdapterResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

export async function callAnthropic(req: AdapterRequest): Promise<AdapterResponse> {
  const client = new Anthropic({ apiKey: req.apiKey });

  const tools: Anthropic.Tool[] = req.tools.map(t => ({
    name: t.name,
    description: t.description,
    input_schema: t.input_schema as Anthropic.Tool['input_schema'],
  }));

  const response = await client.messages.create({
    model: req.model,
    max_tokens: 1024,
    system: req.systemPrompt,
    messages: req.messages,
    ...(tools.length > 0 ? { tools } : {}),
  });

  const textBlock = response.content.find(b => b.type === 'text');
  const text = textBlock?.type === 'text' ? textBlock.text : '';

  return {
    text,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}
