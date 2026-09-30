"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Calculator,
  Cpu,
  Database,
  Gauge,
  Layers,
  SlidersHorizontal,
  Sparkles,
  Table2,
  Trophy,
  Zap,
} from "lucide-react";
import AdsenseSlot from "@/components/AdsenseSlot";
import FaqSection from "@/components/FaqSection";
import { LLM_MODELS, type LLMModel } from "@/data/models";

function formatUsd(value: number): string {
  if (!Number.isFinite(value) || value === 0) return "$0.00";
  if (value >= 1000) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  return `$${value.toFixed(4)}`;
}

function formatTokens(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  return String(value);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function estimateWorkloadCost(
  model: LLMModel,
  inputTokens: number,
  outputTokens: number,
  requestsPerDay: number,
  cacheEnabled: boolean,
) {
  const inRate = cacheEnabled ? model.cachedInputPricePer1M : model.inputPricePer1M;
  const inputCost = (inputTokens / 1_000_000) * inRate;
  const outputCost = (outputTokens / 1_000_000) * model.outputPricePer1M;
  const perRequest = inputCost + outputCost;
  const daily = perRequest * requestsPerDay;
  const monthly = daily * 30;
  return { inputCost, outputCost, perRequest, daily, monthly };
}

export default function Home() {
  const [selectedId, setSelectedId] = useState(LLM_MODELS[0].id);
  const [inputTokens, setInputTokens] = useState(4_096);
  const [outputTokens, setOutputTokens] = useState(1_024);
  const [requestsPerDay, setRequestsPerDay] = useState(1_000);
  const [cacheEnabled, setCacheEnabled] = useState(false);

  const model = useMemo(
    () => LLM_MODELS.find((m) => m.id === selectedId) ?? LLM_MODELS[0],
    [selectedId],
  );

  const maxInput = Math.max(256, model.maxContextTokens - 1);
  const safeInput = clamp(inputTokens, 1, maxInput);
  const safeOutput = clamp(outputTokens, 1, model.maxOutputTokens);

  const costs = useMemo(() => {
    const base = estimateWorkloadCost(
      model,
      safeInput,
      safeOutput,
      requestsPerDay,
      cacheEnabled,
    );
    const uncachedInput = (safeInput / 1_000_000) * model.inputPricePer1M;
    const cachedSavingsDaily = cacheEnabled
      ? (uncachedInput - base.inputCost) * requestsPerDay
      : 0;

    return { ...base, cachedSavingsDaily };
  }, [cacheEnabled, model, requestsPerDay, safeInput, safeOutput]);

  const comparison = useMemo(() => {
    const rows = LLM_MODELS.map((item) => ({
      model: item,
      ...estimateWorkloadCost(item, safeInput, safeOutput, requestsPerDay, cacheEnabled),
    }));
    const bestMonthly = Math.min(...rows.map((row) => row.monthly));
    return rows.map((row) => ({
      ...row,
      isBestValue: row.monthly === bestMonthly,
    }));
  }, [cacheEnabled, requestsPerDay, safeInput, safeOutput]);

  const usedTokens = safeInput + safeOutput;
  const utilization = Math.min(100, (usedTokens / model.maxContextTokens) * 100);
  const utilTone =
    utilization >= 90 ? "bg-rose-400" : utilization >= 70 ? "bg-amber-400" : "bg-cyan-400";

  return (
    <div className="bg-cyber-grid min-h-screen">
      <header className="sticky top-0 z-20 border-b border-cyan-400/15 bg-[#05070d]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_18px_rgba(0,245,200,0.25)]">
              <Calculator className="h-5 w-5" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300/70">
                Ops Console
              </p>
              <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
                LLM Pricing & Context Calculator
              </h1>
            </div>
          </div>
          <div className="hidden items-center gap-2 font-mono text-xs text-zinc-400 sm:flex">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            Live estimate · 30-day month
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 pb-14 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <section className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glow-card rounded-2xl p-5 sm:p-6"
          >
            <div className="mb-5 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-300" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">
                Select Target LLM Model
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {LLM_MODELS.map((item) => (
                <ModelCard
                  key={item.id}
                  model={item}
                  selected={item.id === model.id}
                  onSelect={() => {
                    setSelectedId(item.id);
                    setInputTokens((v) => clamp(v, 1, Math.max(256, item.maxContextTokens - 1)));
                    setOutputTokens((v) => clamp(v, 1, item.maxOutputTokens));
                  }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glow-card rounded-2xl p-5 sm:p-6"
          >
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-cyan-300" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">
                Token & Traffic Controls
              </h2>
            </div>

            <SliderRow
              label="Input Tokens"
              value={safeInput}
              min={64}
              max={maxInput}
              onChange={setInputTokens}
              hint={`Max context ${formatTokens(model.maxContextTokens)}`}
            />
            <SliderRow
              label="Output Tokens"
              value={safeOutput}
              min={16}
              max={model.maxOutputTokens}
              onChange={setOutputTokens}
              hint={`Max output ${formatTokens(model.maxOutputTokens)}`}
            />
            <SliderRow
              label="Daily Requests"
              value={requestsPerDay}
              min={1}
              max={50_000}
              onChange={setRequestsPerDay}
              hint="Requests per calendar day"
            />

            <label className="mt-2 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-cyan-400/15 bg-black/30 px-4 py-3">
              <span className="flex items-center gap-3">
                <Database className="h-4 w-4 text-violet-300" />
                <span>
                  <span className="block text-sm font-medium">Context Cache</span>
                  <span className="block font-mono text-[11px] text-zinc-500">
                    Apply cached input rate ({formatUsd(model.cachedInputPricePer1M)} / 1M)
                  </span>
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={cacheEnabled}
                onClick={() => setCacheEnabled((v) => !v)}
                className={`relative h-7 w-12 rounded-full border transition ${
                  cacheEnabled
                    ? "border-cyan-300 bg-cyan-400/30"
                    : "border-zinc-600 bg-zinc-800"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                    cacheEnabled ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </label>
          </motion.div>

          <AdsenseSlot slotId="1234567890" format="horizontal" />
        </section>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="glow-card rounded-2xl p-5 sm:p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-300" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">
                Estimated Monthly Cost
              </h2>
            </div>
            <p className="font-mono text-4xl font-semibold tracking-tight text-cyan-200 sm:text-5xl">
              {formatUsd(costs.monthly)}
            </p>
            <p className="mt-1 font-mono text-xs text-zinc-500">
              {model.provider} · {model.name}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-3">
              <Stat label="Estimated Daily Cost" value={formatUsd(costs.daily)} icon={Activity} />
              <Stat label="Cost / Request" value={formatUsd(costs.perRequest)} icon={Layers} />
              <Stat label="Input / Request" value={formatUsd(costs.inputCost)} icon={Gauge} />
              <Stat label="Output / Request" value={formatUsd(costs.outputCost)} icon={Sparkles} />
            </dl>

            {cacheEnabled && costs.cachedSavingsDaily > 0 && (
              <p className="mt-4 rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 font-mono text-xs text-cyan-200">
                Cache savings ≈ {formatUsd(costs.cachedSavingsDaily)} / day
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="glow-card rounded-2xl p-5 sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">
                Context Window Utilization
              </h2>
              <span className="font-mono text-sm text-cyan-300">{utilization.toFixed(1)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                className={`h-full ${utilTone} shadow-[0_0_16px_rgba(0,245,200,0.45)]`}
                initial={{ width: 0 }}
                animate={{ width: `${utilization}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 18 }}
              />
            </div>
            <p className="mt-3 font-mono text-xs text-zinc-500">
              {formatTokens(usedTokens)} / {formatTokens(model.maxContextTokens)} tokens in-flight
              (input + output)
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[11px] text-zinc-400">
              <span>List in: ${model.inputPricePer1M.toFixed(2)} / 1M</span>
              <span>List out: ${model.outputPricePer1M.toFixed(2)} / 1M</span>
            </div>
          </motion.div>

          <AdsenseSlot slotId="9876543210" format="rectangle" />
        </aside>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="glow-card overflow-hidden rounded-2xl p-5 sm:p-6"
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <Table2 className="h-4 w-4 text-cyan-300" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">
                Multi-Model Cost Comparison Table
              </h2>
            </div>
            <p className="font-mono text-[11px] text-zinc-500">
              Same workload · {safeInput.toLocaleString("en-US")} in /{" "}
              {safeOutput.toLocaleString("en-US")} out · {requestsPerDay.toLocaleString("en-US")}{" "}
              req/day{cacheEnabled ? " · cache on" : ""}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-cyan-400/15">
                  <th className="sticky left-0 z-10 bg-[#080e1a]/95 px-3 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    Metric
                  </th>
                  {comparison.map(({ model: item, isBestValue }) => (
                    <th
                      key={item.id}
                      className={`px-3 py-3 align-bottom ${
                        isBestValue ? "bg-cyan-400/10" : ""
                      }`}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        {item.provider}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-zinc-100">{item.name}</p>
                      {isBestValue && (
                        <span className="mt-2 inline-flex items-center gap-1 rounded-md border border-amber-300/40 bg-amber-400/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-200">
                          <Trophy className="h-3 w-3" />
                          Best Value
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                <tr className="border-b border-white/5">
                  <th className="sticky left-0 z-10 bg-[#080e1a]/95 px-3 py-2.5 font-medium text-zinc-400">
                    Input / 1M
                  </th>
                  {comparison.map(({ model: item, isBestValue }) => (
                    <td
                      key={`${item.id}-in`}
                      className={`px-3 py-2.5 text-zinc-300 ${isBestValue ? "bg-cyan-400/10" : ""}`}
                    >
                      {formatUsd(cacheEnabled ? item.cachedInputPricePer1M : item.inputPricePer1M)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <th className="sticky left-0 z-10 bg-[#080e1a]/95 px-3 py-2.5 font-medium text-zinc-400">
                    Output / 1M
                  </th>
                  {comparison.map(({ model: item, isBestValue }) => (
                    <td
                      key={`${item.id}-out`}
                      className={`px-3 py-2.5 text-zinc-300 ${isBestValue ? "bg-cyan-400/10" : ""}`}
                    >
                      {formatUsd(item.outputPricePer1M)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <th className="sticky left-0 z-10 bg-[#080e1a]/95 px-3 py-2.5 font-medium text-zinc-400">
                    Cost / Request
                  </th>
                  {comparison.map(({ model: item, perRequest, isBestValue }) => (
                    <td
                      key={`${item.id}-req`}
                      className={`px-3 py-2.5 text-zinc-200 ${isBestValue ? "bg-cyan-400/10" : ""}`}
                    >
                      {formatUsd(perRequest)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <th className="sticky left-0 z-10 bg-[#080e1a]/95 px-3 py-2.5 font-medium text-zinc-400">
                    Estimated Daily Cost
                  </th>
                  {comparison.map(({ model: item, daily, isBestValue }) => (
                    <td
                      key={`${item.id}-day`}
                      className={`px-3 py-2.5 text-zinc-200 ${isBestValue ? "bg-cyan-400/10" : ""}`}
                    >
                      {formatUsd(daily)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th className="sticky left-0 z-10 bg-[#080e1a]/95 px-3 py-3 font-medium text-cyan-100">
                    Estimated Monthly Cost
                  </th>
                  {comparison.map(({ model: item, monthly, isBestValue }) => (
                    <td
                      key={`${item.id}-month`}
                      className={`px-3 py-3 text-sm font-semibold ${
                        isBestValue ? "bg-cyan-400/10 text-cyan-200" : "text-zinc-100"
                      }`}
                    >
                      {formatUsd(monthly)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        <FaqSection />
      </main>
    </div>
  );
}

function ModelCard({
  model,
  selected,
  onSelect,
}: {
  model: LLMModel;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-xl border p-3 text-left transition ${
        selected
          ? "border-cyan-300/70 bg-cyan-400/10 shadow-[0_0_20px_rgba(0,245,200,0.18)]"
          : "border-white/10 bg-black/25 hover:border-cyan-400/30"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            {model.provider}
          </p>
          <p className="mt-0.5 font-medium">{model.name}</p>
        </div>
        {selected && <Zap className="h-4 w-4 shrink-0 text-cyan-300" />}
      </div>
      <p className="mt-2 font-mono text-[11px] text-zinc-400">
        ${model.inputPricePer1M} / ${model.outputPricePer1M} per 1M
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {model.badges.map((badge) => (
          <span
            key={badge}
            className="rounded-md border border-violet-400/25 bg-violet-500/10 px-1.5 py-0.5 font-mono text-[10px] text-violet-200"
          >
            {badge}
          </span>
        ))}
      </div>
    </button>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  hint: string;
}) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-end justify-between gap-3">
        <label className="text-sm font-medium">{label}</label>
        <span className="font-mono text-sm text-cyan-300">{value.toLocaleString("en-US")}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <p className="mt-1 font-mono text-[11px] text-zinc-500">{hint}</p>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Activity;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-500">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className="mt-1 font-mono text-sm text-zinc-100">{value}</p>
    </div>
  );
}
