// Parser: converts raw pasted exam text into structured blocks

export type BlockType =
  | "section_header" // === SECTION A: DC MACHINES ===
  | "question_header" // Question 2: Calculations
  | "sub_question" // a) b) c)
  | "bullet" // ● bullet point
  | "equation_block" // $$...$$
  | "paragraph" // plain text / mixed inline math
  | "given_line" // lines starting with Given:
  | "answer_header" // ANSWER KEY lines
  | "divider"; // --- or ===

export interface ParsedBlock {
  id: string;
  type: BlockType;
  raw: string;
  content: string; // cleaned content (may still have inline $...$)
  depth?: number; // for sub-questions
  label?: string; // "a)", "Q2", etc.
}

// Regex patterns
const PATTERNS = {
  sectionHeader:
    /^(SECTION\s+[A-Z]+\s*:.*|ANSWER\s+KEY.*|APPLIED\s+ELECTRICITY.*|PRACTICE\s+EXAM.*)/i,
  questionHeader: /^(Question\s+\d+\s*:\s*.+)/i,
  subQuestion: /^([a-z]\))\s+(.+)/,
  bullet: /^[●•\-\*]\s*(.+)/,
  equationBlock: /^\$\$(.+)\$\$$/,
  given: /^Given\s*:/i,
  divider: /^[-=]{3,}$/,
  answerHeader:
    /^(SECTION\s+[A-Z]+\s*:.*SOLUTIONS?|Question\s+\d+\s*:\s*(Theory|Calculation)\s+Solutions?)/i,
};

let idCounter = 0;
function makeId() {
  return `block-${++idCounter}`;
}

export function parseExamContent(raw: string): ParsedBlock[] {
  idCounter = 0;
  const lines = raw.split("\n");
  const blocks: ParsedBlock[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }

    // Divider
    if (PATTERNS.divider.test(line)) {
      blocks.push({ id: makeId(), type: "divider", raw: line, content: "" });
      i++;
      continue;
    }

    // Section header / answer key header
    if (PATTERNS.sectionHeader.test(line)) {
      blocks.push({
        id: makeId(),
        type: "section_header",
        raw: line,
        content: line,
      });
      i++;
      continue;
    }

    // Question header
    if (PATTERNS.questionHeader.test(line)) {
      blocks.push({
        id: makeId(),
        type: "question_header",
        raw: line,
        content: line,
      });
      i++;
      continue;
    }

    // Display equation block  $$...$$
    if (line.startsWith("$$") && line.endsWith("$$") && line.length > 4) {
      blocks.push({
        id: makeId(),
        type: "equation_block",
        raw: line,
        content: line.slice(2, -2).trim(),
      });
      i++;
      continue;
    }

    // Multi-line display equation
    if (line === "$$") {
      let eqLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "$$") {
        eqLines.push(lines[i]);
        i++;
      }
      i++; // skip closing $$
      blocks.push({
        id: makeId(),
        type: "equation_block",
        raw: eqLines.join("\n"),
        content: eqLines.join("\n").trim(),
      });
      continue;
    }

    // Given line
    if (PATTERNS.given.test(line)) {
      // Collect multi-line Given: content until next block
      let givenLines = [line];
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        if (!nextLine) {
          j++;
          continue;
        }
        // Stop if we hit a new block type
        if (
          PATTERNS.subQuestion.test(nextLine) ||
          PATTERNS.bullet.test(nextLine) ||
          PATTERNS.sectionHeader.test(nextLine) ||
          PATTERNS.questionHeader.test(nextLine)
        ) {
          break;
        }
        givenLines.push(nextLine);
        j++;
      }
      blocks.push({
        id: makeId(),
        type: "given_line",
        raw: givenLines.join("\n"),
        content: givenLines.join(" ").trim(),
      });
      i = j;
      continue;
    }

    // Bullet point
    const bulletMatch = line.match(PATTERNS.bullet);
    if (bulletMatch) {
      // Collect multi-line bullet content
      let bulletLines = [bulletMatch[1]];
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        if (!nextLine) {
          j++;
          continue;
        }
        // Stop if we hit a new block type
        if (
          PATTERNS.bullet.test(nextLine) ||
          PATTERNS.subQuestion.test(nextLine) ||
          PATTERNS.sectionHeader.test(nextLine) ||
          PATTERNS.questionHeader.test(nextLine)
        ) {
          break;
        }
        bulletLines.push(nextLine);
        j++;
      }
      blocks.push({
        id: makeId(),
        type: "bullet",
        raw: bulletLines.join("\n"),
        content: bulletLines.join(" ").trim(),
      });
      i = j;
      continue;
    }

    // Sub-question a) b) c)
    const subMatch = line.match(PATTERNS.subQuestion);
    if (subMatch) {
      // Collect multi-line sub-question content
      let subLines = [subMatch[2]];
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        if (!nextLine) {
          j++;
          continue;
        }
        // Stop if we hit a new sub-question, bullet, or section
        if (
          PATTERNS.subQuestion.test(nextLine) ||
          PATTERNS.bullet.test(nextLine) ||
          PATTERNS.sectionHeader.test(nextLine) ||
          PATTERNS.questionHeader.test(nextLine) ||
          nextLine.startsWith("$$")
        ) {
          break;
        }
        subLines.push(nextLine);
        j++;
      }
      blocks.push({
        id: makeId(),
        type: "sub_question",
        raw: subLines.join("\n"),
        content: subLines.join(" ").trim(),
        label: subMatch[1],
      });
      i = j;
      continue;
    }

    // Default: paragraph (may have inline math)
    blocks.push({ id: makeId(), type: "paragraph", raw: line, content: line });
    i++;
  }

  return blocks;
}

// Splits a string by inline $...$ math and returns segments
export type TextSegment =
  | { kind: "text"; value: string }
  | { kind: "math"; value: string };

export function parseInlineMath(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  // Match $...$ but not $$...$$ (display)
  const regex = /\$([^$]+)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        kind: "text",
        value: text.slice(lastIndex, match.index),
      });
    }
    segments.push({ kind: "math", value: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ kind: "text", value: text.slice(lastIndex) });
  }

  return segments;
}
