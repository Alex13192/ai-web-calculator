"use client";

import { BookOpen, ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/data/faq";

export default function FaqSection() {
  return (
    <section
      className="glow-card rounded-2xl p-5 sm:p-6"
      aria-labelledby="faq-guide-heading"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-cyan-300" />
        <h2
          id="faq-guide-heading"
          className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100"
        >
          LLM Cost Optimization Guide & FAQ
        </h2>
      </div>
      <p className="mb-5 max-w-3xl text-sm leading-6 text-zinc-400">
        Practical notes on token billing, prompt caching, model routing, and context
        window utilization. Expand a topic to see how to lower LLM API spend without
        shrinking product quality.
      </p>

      <div className="space-y-2">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.id}
            className="group rounded-xl border border-cyan-400/15 bg-black/30 open:border-cyan-400/35 open:bg-cyan-400/5"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-left marker:content-none [&::-webkit-details-marker]:hidden">
              <h3
                className="text-sm font-medium text-zinc-100"
                itemProp="name"
              >
                {item.question}
              </h3>
              <ChevronDown className="h-4 w-4 shrink-0 text-cyan-300 transition group-open:rotate-180" />
            </summary>
            <div
              className="border-t border-cyan-400/10 px-4 py-3 text-sm leading-6 text-zinc-400"
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <p itemProp="text">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
