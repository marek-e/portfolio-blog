#!/usr/bin/env tsx

import { exec, parseArgs, printReport, Comment, PRInfo } from './shared';

interface GHReviewComment {
  user: { login: string };
  body: string;
  path: string;
  line: number | null;
  start_line: number | null;
  commit_id: string;
}

interface GHPRInfo {
  number: number;
  title: string;
  headRefName: string;
}

function getPRId(): number {
  try {
    const output = exec('gh pr view --json number');
    return (JSON.parse(output) as { number: number }).number;
  } catch {
    console.error('Error: No PR found for current branch');
    console.error('Usage: ./github-pr-comments.ts [PR_NUMBER] [--all]');
    process.exit(1);
  }
}

function main(): void {
  const { showAll, prId: prIdArg } = parseArgs();
  const prId = prIdArg ?? getPRId();

  if (!prIdArg) console.log(`Using PR #${prId} from current branch\n`);

  // Get PR info
  const prInfo = JSON.parse(exec(`gh pr view ${prId} --json number,title,headRefName`)) as GHPRInfo;

  // Get review comments (these are the inline code comments)
  const reviewComments = JSON.parse(exec(`gh api repos/{owner}/{repo}/pulls/${prId}/comments --paginate`)) as GHReviewComment[];

  // GitHub doesn't have a "resolved" concept for review comments, but we can check if they're part of a resolved review thread
  // For simplicity, we'll treat all comments as unresolved unless --all is passed
  const comments: Comment[] = reviewComments
    .filter((c) => c.path && c.line)
    .map((c) => ({
      author: c.user.login,
      body: c.body,
      filePath: c.path,
      lineStart: c.start_line ?? c.line!,
      lineEnd: c.line!,
      commitSha: c.commit_id,
      resolved: false,
    }));

  const filtered = showAll ? comments : comments.filter((c) => !c.resolved);

  printReport(
    { id: prInfo.number, title: prInfo.title, branch: prInfo.headRefName },
    filtered,
    showAll
  );
}

main();
