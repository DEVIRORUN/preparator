// Quick test to verify parser works
import { parseExamContent } from "./src/app/_lib/parser.ts";

const testInput = `SECTION A: DC MACHINES
Question 1: What is a DC motor?
a) A rotating device
b) A static device

Given: V = 100V, I = 5A
- The motor is efficient
- Power = 500W

$$P = VI$$

ANSWER-BELOW

SECTION A: SOLUTIONS
Question 1: Answer
a) Correct, A DC motor is rotating`;

try {
  const blocks = parseExamContent(testInput);
  console.log("✓ Parser executed successfully");
  console.log(`✓ Generated ${blocks.length} blocks`);
  blocks.forEach((b, i) => {
    console.log(
      `  Block ${i}: type=${b.type}, content=${b.content.substring(0, 50)}`,
    );
  });
} catch (error) {
  console.error("✗ Parser error:", error);
  process.exit(1);
}
