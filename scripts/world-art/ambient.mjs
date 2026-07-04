// Small ambient / affordance sprites (PRD §8.2): sparkle (undiscovered marker), checkmark
// (discovered marker), butterfly + gull (2 frames each), chimney smoke puff, drifting leaf.

import { nature } from './palette.mjs';
import { svgDoc } from './svg.mjs';

function sparkle() {
  return svgDoc(
    64,
    64,
    `
    <path d="M32 6 Q36 26 56 32 Q36 38 32 58 Q28 38 8 32 Q28 26 32 6 Z" fill="#ffe9a0"/>
    <path d="M32 16 Q35 28 46 32 Q35 36 32 48 Q29 36 18 32 Q29 28 32 16 Z" fill="#fff8dc"/>
  `
  );
}

function checkmark() {
  return svgDoc(
    64,
    64,
    `
    <circle cx="32" cy="32" r="26" fill="#4c9f56"/>
    <circle cx="32" cy="30" r="24" fill="#5cb166"/>
    <path d="M20 32 L29 42 L45 22" stroke="#f4f8ee" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `
  );
}

function butterfly(open) {
  const spread = open ? 1 : 0.45;
  return svgDoc(
    64,
    64,
    `
    <g transform="translate(32 34)">
      <g transform="scale(${spread} 1)">
        <ellipse cx="-13" cy="-8" rx="12" ry="14" fill="#e88aa8"/>
        <ellipse cx="-11" cy="8" rx="9" ry="10" fill="#f0aec4"/>
        <ellipse cx="13" cy="-8" rx="12" ry="14" fill="#e88aa8"/>
        <ellipse cx="11" cy="8" rx="9" ry="10" fill="#f0aec4"/>
      </g>
      <rect x="-2.5" y="-14" width="5" height="28" rx="2.5" fill="#5a4634"/>
      <path d="M-1 -14 Q-6 -22 -10 -24 M1 -14 Q6 -22 10 -24" stroke="#5a4634" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>
  `
  );
}

function gull(up) {
  const wingY = up ? -16 : 6;
  return svgDoc(
    96,
    64,
    `
    <g transform="translate(48 36)">
      <ellipse cx="0" cy="0" rx="18" ry="10" fill="#f4f4f0"/>
      <circle cx="16" cy="-6" r="8" fill="#f4f4f0"/>
      <path d="M23 -6 L31 -4 L23 -2 Z" fill="#e8a03c"/>
      <circle cx="18" cy="-8" r="1.8" fill="#33302a"/>
      <path d="M-4 -4 Q-16 ${wingY} -36 ${wingY - 2}" stroke="#d8d8d0" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M4 -4 Q18 ${wingY} 38 ${wingY - 2}" stroke="#f4f4f0" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M-16 2 L-24 6" stroke="#b8b8b0" stroke-width="5" stroke-linecap="round"/>
    </g>
  `
  );
}

function smoke() {
  return svgDoc(
    64,
    64,
    `
    <g fill="#e8e6e0" opacity="0.85">
      <circle cx="26" cy="40" r="14"/>
      <circle cx="40" cy="32" r="11"/>
      <circle cx="30" cy="24" r="9"/>
    </g>
    <circle cx="24" cy="34" r="8" fill="#f6f5f1" opacity="0.9"/>
  `
  );
}

function leaf() {
  return svgDoc(
    32,
    32,
    `
    <path d="M6 24 Q6 8 26 6 Q24 26 8 26 Q6 26 6 24 Z" fill="${nature.canopyLight}"/>
    <path d="M8 24 Q16 16 24 8" stroke="${nature.pine}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `
  );
}

export function buildAmbient() {
  return {
    sparkle: sparkle(),
    checkmark: checkmark(),
    'butterfly-1': butterfly(true),
    'butterfly-2': butterfly(false),
    'gull-1': gull(true),
    'gull-2': gull(false),
    smoke: smoke(),
    leaf: leaf(),
  };
}
