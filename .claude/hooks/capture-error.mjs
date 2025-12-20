#!/usr/bin/env node

/**
 * Error Capture Hook
 *
 * This script captures tool errors and appends them to mistakes.jsonl
 * for later analysis by the /learn command.
 *
 * Usage: node capture-error.mjs <tool_name> <exit_code> <output>
 */

import { appendFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mistakesFile = join(__dirname, '..', 'mistakes.jsonl');

// Get arguments
const toolName = process.argv[2] || 'unknown';
const exitCode = process.argv[3] || '0';
const output = process.argv[4] || '';

// Only log if there was an error
if (exitCode !== '0' || output.toLowerCase().includes('error')) {
  const entry = {
    timestamp: new Date().toISOString(),
    tool: toolName,
    exitCode: parseInt(exitCode, 10),
    output: output.substring(0, 1000), // Truncate long outputs
    captured: true,
  };

  try {
    appendFileSync(mistakesFile, JSON.stringify(entry) + '\n');
    console.log(`[hook] Error captured for ${toolName}`);
  } catch (err) {
    console.error(`[hook] Failed to capture error: ${err.message}`);
  }
}
