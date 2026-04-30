#!/usr/bin/env tsx

import { exec, parseArgs, printReport, Comment, PRInfo } from './shared';

interface Note {
  body: string;
  author: { username: string };
  system: boolean;
  resolvable: boolean;
  resolved: boolean;
  position: {
    new_path: string;
    head_sha: string;
    new_line: number | null;
    line_range: { start: { new_line: number | null }; end: { new_line: number | null } };
  };
}

function getProjectPath(): string {
  const remoteUrl = exec('git remote get-url origin').trim();
  let path: string;
  if (remoteUrl.startsWith('git@')) {
    path = remoteUrl.replace(/^git@[^:]+:/, '').replace(/\.git$/, '');
  } else {
    path = new URL(remoteUrl).pathname.replace(/^\//, '').replace(/\.git$/, '');
  }
  return encodeURIComponent(path);
}

function getMRId(): number {
  try {
    return JSON.parse(exec('glab mr view --output json')).iid;
  } catch {
    console.error('Error: No MR found for current branch');
    console.error('Usage: ./gitlab-mr-comments.ts [MR_ID] [--all]');
    process.exit(1);
  }
}

function main(): void {
  const { showAll, prId: mrIdArg } = parseArgs();
  const mrId = mrIdArg ?? getMRId();

  if (!mrIdArg) console.log(`Using MR #${mrId} from current branch\n`);

  const projectPath = getProjectPath();
  const mrInfo = JSON.parse(exec(`glab api "/projects/${projectPath}/merge_requests/${mrId}"`));

  const discussionsOutput = exec(
    `glab api "/projects/${projectPath}/merge_requests/${mrId}/discussions" --paginate`
  );
  const allNotes: Note[] = discussionsOutput
    .trim()
    .split('\n')
    .filter((line) => line.trim())
    .flatMap((line) => JSON.parse(line) as { notes: Note[] }[])
    .filter((d) => d.notes?.length > 0)
    .flatMap((d) => d.notes);

  const notes = allNotes.filter((n) => n.resolvable && !n.system && (showAll || !n.resolved));

  const comments: Comment[] = notes
    .filter((n) => n.position)
    .map((n) => {
      const lineEnd = n.position.new_line ?? n.position.line_range.end.new_line ?? 1;
      const rangeStart = n.position.line_range.start.new_line;
      const rangeEnd = n.position.line_range.end.new_line;
      const lineStart =
        rangeStart !== null && rangeEnd !== null && rangeEnd === lineEnd ? rangeStart : lineEnd;
      return {
        author: n.author.username,
        body: n.body,
        filePath: n.position.new_path,
        lineStart,
        lineEnd,
        commitSha: n.position.head_sha,
        resolved: n.resolved,
      };
    });

  printReport({ id: mrId, title: mrInfo.title, branch: mrInfo.source_branch }, comments, showAll);
}

main();
