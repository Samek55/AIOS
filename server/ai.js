import { config } from './config.js';
import { buildAssistantReply } from './logic.js';

export async function buildAssistantResponse(scopedStore, query) {
  if (!config.openaiApiKey) {
    return buildAssistantReply(scopedStore, query);
  }

  const prompt = [
    'You are AIOS, a personal life assistant that helps with ordering, routine, fitness, spending, and local discovery.',
    'Be concise, helpful, and action oriented.',
    'Use the user context below to answer.',
    `User: ${scopedStore.profile.firstName} in ${scopedStore.profile.city}`,
    `Mood: ${scopedStore.mood}`,
    `Open tasks: ${scopedStore.tasks.filter((task) => !task.completed).map((task) => task.title).join(', ')}`,
    `Health: ${scopedStore.health.waterGlasses}/${scopedStore.health.waterGoal} water, ${scopedStore.health.stepsToday}/${scopedStore.health.stepGoal} steps`,
    `Budget summary: ${scopedStore.finance.categories.map((category) => `${category.name} ${category.spent}/${category.budget}`).join(', ')}`,
    `User query: ${query}`,
    'Return JSON with keys text and cards. Cards should be a short array of at most 3 assistant cards with id, type, title, subtitle, meta, and optional action/secondaryAction.',
  ].join('\n');

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.openaiModel,
        input: prompt,
        text: {
          format: {
            type: 'json_schema',
            name: 'assistant_reply',
            schema: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                cards: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      type: { type: 'string' },
                      title: { type: 'string' },
                      subtitle: { type: 'string' },
                      meta: { type: 'string' },
                      action: { type: 'object' },
                      secondaryAction: { type: 'object' },
                    },
                    required: ['id', 'type', 'title', 'subtitle', 'meta'],
                    additionalProperties: true,
                  },
                },
              },
              required: ['text'],
              additionalProperties: false,
            },
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI call failed: ${response.status}`);
    }

    const body = await response.json();
    const rawOutput =
      body.output_text ||
      body.output?.[0]?.content?.[0]?.text ||
      body.output?.[0]?.content?.[0]?.json ||
      '';

    if (!rawOutput) {
      return buildAssistantReply(scopedStore, query);
    }

    const parsed = typeof rawOutput === 'string' ? JSON.parse(rawOutput) : rawOutput;
    return {
      text: parsed.text || buildAssistantReply(scopedStore, query).text,
      cards: Array.isArray(parsed.cards) ? parsed.cards : buildAssistantReply(scopedStore, query).cards,
    };
  } catch {
    return buildAssistantReply(scopedStore, query);
  }
}
