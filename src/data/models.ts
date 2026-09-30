export interface LLMModel {
  id: string;
  name: string;
  provider: "OpenAI" | "Anthropic" | "Google" | "DeepSeek";
  /** USD per 1M input tokens (cache miss / standard). */
  inputPricePer1M: number;
  /** USD per 1M output tokens. */
  outputPricePer1M: number;
  /** USD per 1M cached input tokens (prompt cache hit). */
  cachedInputPricePer1M: number;
  maxContextTokens: number;
  maxOutputTokens: number;
  badges: string[];
}

/**
 * Public list prices (USD / 1M tokens), Sep 2026.
 * Cached rates follow each vendor's documented cache-hit / cached-input discount.
 */
export const LLM_MODELS: LLMModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    inputPricePer1M: 2.5,
    outputPricePer1M: 10,
    cachedInputPricePer1M: 1.25,
    maxContextTokens: 128_000,
    maxOutputTokens: 16_384,
    badges: ["Flagship", "Multimodal"],
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    inputPricePer1M: 0.15,
    outputPricePer1M: 0.6,
    cachedInputPricePer1M: 0.075,
    maxContextTokens: 128_000,
    maxOutputTokens: 16_384,
    badges: ["Budget", "Fast"],
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    inputPricePer1M: 3,
    outputPricePer1M: 15,
    cachedInputPricePer1M: 0.3,
    maxContextTokens: 200_000,
    maxOutputTokens: 8_192,
    badges: ["Reasoning", "200K Ctx"],
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    inputPricePer1M: 1.25,
    outputPricePer1M: 5,
    cachedInputPricePer1M: 0.3125,
    maxContextTokens: 2_097_152,
    maxOutputTokens: 8_192,
    badges: ["Long Context", "2M"],
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    inputPricePer1M: 0.27,
    outputPricePer1M: 1.1,
    cachedInputPricePer1M: 0.07,
    maxContextTokens: 64_000,
    maxOutputTokens: 8_192,
    badges: ["Value", "Open Weights"],
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    inputPricePer1M: 0.55,
    outputPricePer1M: 2.19,
    cachedInputPricePer1M: 0.14,
    maxContextTokens: 64_000,
    maxOutputTokens: 8_192,
    badges: ["Reasoning", "CoT"],
  },
];
