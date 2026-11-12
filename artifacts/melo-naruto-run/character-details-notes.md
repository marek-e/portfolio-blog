# Melo Naruto runner

Scrolling through the running section moves Melo across the screen and changes his facing direction. At rest he faces forward, raises the hand sign on hover or keyboard focus, and summons two departing clones on click. Keyboard activation and reduced motion use stationary feedback.

| Element            | Role    | Starts                              | Duration                             | Motion                                                     | Relationship                                                  |
| ------------------ | ------- | ----------------------------------- | ------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------- |
| Turn drawings      | Lead    | Run start, stop or reversal         | 25 ms per angular step, up to 225 ms | Four intermediate angles between front and profile         | Retargets from the current angle on interruption              |
| Hand-sign feedback | Support | Pointer click during an active cast | 100 ms rise and 100 ms release       | Opacity on a small glow at the hands                       | Existing clones and their departure clocks continue           |
| Smoke puffs        | Support | Clone appearance and disappearance  | 250–295 ms with up to 22 ms offset   | Different size, origin, drift, spread and opacity per puff | Every puff finishes within the existing smoke window          |
| Idle eyes          | Lead    | After 3.2 seconds of quiet          | 100 ms                               | Closed-eye frame, then original idle                       | Later blinks wait 6.8–9.8 seconds and stop during interaction |

The heading, section layout, idle body and departing clones keep their existing behavior. Only the eyes change during a blink. Repeated clicks acknowledge the hand sign without replacing clones. Hover, running, casting, keyboard focus, reduced motion, hidden tabs and leaving the section suspend idle blinking.

Check foot registration through the turn, fast reversals, feedback during an existing cast, variation between smoke bursts and the first idle blink in the recorded preview. Pose images preload near the section. A single 512-pixel canvas replaces each complete drawing together, without a dissolve or a gap between image layers. An unavailable image retains the current drawing. The canvas also draws the scroll-driven run frames, preserving directional lean and the shared foot baseline. A static image remains available before the first canvas paint.

New artwork uses built-in image generation, exported as registered 512-pixel assets.

| Asset        | Saved file                                                                 |
| ------------ | -------------------------------------------------------------------------- |
| Turn 1       | [melo-naruto-turn-0-hd.webp](../../public/melo/melo-naruto-turn-0-hd.webp) |
| Turn 2       | [melo-naruto-turn-1-hd.webp](../../public/melo/melo-naruto-turn-1-hd.webp) |
| Turn 3       | [melo-naruto-turn-2-hd.webp](../../public/melo/melo-naruto-turn-2-hd.webp) |
| Turn 4       | [melo-naruto-turn-3-hd.webp](../../public/melo/melo-naruto-turn-3-hd.webp) |
| Blink        | [melo-naruto-blink-hd.webp](../../public/melo/melo-naruto-blink-hd.webp)   |
| Turn prompt  | [turn-frames-prompt.txt](turn-frames-prompt.txt)                           |
| Blink prompt | [blink-prompt.txt](blink-prompt.txt)                                       |
