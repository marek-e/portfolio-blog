# Prompt caching summary video

Source of the summary video at the top of the prompt caching post (`public/videos/prompt-caching-claude-code/prompt-caching-summary-{en,fr}.mp4`).

The video is a plain HTML page driven by a deterministic timeline: `window.__render(t)` draws the frame at `t` seconds. `render.js` opens the page in headless Chrome, captures every frame at 30 fps and pipes them into ffmpeg.

| File          | Role                                                                    |
| ------------- | ----------------------------------------------------------------------- |
| `index.html`  | Stage, styles and fonts (loaded from `public/fonts` and `node_modules`) |
| `copy.js`     | Every on-screen string, in English and French                           |
| `timeline.js` | The ten scenes, their animations and their timing                       |
| `render.js`   | Renders stills or the full video, with optional music                   |

## Render

Requires ffmpeg and Google Chrome (or set `CHROME_PATH` to another Chromium build).

```bash
pnpm motion:prompt-caching --lang en --music "/path/to/Soft Plucked Motif.mp4" --out public/videos/prompt-caching-claude-code/prompt-caching-summary-en.mp4
```

```bash
pnpm motion:prompt-caching --lang fr --out /tmp/stills --stills 7.1,34.9,123.3
```

A full render takes about 6 minutes. The script prints the duration and the start time of each chapter, which are the `start` values of the `ChapterVideo` chapters in the post.

The poster is the frame at 6 seconds:

```bash
ffmpeg -ss 6 -i public/videos/prompt-caching-claude-code/prompt-caching-summary-en.mp4 -frames:v 1 -q:v 3 public/videos/prompt-caching-claude-code/prompt-caching-summary-en.jpg
```

## Timing and music

The music is "Soft Plucked Motif", kept out of the repo. It runs at 95 BPM with its first downbeat at 0.12 s, so one bar lasts 2.53 s. Each scene declares `toBar`, the bar on which it ends, so every cut lands on a downbeat. Inside a scene, `pre` delays the visuals to leave time to read the title, and `holds` pause the animation at given points for reading time.

The video must stay under 140 s, the upload limit on X without Premium. It currently ends on bar 55, at 139.07 s.

To change the length of a scene, move its `toBar` and the `toBar` of the scenes after it. If you use another track, update `BEAT0` and `BAR` in `timeline.js` and `BAR` in `render.js`.
