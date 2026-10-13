import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright-core';

const FPS = 30;
const BAR = 240 / 95;

const { values } = parseArgs({
  options: {
    lang: { type: 'string', default: 'en' },
    out: { type: 'string' },
    music: { type: 'string' },
    stills: { type: 'string' },
  },
});

if (!values.out) {
  console.error(
    'Usage: pnpm motion:prompt-caching --lang en|fr --out <file.mp4> [--music <audio file>] [--stills 1.5,20,42]'
  );
  process.exit(1);
}

const pageUrl = pathToFileURL(
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'index.html')
);
pageUrl.search = `lang=${values.lang}`;

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' }
);
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});
await page.goto(pageUrl.href);
await page.evaluate(() => document.fonts.ready);
const duration = await page.evaluate(() => window.__duration);
const chapters = await page.evaluate(() => window.__chapters);
const renderAt = (t) => page.evaluate((x) => window.__render(x), t);

if (values.stills) {
  mkdirSync(values.out, { recursive: true });
  for (const t of values.stills.split(',').map(Number)) {
    await renderAt(t);
    await page.screenshot({ path: path.join(values.out, `${values.lang}-${t}.png`) });
  }
} else {
  const input = ['-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-'];
  const audio = values.music
    ? [
        '-i',
        values.music,
        '-map',
        '0:v',
        '-map',
        '1:a',
        '-af',
        `afade=t=in:st=0:d=0.3,afade=t=out:st=${(duration - BAR).toFixed(3)}:d=${BAR.toFixed(3)},volume=-4dB`,
        '-c:a',
        'aac',
        '-b:a',
        '192k',
        '-ar',
        '48000',
      ]
    : [];
  const ffmpeg = spawn(
    'ffmpeg',
    [
      '-v',
      'error',
      '-y',
      ...input,
      ...audio,
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-crf',
      '20',
      '-tune',
      'animation',
      '-pix_fmt',
      'yuv420p',
      '-t',
      duration.toFixed(3),
      '-movflags',
      '+faststart',
      values.out,
    ],
    { stdio: ['pipe', 'inherit', 'inherit'] }
  );
  const frames = Math.round(duration * FPS);
  for (let f = 0; f < frames; f++) {
    await renderAt(f / FPS);
    if (!ffmpeg.stdin.write(await page.screenshot({ type: 'png' }))) {
      await new Promise((resolve) => ffmpeg.stdin.once('drain', resolve));
    }
    if (f % 600 === 0) console.log(`frame ${f}/${frames}`);
  }
  ffmpeg.stdin.end();
  await new Promise((resolve) => ffmpeg.on('close', resolve));
}

console.log(`duration ${duration.toFixed(2)}s`);
console.log(`chapters ${chapters.join(', ')}`);
await browser.close();
