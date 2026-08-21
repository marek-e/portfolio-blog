// Marek's avatar — chibi proportions (~3 heads tall, PRD §8.3 step 4), four static
// directional poses rendered as separate transparent PNGs. Source canvas 192×256;
// rendered in-game at ~96–128 px tall (PRD §8.2).

import { character as c } from './palette.mjs';
import { svgDoc } from './svg.mjs';

export const POSE_WIDTH = 192;
export const POSE_HEIGHT = 256;

// Shared measurements (canvas center x = 96, feet at y ≈ 244)
const HEAD_R = 52;
const HEAD_CY = 78;
const BODY_TOP = 118;
const BODY_H = 74;
const LEG_H = 40;

function legs(dx = 0) {
  const y = BODY_TOP + BODY_H - 6;
  return `
    <rect x="${70 + dx}" y="${y}" width="24" height="${LEG_H}" rx="10" fill="${c.jeans}"/>
    <rect x="${98 + dx}" y="${y}" width="24" height="${LEG_H}" rx="10" fill="${c.jeansShade}"/>
    <rect x="${66 + dx}" y="${y + LEG_H - 10}" width="30" height="20" rx="9" fill="${c.shoe}"/>
    <rect x="${96 + dx}" y="${y + LEG_H - 10}" width="30" height="20" rx="9" fill="${c.shoe}"/>
    <rect x="${66 + dx}" y="${y + LEG_H + 4}" width="30" height="7" rx="3.5" fill="${c.shoeSole}"/>
    <rect x="${96 + dx}" y="${y + LEG_H + 4}" width="30" height="7" rx="3.5" fill="${c.shoeSole}"/>`;
}

function torso() {
  return `
    <rect x="58" y="${BODY_TOP}" width="76" height="${BODY_H}" rx="26" fill="${c.shirt}"/>
    <rect x="58" y="${BODY_TOP + BODY_H - 26}" width="76" height="26" rx="13" fill="${c.shirtShade}"/>`;
}

function arms(front = true) {
  const y = BODY_TOP + 8;
  return `
    <rect x="44" y="${y}" width="20" height="52" rx="10" fill="${front ? c.shirt : c.shirtShade}"/>
    <rect x="128" y="${y}" width="20" height="52" rx="10" fill="${front ? c.shirt : c.shirtShade}"/>
    <circle cx="54" cy="${y + 56}" r="10" fill="${c.skin}"/>
    <circle cx="138" cy="${y + 56}" r="10" fill="${c.skin}"/>`;
}

export function buildCharacterPoses() {
  const front = svgDoc(
    POSE_WIDTH,
    POSE_HEIGHT,
    `
    ${legs()}
    ${torso()}
    ${arms()}
    <circle cx="96" cy="${HEAD_CY}" r="${HEAD_R}" fill="${c.skin}"/>
    <!-- hair: full fringe over the top third of the head -->
    <path d="M44 ${HEAD_CY + 6} Q40 ${HEAD_CY - 46} 96 ${HEAD_CY - 52} Q152 ${HEAD_CY - 46} 148 ${HEAD_CY + 6} Q142 ${HEAD_CY - 4} 130 ${HEAD_CY - 12} Q118 ${HEAD_CY - 20} 104 ${HEAD_CY - 14} Q96 ${HEAD_CY - 10} 88 ${HEAD_CY - 16} Q74 ${HEAD_CY - 24} 62 ${HEAD_CY - 12} Q52 ${HEAD_CY - 2} 44 ${HEAD_CY + 6} Z" fill="${c.hair}"/>
    <!-- glasses -->
    <g stroke="${c.glasses}" stroke-width="5" fill="rgba(255,255,255,0.16)">
      <rect x="56" y="${HEAD_CY - 6}" width="32" height="26" rx="10"/>
      <rect x="104" y="${HEAD_CY - 6}" width="32" height="26" rx="10"/>
      <line x1="88" y1="${HEAD_CY + 4}" x2="104" y2="${HEAD_CY + 4}"/>
    </g>
    <!-- eyes + mouth -->
    <circle cx="72" cy="${HEAD_CY + 7}" r="5" fill="${c.glasses}"/>
    <circle cx="120" cy="${HEAD_CY + 7}" r="5" fill="${c.glasses}"/>
    <path d="M86 ${HEAD_CY + 30} Q96 ${HEAD_CY + 38} 106 ${HEAD_CY + 30}" stroke="${c.glasses}" stroke-width="5" fill="none" stroke-linecap="round"/>
  `
  );

  const back = svgDoc(
    POSE_WIDTH,
    POSE_HEIGHT,
    `
    ${legs()}
    ${torso()}
    ${arms(false)}
    <circle cx="96" cy="${HEAD_CY}" r="${HEAD_R}" fill="${c.skin}"/>
    <!-- full hair from behind -->
    <path d="M44 ${HEAD_CY + 20} Q40 ${HEAD_CY - 40} 96 ${HEAD_CY - 52} Q152 ${HEAD_CY - 40} 148 ${HEAD_CY + 20} Q148 ${HEAD_CY + 40} 128 ${HEAD_CY + 44} Q96 ${HEAD_CY + 50} 64 ${HEAD_CY + 44} Q44 ${HEAD_CY + 40} 44 ${HEAD_CY + 20} Z" fill="${c.hair}"/>
    <path d="M60 ${HEAD_CY - 30} Q96 ${HEAD_CY - 44} 132 ${HEAD_CY - 30}" stroke="#5c4430" stroke-width="6" fill="none" stroke-linecap="round"/>
  `
  );

  const side = (flip) =>
    svgDoc(
      POSE_WIDTH,
      POSE_HEIGHT,
      `
    <g transform="${flip ? `translate(${POSE_WIDTH} 0) scale(-1 1)` : ''}">
      <!-- legs in slight stride -->
      <rect x="78" y="${BODY_TOP + BODY_H - 6}" width="26" height="${LEG_H}" rx="11" fill="${c.jeans}"/>
      <rect x="92" y="${BODY_TOP + BODY_H - 4}" width="26" height="${LEG_H - 2}" rx="11" fill="${c.jeansShade}"/>
      <rect x="72" y="${BODY_TOP + BODY_H + LEG_H - 16}" width="38" height="20" rx="9" fill="${c.shoe}"/>
      <rect x="90" y="${BODY_TOP + BODY_H + LEG_H - 14}" width="36" height="20" rx="9" fill="${c.shoe}"/>
      <rect x="72" y="${BODY_TOP + BODY_H + LEG_H - 2}" width="38" height="7" rx="3.5" fill="${c.shoeSole}"/>
      <!-- torso -->
      <rect x="66" y="${BODY_TOP}" width="62" height="${BODY_H}" rx="24" fill="${c.shirt}"/>
      <rect x="66" y="${BODY_TOP + BODY_H - 26}" width="62" height="26" rx="13" fill="${c.shirtShade}"/>
      <!-- near arm -->
      <rect x="84" y="${BODY_TOP + 10}" width="22" height="52" rx="11" fill="${c.shirtShade}"/>
      <circle cx="95" cy="${BODY_TOP + 66}" r="10" fill="${c.skin}"/>
      <!-- head profile -->
      <circle cx="96" cy="${HEAD_CY}" r="${HEAD_R}" fill="${c.skin}"/>
      <path d="M44 ${HEAD_CY + 14} Q38 ${HEAD_CY - 44} 92 ${HEAD_CY - 52} Q150 ${HEAD_CY - 46} 146 ${HEAD_CY + 2} Q132 ${HEAD_CY - 22} 112 ${HEAD_CY - 24} Q84 ${HEAD_CY - 26} 70 ${HEAD_CY - 8} Q58 ${HEAD_CY + 6} 60 ${HEAD_CY + 22} Q50 ${HEAD_CY + 24} 44 ${HEAD_CY + 14} Z" fill="${c.hair}"/>
      <!-- glasses arm + lens on the facing side -->
      <g stroke="${c.glasses}" stroke-width="5" fill="rgba(255,255,255,0.16)">
        <rect x="118" y="${HEAD_CY - 4}" width="30" height="26" rx="10"/>
        <line x1="118" y1="${HEAD_CY + 4}" x2="98" y2="${HEAD_CY + 2}"/>
      </g>
      <circle cx="134" cy="${HEAD_CY + 9}" r="5" fill="${c.glasses}"/>
      <!-- ear -->
      <circle cx="84" cy="${HEAD_CY + 12}" r="9" fill="#e0b088"/>
    </g>
  `
    );

  return {
    front,
    back,
    right: side(false),
    left: side(true),
  };
}
