"use client";

import { ParsedBlock } from "../app/_lib/parser";
import { InlineMathRenderer, BlockMathRenderer } from "./MathRenderer";

interface ExamRendererProps {
  blocks: ParsedBlock[];
  theme?: "light" | "dark";
  colors?: any;
}

// Section colors cycled by order - light and dark variants
const SECTION_COLORS_DARK = [
  { border: "#00d4aa", bg: "#00d4aa", text: "#00d4aa" },
  { border: "#818cf8", bg: "#818cf8", text: "#818cf8" },
  { border: "#f59e0b", bg: "#f59e0b", text: "#f59e0b" },
  { border: "#f472b6", bg: "#f472b6", text: "#f472b6" },
];

const SECTION_COLORS_LIGHT = [
  { border: "#0891b2", bg: "#0891b2", text: "#0891b2" },
  { border: "#6366f1", bg: "#6366f1", text: "#6366f1" },
  { border: "#d97706", bg: "#d97706", text: "#d97706" },
  { border: "#ec4899", bg: "#ec4899", text: "#ec4899" },
];

export default function ExamRenderer({
  blocks,
  theme = "dark",
  colors,
}: ExamRendererProps) {
  const isDark = theme === "dark";
  const sectionColors = isDark ? SECTION_COLORS_DARK : SECTION_COLORS_LIGHT;
  let sectionIndex = -1;
  let questionIndex = -1;

  const defaultColors = isDark
    ? {
        text: "#cbd5e1",
        textLight: "#e2e8f0",
        textBold: "#f1f5f9",
        accent: "#00d4aa",
        bgCard: "#0f1923",
        borderCard: "#1e3a4a",
        borderGray: "#1e1e2e",
      }
    : {
        text: "#0f172a",
        textLight: "#1e293b",
        textBold: "#0f172a",
        accent: "#0891b2",
        bgCard: "#f3f4f6",
        borderCard: "#d1d5db",
        borderGray: "#d1d5db",
      };

  const themeColors = colors || defaultColors;

  return (
    <div className="space-y-1 animate-fade-in">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "section_header": {
            sectionIndex++;
            const color = sectionColors[sectionIndex % sectionColors.length];
            return (
              <div
                key={block.id}
                className="section-block mt-8 mb-4 px-5 py-3 rounded-lg border-l-4"
                style={{
                  borderLeftColor: color.border,
                  backgroundColor: `${color.bg}15`,
                  animationDelay: `${idx * 0.03}s`,
                }}
              >
                <p
                  className="font-display font-bold text-sm tracking-[0.15em] uppercase"
                  style={{ color: color.text }}
                >
                  <InlineMathRenderer text={block.content} />
                </p>
              </div>
            );
          }

          case "question_header": {
            questionIndex++;
            return (
              <div
                key={block.id}
                className="section-block mt-6 mb-3 flex items-start gap-3"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <span
                  className="shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold"
                  style={{
                    backgroundColor: `${themeColors.accent}20`,
                    borderColor: `${themeColors.accent}60`,
                    borderWidth: 1,
                    color: themeColors.accent,
                  }}
                >
                  {questionIndex + 1}
                </span>
                <h3
                  className="font-display font-semibold text-base leading-tight"
                  style={{ color: themeColors.textBold }}
                >
                  <InlineMathRenderer text={block.content} />
                </h3>
              </div>
            );
          }

          case "sub_question": {
            return (
              <div
                key={block.id}
                className="section-block ml-9 mt-2 flex items-start gap-3 group"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <span
                  className="shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-semibold mt-0.5"
                  style={{
                    backgroundColor: themeColors.bgCard,
                    borderColor: themeColors.borderCard,
                    borderWidth: 1,
                    color: themeColors.accent,
                  }}
                >
                  {block.label?.replace(")", "")}
                </span>
                <p
                  className="text-sm leading-relaxed font-body"
                  style={{ color: themeColors.textLight }}
                >
                  <InlineMathRenderer text={block.content} />
                </p>
              </div>
            );
          }

          case "bullet": {
            return (
              <div
                key={block.id}
                className="section-block ml-4 mt-1.5 flex items-start gap-3"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <span
                  className="shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                  style={{
                    backgroundColor: `${themeColors.accent}99`,
                  }}
                />
                <p
                  className="text-sm leading-relaxed font-body"
                  style={{ color: themeColors.textLight }}
                >
                  <InlineMathRenderer text={block.content} />
                </p>
              </div>
            );
          }

          case "equation_block": {
            return (
              <div
                key={block.id}
                className="section-block ml-4 my-4"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <BlockMathRenderer math={block.content} />
              </div>
            );
          }

          case "given_line": {
            return (
              <div
                key={block.id}
                className="section-block ml-9 mt-3 mb-2 px-4 py-2.5 rounded-md"
                style={{
                  backgroundColor: themeColors.bgCard,
                  borderColor: themeColors.borderCard,
                  borderWidth: 1,
                  animationDelay: `${idx * 0.03}s`,
                }}
              >
                <p
                  className="text-xs font-mono leading-relaxed"
                  style={{ color: themeColors.accent }}
                >
                  <InlineMathRenderer text={block.content} />
                </p>
              </div>
            );
          }

          case "divider": {
            return (
              <hr
                key={block.id}
                style={{
                  borderColor: themeColors.borderGray,
                  margin: "1.5rem 0",
                }}
              />
            );
          }

          case "paragraph":
          default: {
            // Check if the line looks like a bold answer/result (contains **)
            const isResult = block.content.includes("**");
            const cleanContent = block.content.replace(/\*\*(.*?)\*\*/g, "$1");

            if (isResult) {
              return (
                <div
                  key={block.id}
                  className="section-block ml-4 mt-2"
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  <p
                    className="text-sm font-semibold leading-relaxed font-body"
                    style={{ color: themeColors.textBold }}
                  >
                    <InlineMathRenderer text={cleanContent} />
                  </p>
                </div>
              );
            }

            return (
              <div
                key={block.id}
                className="section-block ml-4 mt-2"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <p
                  className="text-sm leading-relaxed font-body"
                  style={{ color: themeColors.text }}
                >
                  <InlineMathRenderer text={block.content} />
                </p>
              </div>
            );
          }
        }
      })}
    </div>
  );
}
