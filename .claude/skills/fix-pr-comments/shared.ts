import { execSync } from 'child_process';

export interface Comment {
  author: string;
  body: string;
  filePath: string;
  lineStart: number;
  lineEnd: number;
  commitSha: string;
  resolved: boolean;
}

export interface PRInfo {
  id: number;
  title: string;
  branch: string;
}

export function exec(command: string): string {
  return execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
}

export function getCodeContext(hash: string, filePath: string, lineStart: number, lineEnd: number): string | null {
  try {
    const contextStart = Math.max(1, lineStart - 5);
    const lines = exec(`git show "${hash}:${filePath}"`).split('\n');

    return lines
      .slice(contextStart - 1, lineEnd + 2)
      .map((line, idx) => {
        const lineNum = contextStart + idx;
        const marker = lineNum >= lineStart && lineNum <= lineEnd ? '>>>' : '   ';
        return `${marker} ${lineNum.toString().padStart(4)}: ${line}`;
      })
      .join('\n');
  } catch {
    return null;
  }
}

export function printReport(prInfo: PRInfo, comments: Comment[], showAll: boolean): void {
  console.log('═'.repeat(71));
  console.log(showAll ? 'PULL REQUEST COMMENTS' : 'UNRESOLVED PULL REQUEST COMMENTS');
  console.log('═'.repeat(71));
  console.log('');
  console.log(`This report shows ${showAll ? 'all' : 'unresolved'} code review comments.`);
  console.log('Each comment includes the file location, line numbers, the reviewer\'s feedback,');
  console.log('and surrounding code context to understand what needs to be addressed.');
  console.log('');
  console.log(`PR #${prInfo.id}: ${prInfo.title}`);
  console.log(`Branch: ${prInfo.branch}`);
  console.log('');

  if (comments.length === 0) {
    console.log(showAll ? '✅ No comments found!\n' : '✅ No unresolved comments found!\n');
    return;
  }

  for (const comment of comments) {
    const fileName = comment.filePath.split('/').pop() || comment.filePath;
    const lineDisplay = comment.lineStart === comment.lineEnd ? `:${comment.lineStart}` : `:${comment.lineStart}-${comment.lineEnd}`;

    console.log('━'.repeat(68));
    const resolvedStatus = comment.resolved ? '  ✓ RESOLVED' : '';
    console.log(`${fileName}${lineDisplay}  •  Reviewer: @${comment.author}  •  ${comment.commitSha.substring(0, 7)}${resolvedStatus}`);
    console.log('');
    console.log('<comment>');
    console.log(comment.body);
    console.log('</comment>');
    console.log('');

    const codeContext = getCodeContext(comment.commitSha, comment.filePath, comment.lineStart, comment.lineEnd);
    if (codeContext) {
      console.log('<code>');
      console.log(codeContext);
      console.log('</code>');
    }
    console.log('');
  }

  console.log('═'.repeat(71));
  const unresolvedCount = comments.filter((c) => !c.resolved).length;
  const resolvedCount = comments.filter((c) => c.resolved).length;

  if (showAll) {
    console.log(`SUMMARY: ${comments.length} comments in total (${unresolvedCount} unresolved, ${resolvedCount} resolved)`);
  } else {
    console.log(`SUMMARY: ${comments.length} unresolved comments in total`);
  }
}

export function parseArgs(): { showAll: boolean; prId: number | null } {
  const args = process.argv.slice(2);
  const showAll = args.includes('--all');
  const prIdArg = args.find((arg) => !arg.startsWith('--'));
  return { showAll, prId: prIdArg ? parseInt(prIdArg, 10) : null };
}
