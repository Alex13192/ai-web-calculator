export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "how-llm-api-cost-is-calculated",
    question: "How is LLM API cost calculated from input and output tokens?",
    answer:
      "Most providers bill separately for prompt (input) tokens and completion (output) tokens, usually as USD per 1 million tokens. Estimated request cost is (input tokens / 1,000,000 × input price) + (output tokens / 1,000,000 × output price). Multiply by daily request volume and a 30-day month to forecast spend. Output tokens are often several times more expensive than input, so long completions dominate the invoice even when prompts look modest.",
  },
  {
    id: "prompt-caching-token-savings",
    question: "How does prompt caching (context cache) cut token spend?",
    answer:
      "If the same system prompt, tools, or retrieved context is sent on every call, vendors can serve a cache hit at a discounted input rate (often 50–90% off). Enable Context Cache in this calculator to apply each model's cached input price. Caching does not discount output tokens, so you still win the most when a large static prefix is reused across thousands of daily requests. Keep the cacheable prefix stable; small edits can force cache misses and full list-price input billing.",
  },
  {
    id: "cheaper-model-vs-large-context",
    question: "When should I pick a cheaper model instead of a huge context window?",
    answer:
      "A 128K–2M context window only helps if you actually fill it. Shipping a 200K prompt into a flagship model is usually more expensive than retrieving less context and routing easy turns to a mini or value model (GPT-4o Mini, DeepSeek V3). Use a large-context SKU for long documents, then cap max output tokens. Compare Estimated Monthly Cost across models on the same input/output/request workload before you lock a production default.",
  },
  {
    id: "context-window-utilization-waste",
    question: "What is context window utilization and how do I avoid wasted tokens?",
    answer:
      "Context window utilization is (input tokens + output tokens) / max context tokens. High utilization raises latency, truncation risk, and input cost; very low utilization means you may be paying flagship rates for a job a smaller window could handle. Trim boilerplate, summarize history, set a tight max_tokens, and drop unused tools. Watch the Context Window Utilization bar: stay well below 90% so the model still has room to generate, and do not pad prompts just because the window is large.",
  },
];
