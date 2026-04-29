#!/usr/bin/env tsx

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
};

const projectRoot = path.resolve(__dirname, "..");
const claudeProjectPath = `${process.env.HOME}/.claude/projects/${projectRoot.replace(/\//g, "-")}`;

// Parse arguments
const args = process.argv.slice(2);
const targetDirArg = args[0];

if (!targetDirArg) {
  console.error(
    `${colors.red}Error: target directory is required${colors.reset}`,
  );
  console.error(`Usage: ${process.argv[1]} <target-dir>`);
  process.exit(1);
}

const targetDir = path.isAbsolute(targetDirArg)
  ? targetDirArg
  : path.join(projectRoot, targetDirArg);

interface ContentBlock {
  type: string;
  text?: string;
  name?: string;
  id?: string; // tool_use id
  input?: unknown;
  content?: string;
  is_error?: boolean;
  tool_use_id?: string;
}

interface ToolUseRecord {
  name: string;
  input: unknown;
  requiresApproval: boolean;
}

// Tools that require user approval before execution
const APPROVAL_REQUIRED_TOOLS = new Set(["Write", "Edit", "Bash"]);

interface Message {
  message?: {
    role?: string;
    content?: string | ContentBlock[];
  };
  timestamp?: string;
  gitBranch?: string;
  sessionId?: string;
}

interface ConversationStats {
  uuid: string;
  firstTimestamp: string;
  lastTimestamp: string;
  branch: string;
  userMessages: number;
  assistantMessages: number;
  toolCalls: Record<string, number>;
}

function getFileExtension(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase() || "";
  const langMap: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    rb: "ruby",
    py: "python",
    json: "json",
    md: "markdown",
    yml: "yaml",
    yaml: "yaml",
    sh: "bash",
    css: "css",
    scss: "scss",
    html: "html",
    sql: "sql",
  };
  return langMap[ext] || ext;
}

function formatRejectedToolInput(name: string, input: unknown): string {
  // For Write/Edit, show file path in header + code block
  if (name === "Write" && typeof input === "object" && input !== null) {
    const { file_path, content } = input as {
      file_path?: string;
      content?: string;
    };
    const lang = getFileExtension(file_path || "");
    return `\`${file_path}\`
\`\`\`${lang}
${content}
\`\`\``;
  }
  if (name === "Edit" && typeof input === "object" && input !== null) {
    const { file_path, old_string, new_string } = input as {
      file_path?: string;
      old_string?: string;
      new_string?: string;
    };
    return `\`${file_path}\`
\`\`\`diff
- ${old_string?.split("\n").join("\n- ")}
+ ${new_string?.split("\n").join("\n+ ")}
\`\`\``;
  }
  // For Bash, show the command
  if (name === "Bash" && typeof input === "object" && input !== null) {
    const { command, description } = input as {
      command?: string;
      description?: string;
    };
    return `${description || ""}
\`\`\`bash
${command}
\`\`\``;
  }
  // For other tools, show truncated JSON
  const inp = JSON.stringify(input);
  return inp.length > 500 ? inp.slice(0, 500) + "..." : inp;
}

function formatApprovedTool(name: string, input: unknown): string {
  // For approved tools, just show a brief summary
  if (name === "Write" && typeof input === "object" && input !== null) {
    const { file_path } = input as { file_path?: string };
    return `${file_path}`;
  }
  if (name === "Edit" && typeof input === "object" && input !== null) {
    const { file_path } = input as { file_path?: string };
    return `${file_path}`;
  }
  if (name === "Bash" && typeof input === "object" && input !== null) {
    const { command, description } = input as {
      command?: string;
      description?: string;
    };
    // Show full command - no truncation
    return description ? `${description}: \`${command}\`` : `\`${command}\``;
  }
  return "";
}

function parseConversation(
  filePath: string,
  uuid: string,
): { stats: ConversationStats; content: string } {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n").filter((l) => l.trim());
  const messages: string[] = [];
  let firstTimestamp = "";
  let lastTimestamp = "";
  const branchCounts: Record<string, number> = {};
  let userMessages = 0;
  let assistantMessages = 0;
  const toolCalls: Record<string, number> = {};

  // Track pending tool uses by ID to link with results
  const pendingToolUses = new Map<string, ToolUseRecord>();

  for (const line of lines) {
    try {
      const obj: Message = JSON.parse(line);

      if (obj.timestamp) {
        if (!firstTimestamp) firstTimestamp = obj.timestamp;
        lastTimestamp = obj.timestamp;
      }

      if (obj.gitBranch) {
        branchCounts[obj.gitBranch] = (branchCounts[obj.gitBranch] || 0) + 1;
      }

      const msg = obj.message;
      if (!msg?.role) continue;

      if (msg.role === "user") userMessages++;
      if (msg.role === "assistant") assistantMessages++;

      let text = "";
      if (typeof msg.content === "string") {
        text = msg.content;
      } else if (Array.isArray(msg.content)) {
        const textParts = msg.content
          .filter((b) => b.type === "text" && b.text)
          .map((b) => b.text)
          .join("\n");

        // Process tool_use blocks and track them
        const toolParts = msg.content
          .filter((b) => b.type === "tool_use")
          .map((b) => {
            toolCalls[b.name!] = (toolCalls[b.name!] || 0) + 1;
            const requiresApproval = APPROVAL_REQUIRED_TOOLS.has(b.name!);

            // Store for later linking with tool_result
            if (b.id) {
              pendingToolUses.set(b.id, {
                name: b.name!,
                input: b.input,
                requiresApproval,
              });
            }

            // For non-approval tools, show truncated version
            // Approval tools will be shown when we see the result
            if (!requiresApproval) {
              const inp = JSON.stringify(b.input);
              const truncated =
                inp.length > 300 ? inp.slice(0, 300) + "..." : inp;
              return `\n[TOOL] ${b.name}: ${truncated}`;
            }
            // Mark approval-required tools as pending
            return `\n[TOOL:PENDING] ${b.name}`;
          })
          .join("");

        // Handle tool_result blocks from user
        const toolResultParts = msg.content
          .filter((b) => b.type === "tool_result")
          .map((b) => {
            const toolUseId = b.tool_use_id;
            const pendingTool = toolUseId
              ? pendingToolUses.get(toolUseId)
              : null;
            const isRejection = b.is_error === true;

            // Clean up pending tool
            if (toolUseId) pendingToolUses.delete(toolUseId);

            if (isRejection && pendingTool?.requiresApproval) {
              // This is a rejection of an approval-required tool
              const content = b.content || "";
              const userSaidMatch = content.match(/the user said:\s*(.*)$/is);
              const userFeedback = userSaidMatch
                ? userSaidMatch[1].trim()
                : null;

              const formattedInput = formatRejectedToolInput(
                pendingTool.name,
                pendingTool.input,
              );

              const feedbackBlock = userFeedback
                ? `\n\n**User feedback:**\n> ${userFeedback.split("\n").join("\n> ")}`
                : "\n\n*Silent rejection - no feedback provided*";

              return `\n### [REJECTED] ${pendingTool.name}\n${formattedInput}${feedbackBlock}`;
            }

            if (pendingTool?.requiresApproval && !isRejection) {
              // Approved tool - just show brief info
              const summary = formatApprovedTool(
                pendingTool.name,
                pendingTool.input,
              );
              return `\n[APPROVED] ${pendingTool.name}: ${summary}`;
            }

            // Non-approval tool result or no matching tool - skip
            return "";
          })
          .filter(Boolean)
          .join("");

        text = textParts + toolParts + toolResultParts;
      }

      if (text.trim()) {
        const emoji = msg.role === "user" ? "🧑" : "🤖";
        messages.push(`\n=== ${emoji} ${msg.role.toUpperCase()} ===\n${text}`);
      }
    } catch {
      // Skip invalid JSON lines
    }
  }

  // Find branch with most messages
  const branch =
    Object.entries(branchCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "unknown";

  const stats: ConversationStats = {
    uuid,
    firstTimestamp,
    lastTimestamp,
    branch,
    userMessages,
    assistantMessages,
    toolCalls,
  };

  return { stats, content: messages.join("\n") };
}

function formatHeader(stats: ConversationStats): string {
  const duration = (() => {
    const start = new Date(stats.firstTimestamp).getTime();
    const end = new Date(stats.lastTimestamp).getTime();
    const mins = Math.round((end - start) / 60000);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h${remainingMins}m`;
  })();

  const topTools = Object.entries(stats.toolCalls)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => `${name}(${count})`)
    .join(", ");

  return `# Conversation ${stats.uuid}
# Branch: ${stats.branch}
# Started: ${stats.firstTimestamp}
# Ended: ${stats.lastTimestamp}
# Duration: ${duration}
# Messages: ${stats.userMessages} user, ${stats.assistantMessages} assistant
# Top tools: ${topTools || "none"}
${"#".repeat(80)}
`;
}

function getSkippedFile(): string {
  return path.join(targetDir, ".skipped");
}

function loadSkippedUuids(): Set<string> {
  const skippedFile = getSkippedFile();
  if (!fs.existsSync(skippedFile)) return new Set();
  return new Set(
    fs
      .readFileSync(skippedFile, "utf-8")
      .split("\n")
      .filter((l) => l.trim()),
  );
}

function saveSkippedUuid(uuid: string): void {
  const skippedFile = getSkippedFile();
  fs.mkdirSync(path.dirname(skippedFile), { recursive: true });
  fs.appendFileSync(skippedFile, uuid + "\n");
}

// Returns a map of uuid -> set of exported timestamps
function findExportedConversations(): Map<string, Set<string>> {
  const exported = new Map<string, Set<string>>();

  if (!fs.existsSync(targetDir)) return exported;

  function scan(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        scan(path.join(dir, entry.name));
      } else if (entry.name.endsWith(".md") || entry.name.endsWith(".txt")) {
        // Extract timestamp and UUID from filename: yyyy-mm-dd-hh-ii-ss-{uuid-prefix}.md (or .txt for legacy)
        const match = entry.name.match(
          /^(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})-([a-f0-9]{8})\.(md|txt)$/,
        );
        if (match) {
          const timestamp = match[1];
          const prefix = match[2];
          // Find full UUID by matching prefix
          const files = fs
            .readdirSync(claudeProjectPath)
            .filter((f) => f.startsWith(prefix) && f.endsWith(".jsonl"));
          for (const f of files) {
            const uuid = f.replace(".jsonl", "");
            if (!exported.has(uuid)) {
              exported.set(uuid, new Set());
            }
            exported.get(uuid)!.add(timestamp);
          }
        }
      }
    }
  }

  scan(targetDir);
  return exported;
}

function formatTimestamp(isoTimestamp: string): string {
  // Convert 2025-11-20T10:00:27.914Z to 2025-11-20-10-00-27
  return isoTimestamp
    .replace("T", "-")
    .replace(/:/g, "-")
    .replace(/\.\d+Z$/, "");
}

function getLastTimestampFromFile(filePath: string): string {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n").filter((l) => l.trim());
  let lastTimestamp = "";

  for (const line of lines) {
    try {
      const obj: Message = JSON.parse(line);
      if (obj.timestamp) {
        lastTimestamp = obj.timestamp;
      }
    } catch {
      // Skip invalid JSON lines
    }
  }

  return lastTimestamp;
}

function sanitizeBranchName(branch: string): string {
  return branch.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");
}

function getGitUsername(): string {
  try {
    const email = execSync("git config user.email", {
      encoding: "utf-8",
    }).trim();
    const username = email.split("@")[0];
    return username || "unknown";
  } catch {
    return "unknown";
  }
}

function main() {
  console.log(`${colors.yellow}Export Claude History${colors.reset}`);
  console.log(`Target: ${targetDir}\n`);

  if (!fs.existsSync(claudeProjectPath)) {
    console.error(
      `${colors.red}Error: Claude project path not found: ${claudeProjectPath}${colors.reset}`,
    );
    process.exit(1);
  }

  // Get all conversation files (exclude agent files)
  const allFiles = fs
    .readdirSync(claudeProjectPath)
    .filter((f) => f.endsWith(".jsonl") && !f.startsWith("agent-"));

  // Find already exported conversations (uuid -> set of timestamps)
  const exportedConversations = findExportedConversations();
  const skippedUuids = loadSkippedUuids();

  // Build list of conversations to export (check uuid + timestamp)
  const toExport: Array<{ uuid: string; timestamp: string }> = [];

  for (const file of allFiles) {
    const uuid = file.replace(".jsonl", "");
    if (skippedUuids.has(uuid)) continue;

    const sourceFile = path.join(claudeProjectPath, file);
    const lastTimestamp = getLastTimestampFromFile(sourceFile);
    const formattedTimestamp = formatTimestamp(lastTimestamp);

    const exportedTimestamps = exportedConversations.get(uuid);
    if (!exportedTimestamps || !exportedTimestamps.has(formattedTimestamp)) {
      toExport.push({ uuid, timestamp: lastTimestamp });
    }
  }

  console.log(
    `Found ${allFiles.length} conversations, ${exportedConversations.size} with exports`,
  );
  console.log(`${colors.cyan}To export: ${toExport.length}${colors.reset}\n`);

  if (toExport.length === 0) {
    console.log(`${colors.green}Nothing to export${colors.reset}`);
    return;
  }

  const username = getGitUsername();

  for (const { uuid, timestamp } of toExport) {
    const sourceFile = path.join(claudeProjectPath, `${uuid}.jsonl`);
    console.log(`${colors.dim}Processing ${uuid}...${colors.reset}`);

    try {
      const { stats, content } = parseConversation(sourceFile, uuid);

      if (!content.trim()) {
        console.log(
          `  ${colors.yellow}Skipping: empty conversation${colors.reset}`,
        );
        saveSkippedUuid(uuid);
        continue;
      }

      const prefix = uuid.split("-")[0];
      const sanitizedBranch = sanitizeBranchName(stats.branch);
      const formattedTimestamp = formatTimestamp(stats.lastTimestamp);
      const fileName = `${formattedTimestamp}-${prefix}.md`;
      const branchDir = path.join(targetDir, username, sanitizedBranch);
      const targetFile = path.join(branchDir, fileName);

      const header = formatHeader(stats);
      fs.mkdirSync(branchDir, { recursive: true });
      fs.writeFileSync(targetFile, header + content);

      console.log(
        `  ${colors.green}Exported: ${username}/${sanitizedBranch}/${fileName}${colors.reset}`,
      );
    } catch (error) {
      console.error(`  ${colors.red}Error: ${error}${colors.reset}`);
    }
  }

  console.log(`\n${colors.green}Done${colors.reset}`);
}

main();
