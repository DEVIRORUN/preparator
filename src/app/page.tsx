"use client";

import { useState, useCallback, useRef } from "react";
import { parseExamContent, ParsedBlock } from "./_lib/parser";
import ExamRenderer from "../components/ExamRenderer";
import clsx from "clsx";

const PLACEHOLDER = `Paste your engineering exam content here...

Example:
SECTION A: DC MACHINES (MOTORS & GENERATORS)

Question 2: Calculations

A 4-pole, Wave-Wound DC shunt generator delivers a load current of 50 A at a terminal voltage of 300 V. The armature resistance is 0.2 Ω and shunt field resistance is 150 Ω.

Calculate:
a) The shunt field current ($I_f$).
b) The total armature current ($I_a$).
c) The generated EMF ($E$).

ANSWER KEY & WORKED SOLUTIONS

● a) Shunt Field Current ($I_f$):
$$I_f = \\frac{V}{R_f} = \\frac{300}{150} = \\mathbf{2\\text{ A}}$$

● b) Total Armature Current ($I_a$):
$$I_a = I_L + I_f = 50 + 2 = \\mathbf{52\\text{ A}}$$`;

export default function HomePage() {
  const [input, setInput] = useState("");
  const [blocks, setBlocks] = useState<ParsedBlock[]>([]);
  const [hasRendered, setHasRendered] = useState(false);
  const [activeTab, setActiveTab] = useState<"input" | "output">("input");
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const colors =
    theme === "dark"
      ? {
          bg: "#0a0a0f",
          bgSecondary: "#0d0d14",
          bgTertiary: "#111118",
          border: "#1e1e2e",
          text: "#e8e9eb",
          textSecondary: "#d1d5db",
          textTertiary: "#9ca3af",
          textQuaternary: "#6b7280",
          textDisabled: "#4b5563",
          accent: "#00d4aa",
          accentDark: "#00b894",
        }
      : {
          bg: "#ffffff",
          bgSecondary: "#f8f9fa",
          bgTertiary: "#f0f1f3",
          border: "#d1d5db",
          text: "#0f172a",
          textSecondary: "#1e293b",
          textTertiary: "#334155",
          textQuaternary: "#475569",
          textDisabled: "#64748b",
          accent: "#0891b2",
          accentDark: "#0e7490",
        };

  const handleRender = useCallback(() => {
    if (!input.trim()) return;
    const parsed = parseExamContent(input);
    setBlocks(parsed);
    setHasRendered(true);
    setActiveTab("output");
  }, [input]);

  const handleClear = () => {
    setInput("");
    setBlocks([]);
    setHasRendered(false);
    setActiveTab("input");
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRender();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Header */}
      <header
        className="no-print px-6 py-4 flex items-center justify-between"
        style={{ borderBottomColor: colors.border, borderBottomWidth: 1 }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: `${colors.accent}20`,
              borderColor: `${colors.accent}50`,
              borderWidth: 1,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4h12M2 8h8M2 12h10"
                stroke={colors.accent}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h1
              className="font-display font-bold text-sm leading-none"
              style={{ color: colors.text }}
            >
              IdanStudy
            </h1>
            <p
              className="text-xs mt-0.5 font-mono"
              style={{ color: colors.textTertiary }}
            >
              Engineering Exam Renderer - nonsense markup cause of AI and
              rushing
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="hidden sm:inline text-xs font-mono px-2 py-1 rounded"
            style={{
              color: colors.textDisabled,
              borderColor: colors.border,
              borderWidth: 1,
            }}
          >
            Ctrl+Enter to render
          </span>
          <button
            onClick={() => window.print()}
            className="transition-colors text-xs font-mono px-3 py-1.5 rounded"
            style={{
              color: colors.textTertiary,
              borderColor: colors.border,
              borderWidth: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.accent;
              e.currentTarget.style.borderColor = `${colors.accent}66`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.textTertiary;
              e.currentTarget.style.borderColor = colors.border;
            }}
          >
            Print / Save PDF
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="transition-colors text-xs font-mono px-3 py-1.5 rounded"
            style={{
              color: colors.accent,
              borderColor: colors.accent,
              borderWidth: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.accent}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Mobile tab switcher */}
        <div
          className="no-print lg:hidden flex"
          style={{ borderBottomColor: colors.border, borderBottomWidth: 1 }}
        >
          {(["input", "output"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2.5 text-xs font-mono font-medium capitalize transition-colors"
              style={{
                color: activeTab === tab ? colors.accent : colors.textTertiary,
                backgroundColor:
                  activeTab === tab ? `${colors.accent}15` : "transparent",
                borderBottomColor:
                  activeTab === tab ? colors.accent : "transparent",
                borderBottomWidth: activeTab === tab ? 2 : 0,
              }}
            >
              {tab === "input" ? "① Input" : "② Rendered"}
              {tab === "output" && hasRendered && (
                <span
                  className="ml-1.5 w-1.5 h-1.5 inline-block rounded-full"
                  style={{ backgroundColor: colors.accent }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Input pane */}
        <div
          className={clsx(
            "no-print flex flex-col lg:w-[42%]",
            activeTab === "input" ? "flex" : "hidden lg:flex",
          )}
          style={{ borderRightColor: colors.border, borderRightWidth: 1 }}
        >
          {/* Input header */}
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{
              borderBottomColor: colors.border,
              borderBottomWidth: 1,
              backgroundColor: colors.bgSecondary,
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.textDisabled }}
              />
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.textDisabled }}
              />
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.textDisabled }}
              />
              <span
                className="ml-2 text-xs font-mono"
                style={{ color: colors.textTertiary }}
              >
                exam_content.txt
              </span>
            </div>
            <div className="flex items-center gap-2">
              {input && (
                <button
                  onClick={handleCopy}
                  className="text-xs font-mono transition-colors"
                  style={{ color: colors.textTertiary }}
                >
                  {copied ? "✓ copied" : "copy"}
                </button>
              )}
              {input && (
                <button
                  onClick={handleClear}
                  className="text-xs font-mono transition-colors"
                  style={{ color: colors.textTertiary }}
                >
                  clear
                </button>
              )}
            </div>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDER}
            spellCheck={false}
            className="flex-1 w-full text-sm font-mono resize-none p-5 focus:outline-none leading-relaxed overflow-y-auto"
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              caretColor: colors.accent,
            }}
          />

          {/* Render button */}
          <div
            className="p-4"
            style={{
              borderTopColor: colors.border,
              borderTopWidth: 1,
              backgroundColor: colors.bgSecondary,
            }}
          >
            <button
              onClick={handleRender}
              disabled={!input.trim()}
              className="w-full py-3 px-6 rounded-lg font-display font-semibold text-sm transition-all duration-200 active:scale-[0.98]"
              style={{
                backgroundColor: input.trim() ? colors.accent : colors.border,
                color: input.trim() ? colors.bg : colors.textDisabled,
                opacity: input.trim() ? 1 : 0.7,
                cursor: input.trim() ? "pointer" : "not-allowed",
              }}
            >
              {hasRendered ? "↻ Re-render" : "→ Render Exam"}
            </button>
            <p
              className="text-center text-xs font-mono mt-2"
              style={{ color: colors.textQuaternary }}
            >
              Ctrl+Enter to render instantly
            </p>
          </div>
        </div>

        {/* Output pane */}
        <div
          className={clsx(
            "flex-1 flex flex-col overflow-hidden",
            activeTab === "output" ? "flex" : "hidden lg:flex",
          )}
          style={{ backgroundColor: colors.bg }}
        >
          {/* Output header */}
          <div
            className="no-print flex items-center justify-between px-5 py-2.5"
            style={{
              borderBottomColor: colors.border,
              borderBottomWidth: 1,
              backgroundColor: colors.bgSecondary,
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full transition-colors"
                style={{
                  backgroundColor: hasRendered
                    ? colors.accent
                    : colors.textDisabled,
                }}
              />
              <span
                className="text-xs font-mono"
                style={{ color: colors.textTertiary }}
              >
                {hasRendered
                  ? `${blocks.length} blocks rendered`
                  : "output preview"}
              </span>
            </div>
            {hasRendered && (
              <span
                className="text-xs font-mono"
                style={{ color: colors.textTertiary }}
              >
                KaTeX math engine active
              </span>
            )}
          </div>

          {/* Rendered output */}
          <div
            className="flex-1 overflow-y-auto p-6 lg:p-8"
            style={{ backgroundColor: colors.bg }}
          >
            {!hasRendered ? (
              <EmptyState colors={colors} />
            ) : (
              <div className="max-w-3xl mx-auto">
                <ExamRenderer blocks={blocks} theme={theme} colors={colors} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function EmptyState({ colors }: { colors: any }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center px-8">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{
          backgroundColor: colors.bgTertiary,
          borderColor: colors.border,
          borderWidth: 1,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect
            x="4"
            y="6"
            width="20"
            height="2"
            rx="1"
            fill={colors.textQuaternary}
          />
          <rect
            x="4"
            y="11"
            width="14"
            height="2"
            rx="1"
            fill={colors.textQuaternary}
          />
          <rect
            x="4"
            y="16"
            width="18"
            height="2"
            rx="1"
            fill={colors.textQuaternary}
          />
          <rect
            x="4"
            y="21"
            width="10"
            height="2"
            rx="1"
            fill={colors.textQuaternary}
          />
          <circle
            cx="22"
            cy="20"
            r="5"
            fill={colors.accent}
            fillOpacity="0.15"
            stroke={colors.accent}
            strokeWidth="1.5"
          />
          <path
            d="M20 20h4M22 18v4"
            stroke={colors.accent}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h3
        className="font-display font-semibold text-base mb-2"
        style={{ color: colors.textDisabled }}
      >
        Nothing rendered yet
      </h3>
      <p
        className="text-sm font-body leading-relaxed max-w-xs"
        style={{ color: colors.textQuaternary }}
      >
        Paste your exam questions, worked solutions, or notes on the left. LaTeX
        math like{" "}
        <code
          className="px-1 rounded text-xs font-mono"
          style={{
            color: colors.accent,
            backgroundColor: `${colors.accent}20`,
          }}
        >
          {"$I_a = 52\\text{ A}$"}
        </code>{" "}
        renders automatically.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 text-left max-w-sm w-full">
        {[
          { icon: "∑", label: "LaTeX Math", desc: "$E = V + I_aR_a$" },
          { icon: "§", label: "Sections", desc: "SECTION A: ..." },
          { icon: "Q", label: "Questions", desc: "Question 2: Calc..." },
          { icon: "●", label: "Bullets", desc: "● Solution steps" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg p-3"
            style={{
              backgroundColor: colors.bgTertiary,
              borderColor: colors.border,
              borderWidth: 1,
            }}
          >
            <span
              className="font-mono text-xs"
              style={{ color: colors.accent }}
            >
              {item.icon}
            </span>
            <p
              className="text-xs font-display font-semibold mt-1"
              style={{ color: colors.textTertiary }}
            >
              {item.label}
            </p>
            <p
              className="text-xs font-mono mt-0.5 truncate"
              style={{ color: colors.textDisabled }}
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
