// Landmark sprites (PRD §7) — transparent, layered above the painting so the §6.6
// affordances (glow, prompt, sparkle/checkmark) can target them. One accent color per
// landmark, style + light direction shared with the rest of the set.

import { accents, wood, land, building, nature } from './palette.mjs';
import { shadow, svgDoc } from './svg.mjs';

/**
 * Elemix — building under construction: scaffolding around a half-built frame of
 * glowing blue component blocks.
 */
function elemix() {
  const blue = accents.elemix;
  return svgDoc(
    512,
    512,
    `
    ${shadow(256, 462, 190, 34)}
    <!-- half-built wall of component blocks -->
    <g>
      <rect x="136" y="300" width="240" height="150" rx="10" fill="${building.wallShade}"/>
      <g fill="${blue}">
        <rect x="152" y="316" width="64" height="44" rx="8"/>
        <rect x="224" y="316" width="64" height="44" rx="8" opacity="0.75"/>
        <rect x="296" y="316" width="64" height="44" rx="8"/>
        <rect x="152" y="368" width="64" height="44" rx="8" opacity="0.75"/>
        <rect x="224" y="368" width="64" height="44" rx="8"/>
      </g>
      <g fill="#9cc8ec" opacity="0.9">
        <rect x="160" y="322" width="24" height="10" rx="5"/>
        <rect x="304" y="322" width="24" height="10" rx="5"/>
        <rect x="232" y="374" width="24" height="10" rx="5"/>
      </g>
      <!-- floating block being placed -->
      <rect x="296" y="252" width="64" height="44" rx="8" fill="${blue}"/>
      <rect x="296" y="252" width="64" height="44" rx="8" fill="none" stroke="#cfe7f8" stroke-width="5" opacity="0.9"/>
    </g>
    <!-- scaffolding -->
    <g stroke="${wood.mid}" stroke-width="14" stroke-linecap="round">
      <line x1="110" y1="450" x2="110" y2="180"/>
      <line x1="402" y1="450" x2="402" y2="180"/>
      <line x1="96" y1="230" x2="416" y2="230"/>
      <line x1="96" y1="330" x2="416" y2="330"/>
    </g>
    <g stroke="${wood.light}" stroke-width="10" stroke-linecap="round">
      <line x1="110" y1="230" x2="200" y2="330"/>
      <line x1="402" y1="230" x2="312" y2="330"/>
    </g>
    <rect x="86" y="164" width="340" height="22" rx="11" fill="${wood.plank}"/>
    <!-- crane hook -->
    <line x1="328" y1="164" x2="328" y2="236" stroke="#6b6152" stroke-width="6"/>
    <path d="M328 240 q10 10 0 18" stroke="#6b6152" stroke-width="7" fill="none" stroke-linecap="round"/>
  `
  );
}

/** Minesweeper LLM Arena — mine entrance with numbered crates and warning flags. */
function minesweeper() {
  const red = accents.minesweeper;
  return svgDoc(
    512,
    512,
    `
    ${shadow(256, 468, 200, 34)}
    <!-- rock face -->
    <path d="M76 456 Q56 320 130 250 Q180 190 256 184 Q332 190 382 250 Q456 320 436 456 Z" fill="${land.cliff}"/>
    <path d="M110 300 Q160 236 240 226 L226 200 Q166 210 128 258 Z" fill="#ad9d88" opacity="0.8"/>
    <path d="M380 270 Q420 330 428 440 L392 448 Q392 340 356 288 Z" fill="${land.cliffDark}" opacity="0.7"/>
    <!-- tunnel -->
    <path d="M172 456 Q172 320 256 320 Q340 320 340 456 Z" fill="#33302a"/>
    <path d="M186 456 Q186 334 256 334 Q326 334 326 456 Z" fill="#211f1b"/>
    <!-- wooden frame -->
    <g stroke="${wood.mid}" stroke-width="18" stroke-linecap="round" fill="none">
      <path d="M164 456 L164 330 Q170 302 200 294"/>
      <path d="M348 456 L348 330 Q342 302 312 294"/>
      <line x1="192" y1="292" x2="320" y2="292"/>
    </g>
    <!-- numbered crates (minesweeper numbers) -->
    <g>
      <rect x="60" y="380" width="86" height="80" rx="10" fill="${wood.light}" stroke="${wood.dark}" stroke-width="7"/>
      <text x="103" y="436" font-family="Verdana, sans-serif" font-size="44" font-weight="bold" fill="#3b82c4" text-anchor="middle">1</text>
      <rect x="374" y="392" width="76" height="70" rx="10" fill="${wood.light}" stroke="${wood.dark}" stroke-width="7"/>
      <text x="412" y="442" font-family="Verdana, sans-serif" font-size="40" font-weight="bold" fill="#3f9048" text-anchor="middle">2</text>
      <rect x="396" y="316" width="62" height="62" rx="10" fill="${wood.plank}" stroke="${wood.dark}" stroke-width="7"/>
      <text x="427" y="360" font-family="Verdana, sans-serif" font-size="36" font-weight="bold" fill="${red}" text-anchor="middle">3</text>
    </g>
    <!-- warning flags -->
    <g>
      <line x1="96" y1="376" x2="96" y2="290" stroke="${wood.dark}" stroke-width="8" stroke-linecap="round"/>
      <path d="M96 290 L146 306 L96 322 Z" fill="${red}"/>
      <line x1="420" y1="312" x2="420" y2="230" stroke="${wood.dark}" stroke-width="8" stroke-linecap="round"/>
      <path d="M420 230 L468 246 L420 262 Z" fill="${red}"/>
    </g>
    <!-- rounded mine 'bomb' accent above the arch -->
    <circle cx="256" cy="238" r="30" fill="#3a362e"/>
    <circle cx="247" cy="229" r="9" fill="#5a544a"/>
    <rect x="250" y="200" width="12" height="16" rx="5" fill="#3a362e"/>
    <path d="M256 200 q8 -14 20 -10" stroke="${red}" stroke-width="6" fill="none" stroke-linecap="round"/>
  `
  );
}

/** Next-Armored — small shield tower with a crest banner. */
function nextArmored() {
  const steel = accents.nextArmored;
  return svgDoc(
    512,
    512,
    `
    ${shadow(256, 470, 150, 30)}
    <!-- tower body -->
    <rect x="156" y="180" width="200" height="290" rx="18" fill="#b8c2d0"/>
    <rect x="156" y="180" width="200" height="290" rx="18" fill="none" stroke="${steel}" stroke-width="8"/>
    <rect x="156" y="404" width="200" height="66" rx="18" fill="${steel}" opacity="0.35"/>
    <!-- stone joints -->
    <g stroke="${steel}" stroke-width="5" opacity="0.55">
      <line x1="156" y1="250" x2="356" y2="250"/>
      <line x1="156" y1="320" x2="356" y2="320"/>
      <line x1="156" y1="390" x2="356" y2="390"/>
      <line x1="256" y1="250" x2="256" y2="320"/>
      <line x1="206" y1="180" x2="206" y2="250"/>
      <line x1="306" y1="180" x2="306" y2="250"/>
      <line x1="206" y1="320" x2="206" y2="390"/>
      <line x1="306" y1="320" x2="306" y2="390"/>
    </g>
    <!-- battlements -->
    <g fill="#9daaba">
      <rect x="140" y="130" width="56" height="62" rx="10"/>
      <rect x="228" y="130" width="56" height="62" rx="10"/>
      <rect x="316" y="130" width="56" height="62" rx="10"/>
      <rect x="132" y="176" width="248" height="26" rx="12"/>
    </g>
    <!-- arrow slit -->
    <rect x="244" y="212" width="24" height="56" rx="12" fill="#4a5568"/>
    <!-- banner with shield crest -->
    <path d="M206 290 L306 290 L306 420 L256 452 L206 420 Z" fill="${steel}"/>
    <path d="M206 290 L306 290 L306 316 L206 316 Z" fill="#5a6a84"/>
    <path d="M256 322 L296 336 L296 380 Q296 410 256 428 Q216 410 216 380 L216 336 Z" fill="#e8edf4"/>
    <path d="M256 322 L296 336 L296 380 Q296 410 256 428 Z" fill="#c8d2e0"/>
    <path d="M256 348 L276 356 L276 380 Q276 396 256 406 Q236 396 236 380 L236 356 Z" fill="${accents.elemix}"/>
  `
  );
}

/** Equinox — sundial monument, half warm light / half cool shadow. */
function equinox() {
  return svgDoc(
    512,
    512,
    `
    ${shadow(256, 420, 200, 40)}
    <!-- split ground disc -->
    <path d="M256 256 m-190 0 a190 96 0 0 1 380 0 z" transform="translate(0 130)" fill="${accents.equinoxWarm}" opacity="0.45"/>
    <path d="M256 256 m190 0 a190 96 0 0 1 -380 0 z" transform="translate(0 130)" fill="${accents.equinoxCool}" opacity="0.45"/>
    <!-- pedestal -->
    <ellipse cx="256" cy="386" rx="150" ry="64" fill="${land.cliff}"/>
    <ellipse cx="256" cy="370" rx="150" ry="64" fill="#ad9d88"/>
    <ellipse cx="256" cy="366" rx="120" ry="48" fill="#c2b49e"/>
    <!-- dial face: warm/cool halves -->
    <ellipse cx="256" cy="360" rx="104" ry="40" fill="${accents.equinoxWarm}"/>
    <path d="M256 320 a104 40 0 0 0 0 80 z" fill="${accents.equinoxCool}"/>
    <ellipse cx="256" cy="360" rx="104" ry="40" fill="none" stroke="#8f8272" stroke-width="6"/>
    <!-- hour ticks -->
    <g stroke="#6b604f" stroke-width="5" stroke-linecap="round">
      <line x1="256" y1="322" x2="256" y2="334"/>
      <line x1="176" y1="344" x2="188" y2="348"/>
      <line x1="336" y1="344" x2="324" y2="348"/>
      <line x1="196" y1="384" x2="206" y2="378"/>
      <line x1="316" y1="384" x2="306" y2="378"/>
    </g>
    <!-- gnomon -->
    <path d="M256 360 L256 220 L302 344 Z" fill="#7d7263"/>
    <path d="M256 360 L256 220 L232 340 Z" fill="#9a8d7a"/>
    <!-- sun & moon inlays -->
    <circle cx="196" cy="352" r="16" fill="#f6d47c"/>
    <g stroke="#f6d47c" stroke-width="4" stroke-linecap="round">
      <line x1="196" y1="328" x2="196" y2="320"/>
      <line x1="172" y1="352" x2="164" y2="352"/>
      <line x1="196" y1="376" x2="196" y2="384"/>
      <line x1="178" y1="336" x2="172" y2="330"/>
      <line x1="214" y1="336" x2="220" y2="330"/>
    </g>
    <path d="M316 338 a16 16 0 1 0 8 28 a12 12 0 1 1 -8 -28" fill="#c8d4f4"/>
  `
  );
}

/** Petanque — court under the plane trees, boules mid-game. */
function petanque() {
  const bronze = accents.petanque;
  return svgDoc(
    512,
    512,
    `
    <!-- court -->
    <rect x="46" y="150" width="420" height="260" rx="26" fill="${wood.plank}"/>
    <rect x="60" y="164" width="392" height="232" rx="18" fill="${land.sand}"/>
    <rect x="60" y="164" width="392" height="60" rx="18" fill="#f2e2b4" opacity="0.7"/>
    <!-- raked lines -->
    <g stroke="${land.sandDark}" stroke-width="4" opacity="0.5">
      <line x1="80" y1="220" x2="432" y2="220"/>
      <line x1="80" y1="260" x2="432" y2="260"/>
      <line x1="80" y1="300" x2="432" y2="300"/>
      <line x1="80" y1="340" x2="432" y2="340"/>
    </g>
    <!-- throwing circle -->
    <circle cx="130" cy="330" r="34" fill="none" stroke="${land.pathEdge}" stroke-width="6"/>
    <!-- cochonnet + boules -->
    <circle cx="360" cy="250" r="10" fill="#d8503c"/>
    <g>
      <circle cx="316" cy="286" r="24" fill="${bronze}"/>
      <circle cx="308" cy="278" r="8" fill="#d4a86a" opacity="0.9"/>
      <circle cx="396" cy="276" r="24" fill="#8f8a84"/>
      <circle cx="388" cy="268" r="8" fill="#c2beb8" opacity="0.9"/>
      <circle cx="352" cy="312" r="24" fill="${bronze}"/>
      <circle cx="344" cy="304" r="8" fill="#d4a86a" opacity="0.9"/>
      <circle cx="230" cy="300" r="24" fill="#8f8a84"/>
      <circle cx="222" cy="292" r="8" fill="#c2beb8" opacity="0.9"/>
    </g>
    <!-- shade dapples from the plane trees -->
    <g fill="${nature.pine}" opacity="0.12">
      <ellipse cx="140" cy="200" rx="70" ry="26"/>
      <ellipse cx="330" cy="180" rx="90" ry="30"/>
      <ellipse cx="420" cy="360" rx="70" ry="24"/>
    </g>
  `
  );
}

/** Wooden sign at the house door — the Personal Portfolio landmark. */
function sign() {
  return svgDoc(
    192,
    192,
    `
    ${shadow(96, 174, 56, 12)}
    <rect x="88" y="96" width="16" height="80" rx="8" fill="${wood.dark}"/>
    <rect x="24" y="30" width="144" height="76" rx="14" fill="${wood.light}" stroke="${wood.dark}" stroke-width="8"/>
    <rect x="32" y="38" width="128" height="26" rx="10" fill="${wood.plank}" opacity="0.6"/>
    <!-- little house glyph -->
    <path d="M52 62 L68 50 L84 62 L84 78 L52 78 Z" fill="${building.roof}"/>
    <rect x="63" y="66" width="10" height="12" rx="3" fill="${wood.dark}"/>
    <!-- text lines -->
    <g stroke="${wood.dark}" stroke-width="7" stroke-linecap="round">
      <line x1="98" y1="58" x2="148" y2="58"/>
      <line x1="98" y1="76" x2="136" y2="76"/>
    </g>
  `
  );
}

export function buildLandmarks() {
  return {
    'landmark-elemix': elemix(),
    'landmark-minesweeper-llm-arena': minesweeper(),
    'landmark-next-armored': nextArmored(),
    'landmark-equinox-theme': equinox(),
    'landmark-petanque': petanque(),
    'landmark-personal-portfolio': sign(),
  };
}
