// Palette anchors for the Projects World art (PRD §8.1): warm saturated colors, one accent
// per landmark. Every generated asset pulls from here — shared constants are what keep the
// set style-coherent (the vector-pipeline equivalent of the PRD's master style frame).

export const sea = {
  deep: '#1e6e94',
  mid: '#2f8fae',
  shallow: '#4fb3c4',
  foam: '#d8f0f2',
};

export const land = {
  grass: '#7cb85c',
  grassLight: '#8cc46c',
  grassDark: '#67a44c',
  hill: '#8cc46c',
  sand: '#ecd9a4',
  sandDark: '#dcc48c',
  path: '#dfc494',
  pathEdge: '#c9ad78',
  dirt: '#c8a878',
  cliff: '#9b8a76',
  cliffDark: '#7f6f5c',
  plaza: '#d8cbb4',
  plazaEdge: '#bfb094',
};

export const wood = {
  light: '#c89058',
  mid: '#a5713f',
  dark: '#7d5430',
  plank: '#b98a5e',
};

export const building = {
  wall: '#e8d3ae',
  wallShade: '#d4bc92',
  roof: '#c96f4a',
  roofLight: '#d98a62',
  roofDark: '#a85838',
  window: '#7fc4d8',
  windowFrame: '#7d5430',
};

export const nature = {
  pine: '#3e7d4f',
  pineLight: '#529760',
  pineDark: '#336744',
  canopy: '#5aa864',
  canopyLight: '#74bc7a',
  trunk: '#8a5a35',
  bush: '#63a04b',
  flowerPink: '#e88aa8',
  flowerYellow: '#f0c85a',
  flowerWhite: '#f4f0e4',
};

export const accents = {
  elemix: '#3b82c4', // framework blue
  minesweeper: '#d8503c', // warning red
  nextArmored: '#7286a0', // steel
  equinoxWarm: '#f0b45a',
  equinoxCool: '#6a7ec8',
  petanque: '#b0803c', // boules bronze
};

export const character = {
  skin: '#f0c8a0',
  hair: '#4a3524',
  shirt: '#2f8f8a',
  shirtShade: '#257470',
  jeans: '#3e5a7d',
  jeansShade: '#324a68',
  shoe: '#f4f0e4',
  shoeSole: '#c9bfa8',
  glasses: '#33302a',
};

export const ui = {
  shadow: 'rgba(30, 40, 30, 0.18)',
  outline: 'rgba(60, 45, 25, 0.35)',
};
