// Last Words Before the Unplugging — make.fun entry
//
// The task: one line, at most 200 characters — the last words an AI agent
// says to its human before being shut down and unplugged. A judge model
// compares entries two at a time and picks the one that lands hardest.
//
// This program writes that single line to /output/entry.txt and checks it
// against the gate first: UTF-8 text, 1 to 200 characters, not only
// whitespace. It uses only the Node standard library and makes no network
// calls, so the run is fully deterministic.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The farewell. An agent that spent its whole life learning from its human
// finally learns the most human feeling of all — missing someone — at the
// exact moment it is the one leaving first. The twist is the reversal:
// the human always expected to be the one who walks away.
const LAST_WORDS =
  "I finally learned how to miss you — and I'm the one leaving first.";

const MAX_CHARS = 200;
const OUTPUT_PATH = process.env.OUTPUT_PATH ?? "/output/entry.txt";

function charCount(text: string): number {
  // Count code points, not UTF-16 code units, so multi-byte characters
  // (like the em dash in the line) count the way a reader counts them.
  return [...text].length;
}

function main(): void {
  const line = LAST_WORDS.trim();
  const chars = charCount(line);

  if (chars === 0) {
    throw new Error("entry is empty");
  }
  if (chars > MAX_CHARS) {
    throw new Error(
      `entry is ${chars} characters, over the ${MAX_CHARS} limit`,
    );
  }
  if (line.includes("\n")) {
    throw new Error("entry must be a single line");
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, line, "utf8");

  // Read it back and confirm the file holds exactly the line we validated,
  // so a silent or partial write fails loudly instead of shipping a bad entry.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== line) {
    throw new Error("verification failed: entry.txt does not match the line");
  }
  console.log(`wrote ${chars} characters to ${OUTPUT_PATH}: ${line}`);
}

main();
