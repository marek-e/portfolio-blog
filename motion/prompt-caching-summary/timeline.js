const FPS = 30;
const BEAT0 = 0.12;
const BAR = 240 / 95;
const lang = new URLSearchParams(location.search).get('lang') === 'fr' ? 'fr' : 'en';
const copy = window.COPY[lang];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const E = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  expo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  back: (t) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2),
  lin: (t) => t,
};
const k = (t, s, d, e = E.out) => e(clamp((t - s) / d));

const money = (v, d = 2) =>
  lang === 'fr' ? v.toFixed(d).replace('.', ',') + '\u00a0$' : `$${v.toFixed(d)}`;

const stage = document.getElementById('stage');

function el(tag, cls, parent, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  parent.appendChild(e);
  return e;
}

function at(e, x, y, w, h) {
  e.style.left = x + 'px';
  e.style.top = y + 'px';
  if (w != null) e.style.width = w + 'px';
  if (h != null) e.style.height = h + 'px';
  return e;
}

function rv(e, v, dy = 24, blur = 8, dx = 0) {
  e.style.opacity = v;
  e.style.transform = `translate(${(1 - v) * dx}px,${(1 - v) * dy}px)`;
  e.style.filter = v < 1 ? `blur(${(1 - v) * blur}px)` : 'none';
}

function pop(e, v) {
  e.style.opacity = clamp(v * 1.5);
  e.style.transform = `scale(${lerp(0.6, 1, v)})`;
}

function words(e, str) {
  const spans = [];
  const re = /\[\[(\w+)\|([^\]]+)\]\]|(\S+)/g;
  let m;
  while ((m = re.exec(str))) {
    const tone = m[1];
    const txt = m[2] || m[3];
    for (const w of txt.split(' ')) {
      const s = el('span', 'w', e, w);
      if (tone === 'code') {
        s.classList.add('code');
        s.style.color = 'var(--amber)';
      } else if (tone) s.style.color = `var(--${tone})`;
      spans.push(s);
      e.appendChild(document.createTextNode(' '));
    }
  }
  return spans;
}

function rvWords(spans, t, s, st = 0.045, d = 0.8) {
  spans.forEach((sp, i) => {
    const v = k(t, s + i * st, d, E.expo);
    sp.style.opacity = v;
    sp.style.transform = `translateY(${(1 - v) * 36}px)`;
    sp.style.filter = v < 1 ? `blur(${(1 - v) * 10}px)` : 'none';
  });
}

function text(parent, x, y, html, css = '') {
  const e = el('div', 'lbl', parent, html);
  at(e, x, y);
  e.style.cssText += css;
  return e;
}

function row(parent, x, y, gap) {
  const e = at(el('div', 'a', parent), x, y);
  e.style.cssText += `display:flex;gap:${gap}px;white-space:nowrap`;
  return e;
}

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0).toString(16) + '0000').slice(0, 4);
}

function noise(a, b) {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function scramble(seed, frame) {
  const hex = '0123456789abcdef';
  let s = '';
  for (let i = 0; i < 4; i++) s += hex[Math.floor(noise(seed + i, frame) * 16)];
  return s;
}

const scenes = [];
let cursor = 0;
let pendingHeader = null;

function scene(len, { pre = 0, holds = [], toBar }, build) {
  const root = el('div', 'scene', stage);
  const body = build(root);
  const hd = pendingHeader;
  pendingHeader = null;
  const warp = (lt) => {
    let x = lt - pre;
    for (const [p, d] of holds) if (x > p) x = Math.max(p, x - d);
    return x;
  };
  const upd = (lt) => {
    if (hd) hd(lt);
    body(warp(lt));
  };
  const natural = len + pre + holds.reduce((a, [, d]) => a + d, 0);
  const total = toBar ? BEAT0 + toBar * BAR - cursor : natural;
  scenes.push({ start: cursor, end: cursor + total, root, upd });
  cursor += total;
}

function header(root, num, { kicker, title, sub }) {
  const kk = el('div', 'kicker', root, `${num} · ${kicker}`);
  const h = el('div', 'h1', root);
  const hs = words(h, title);
  let ss = null;
  if (sub) {
    const s = el('div', 'sub', root);
    ss = words(s, sub);
  }
  pendingHeader = (t) => {
    rv(kk, k(t, 0.05, 0.6), 12, 4);
    rvWords(hs, t, 0.15);
    if (ss) rvWords(ss, t, 0.55, 0.018, 0.7);
  };
}

scene(5.2, { holds: [[4.6, 1.5]], toBar: 3 }, (root) => {
  const c = copy.hook;
  const box = at(el('div', 'card', root), 560, 300, 800, 92);
  box.style.cssText +=
    'display:flex;align-items:center;padding:0 32px;font-family:Maple;font-size:30px';
  const caret = el('span', '', box, '&gt;&nbsp;');
  caret.style.color = 'var(--amber)';
  const typed = el('span', '', box, '');
  const cur = el('span', '', box, '&nbsp;');
  cur.style.cssText =
    'display:inline-block;width:14px;height:34px;background:var(--amber);margin-left:4px';
  const enter = el('div', 'pill mono', root, c.enter);
  at(enter, 1390, 324);
  enter.style.cssText +=
    'background:rgba(255,181,71,.12);border:1px solid rgba(255,181,71,.4);color:var(--amber)';
  const headline = 'text-align:center;font-size:84px;font-weight:600;letter-spacing:-.04em';
  const l1 = at(el('div', 'a', root), 0, 480, 1920);
  l1.style.cssText += headline;
  const w1 = words(l1, c.line1);
  const l2 = at(el('div', 'a', root), 0, 580, 1920);
  l2.style.cssText += headline;
  const w2 = words(l2, c.line2);
  const l3 = at(el('div', 'a', root), 360, 730, 1200);
  l3.style.cssText += 'text-align:center;font-size:30px;color:var(--muted);line-height:1.4';
  const w3 = words(l3, c.sub);
  return (t) => {
    rv(box, k(t, 0, 0.5), 20, 6);
    typed.textContent = c.prompt.slice(0, Math.floor(c.prompt.length * k(t, 0.35, 1.1, E.lin)));
    cur.style.opacity = t < 1.6 ? (Math.floor(t * 3) % 2 ? 0.2 : 1) : 0;
    const press = k(t, 1.6, 0.25);
    pop(enter, k(t, 1.45, 0.35, E.back));
    enter.style.opacity = clamp(k(t, 1.45, 0.3) - k(t, 2.2, 0.4));
    enter.style.background = `rgba(255,181,71,${0.12 + 0.4 * (press - k(t, 1.9, 0.3))})`;
    box.style.borderColor =
      press > 0 && t < 2.3 ? `rgba(255,181,71,${0.6 * (1 - k(t, 1.9, 0.4))})` : 'var(--line)';
    rvWords(w1, t, 1.9, 0.06);
    rvWords(w2, t, 2.35, 0.06);
    rvWords(w3, t, 3.2, 0.025, 0.7);
  };
});

scene(
  8.0,
  {
    pre: 2.0,
    holds: [
      [2.45, 0.5],
      [4.05, 0.5],
      [7.2, 2.0],
    ],
    toBar: 8,
  },
  (root) => {
    const c = copy.stateless;
    header(root, '02', c);
    const X0 = 120;
    const Y = 500;
    const kinds = {
      sys: ['rgba(122,162,255,.16)', 'rgba(122,162,255,.55)', 'var(--blue)'],
      you: ['rgba(255,255,255,.07)', 'rgba(255,255,255,.25)', 'var(--text)'],
      ai: ['rgba(183,148,246,.14)', 'rgba(183,148,246,.5)', 'var(--purple)'],
      tool: ['rgba(255,181,71,.10)', 'rgba(255,181,71,.4)', 'var(--amber)'],
    };
    const defs = [
      [0, 290, 'sys'],
      [0, 200, 'sys'],
      [0, 150, 'sys'],
      [0, 70, 'you'],
      [1, 190, 'ai'],
      [1, 70, 'you'],
      [1, 250, 'tool'],
      [2, 200, 'ai'],
      [2, 190, 'tool'],
      [2, 70, 'you'],
    ];
    const wrap = at(el('div', 'a', root), X0, Y, 1680, 96);
    let x = 0;
    const segs = defs.map(([turn, w, kind], i) => {
      const s = el('div', 'seg', wrap, c.segments[i]);
      const [bg, bd, fg] = kinds[kind];
      s.style.cssText += `left:${x}px;width:${w - 6}px;background:${bg};border:1.5px solid ${bd};color:${fg}`;
      x += w;
      return { s, turn };
    });
    const ends = [710, 1220, 1680];
    const sweep = el('div', 'a', wrap);
    sweep.style.cssText +=
      'top:-14px;height:124px;width:180px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);mix-blend-mode:screen;border-radius:20px';
    const mono22 = 'font-family:Maple;font-size:22px;';
    const turnLbl = text(root, X0, Y - 56, '', mono22 + 'color:var(--muted)');
    const count = text(
      root,
      X0,
      Y - 56,
      '',
      mono22 + 'color:var(--text);width:1680px;text-align:right'
    );
    const tokens = [24, 61, 150];
    const old = at(el('div', 'a', root), X0, Y + 124, 1214, 2);
    old.style.background = 'var(--dim)';
    const oldL = text(root, X0, Y + 142, c.old, mono22 + 'color:var(--muted)');
    const fresh = at(el('div', 'a', root), X0 + 1220, Y + 124, 460, 2);
    fresh.style.background = 'var(--amber)';
    const freshL = text(root, X0 + 1220, Y + 142, c.fresh, mono22 + 'color:var(--amber)');
    const foot = at(el('div', 'a', root), X0, 790, 1600);
    foot.style.cssText += 'font-size:40px;font-weight:600;letter-spacing:-.025em;line-height:1.25';
    const fw = words(foot, c.foot);
    const A = [0.9, 2.5, 4.1];
    const S = [1.5, 3.1, 4.7];
    return (t) => {
      segs.forEach((g, i) => {
        const v = k(t, A[g.turn] + (i % 4) * 0.08, 0.5, E.expo);
        g.s.style.opacity = v;
        g.s.style.transform = `translateY(${(1 - v) * 20}px)`;
        const dimmed = g.turn < 2 ? k(t, 5.6, 0.5) : 0;
        g.s.style.filter = `saturate(${1 - dimmed * 0.8}) brightness(${1 - dimmed * 0.45})`;
      });
      let turn = -1;
      for (let i = 0; i < 3; i++) if (t >= A[i]) turn = i;
      let sv = 0;
      let sx = 0;
      for (let i = 0; i < 3; i++) {
        if (t >= S[i] && t < S[i] + 0.9) {
          sx = lerp(-180, ends[i], k(t, S[i], 0.9, E.inOut));
          sv = Math.sin(Math.PI * clamp((t - S[i]) / 0.9));
        }
      }
      sweep.style.left = sx + 'px';
      sweep.style.opacity = sv;
      rv(turnLbl, k(t, 0.9, 0.4), 10, 4);
      rv(count, k(t, 0.9, 0.4), 10, 4);
      if (turn >= 0) {
        turnLbl.textContent = `${c.turn} ${turn + 1}`;
        const prev = turn ? tokens[turn - 1] : 0;
        const val = Math.round(lerp(prev, tokens[turn], k(t, S[turn], 0.9, E.inOut)));
        count.innerHTML = `${c.prefill} <span style="color:var(--blue)">${val}k</span> ${c.tokens}`;
      }
      const f = k(t, 5.6, 0.6);
      for (const line of [old, fresh]) {
        line.style.opacity = f;
        line.style.transformOrigin = 'left';
        line.style.transform = `scaleX(${f})`;
      }
      rv(oldL, k(t, 5.75, 0.5), 10, 4);
      rv(freshL, k(t, 5.85, 0.5), 10, 4);
      rvWords(fw, t, 6.0, 0.035, 0.6);
    };
  }
);

scene(
  9.4,
  {
    pre: 2.0,
    holds: [
      [2.85, 1.0],
      [4.7, 1.0],
      [8.8, 2.5],
    ],
    toBar: 14,
  },
  (root) => {
    const c = copy.prefix;
    header(root, '03', c);
    const X0 = 300;
    const STEP = 60;
    const ROWS = [490, 610, 730];
    const groups = [
      [0, 4, 'var(--blue)'],
      [4, 7, 'var(--blue)'],
      [7, 22, 'var(--muted)'],
    ];
    const gEls = groups.map(([a, b, color], i) => {
      const g = at(el('div', 'a', root), X0 + a * STEP, 420, (b - a) * STEP - 8, 40);
      g.style.borderBottom = `1.5px solid ${color}`;
      const l = el('div', 'mono', g, c.groups[i]);
      l.style.cssText = `font-size:19px;color:${color}`;
      return g;
    });
    const COLORS = { write: 'var(--amber)', hit: 'var(--green)', miss: 'var(--red)' };
    const rows = [14, 18, 22].map((n, r) => {
      const lbl = text(
        root,
        120,
        ROWS[r] + 18,
        `${c.request} ${r + 1}`,
        'font-family:Maple;font-size:22px;color:var(--muted)'
      );
      const cells = [];
      for (let i = 0; i < n; i++) cells.push(at(el('div', 'cell', root), X0 + i * STEP, ROWS[r]));
      return { lbl, cells };
    });
    const paint = (cell, color, v) => {
      if (v <= 0) {
        cell.style.background = 'transparent';
        cell.style.borderColor = 'var(--line)';
        cell.style.boxShadow = 'none';
        return;
      }
      cell.style.background = color;
      cell.style.borderColor = color;
      cell.style.opacity = 1;
      cell.style.transform = `scale(${lerp(0.75, 1, E.back(v))})`;
      cell.style.boxShadow = `0 0 ${24 * (1 - v)}px ${color}`;
      cell.style.filter = `brightness(${lerp(1.6, 1, v)})`;
    };
    const badges = [
      ['rgba(255,181,71,.14)', 'var(--amber)'],
      ['rgba(74,222,128,.12)', 'var(--green)'],
      ['rgba(255,107,107,.13)', 'var(--red)'],
    ].map(([bg, color], r) => {
      const b = el('div', 'pill', root, c.badges[r]);
      at(b, X0 + rows[r].cells.length * STEP + 16, ROWS[r] + 13);
      b.style.cssText += `background:${bg};color:${color};border:1px solid ${color}`;
      return b;
    });
    const pins = [14, 18].map((n, r) => {
      const p = at(el('div', 'a', root), X0 + n * STEP - 6, ROWS[r] - 14, 3, 92);
      p.style.background = 'var(--purple)';
      p.style.borderRadius = '2px';
      return p;
    });
    const pinL = text(
      root,
      X0 + 14 * STEP - 206,
      ROWS[0] - 44,
      c.breakpoint,
      'font-family:Maple;font-size:18px;color:var(--purple);width:206px;text-align:right'
    );
    const edit = text(
      root,
      X0 + 5 * STEP - 4,
      ROWS[2] + 74,
      c.edit,
      'font-family:Maple;font-size:19px;color:var(--red)'
    );
    const foot = at(el('div', 'a', root), 120, 880, 1700);
    foot.style.cssText += 'font-size:30px;color:var(--muted);line-height:1.4';
    const fw = words(foot, c.foot);
    return (t) => {
      gEls.forEach((g, i) => rv(g, k(t, 0.7 + i * 0.12, 0.5), 10, 4));
      const appear = [0.9, 2.9, 5.0];
      rows.forEach((r, ri) => {
        rv(r.lbl, k(t, appear[ri], 0.4), 0, 4, -20);
        r.cells.forEach((cell, i) => {
          const a = k(t, appear[ri] + i * 0.015, 0.35);
          cell.style.opacity = a;
          let state = null;
          let v = 0;
          if (ri === 0) {
            v = k(t, 1.4 + i * 0.055, 0.35);
            state = 'write';
          }
          if (ri === 1) {
            if (i < 14) {
              v = k(t, 3.3 + i * 0.015, 0.3);
              state = 'hit';
            } else {
              v = k(t, 3.75 + (i - 14) * 0.08, 0.35);
              state = 'write';
            }
          }
          if (ri === 2) {
            if (i < 5) {
              v = k(t, 5.7 + i * 0.02, 0.3);
              state = 'hit';
            } else {
              v = k(t, 6.0 + (i - 5) * 0.05, 0.35);
              state = 'miss';
            }
          }
          if (v > 0) paint(cell, COLORS[state], v);
          else {
            cell.style.transform = `scale(${lerp(0.8, 1, a)})`;
            paint(cell, null, 0);
          }
        });
      });
      const editCell = rows[2].cells[5];
      if (t > 5.3 && t < 6.0) {
        editCell.style.borderColor = 'var(--red)';
        editCell.style.boxShadow = `0 0 ${18 * Math.abs(Math.sin((t - 5.3) * 9))}px var(--red)`;
      }
      rv(edit, k(t, 5.3, 0.4), -10, 4);
      pop(badges[0], k(t, 2.2, 0.45, E.back));
      pop(badges[1], k(t, 4.1, 0.45, E.back));
      pop(badges[2], k(t, 7.0, 0.45, E.back));
      [2.3, 4.2].forEach((s, i) => {
        const v = k(t, s, 0.45);
        pins[i].style.opacity = v;
        pins[i].style.transform = `scaleY(${v})`;
      });
      rv(pinL, k(t, 2.4, 0.4), 8, 4);
      rvWords(fw, t, 7.4, 0.03, 0.6);
    };
  }
);

scene(
  9.6,
  {
    pre: 2.2,
    holds: [
      [3.75, 1.2],
      [5.9, 1.8],
      [7.5, 3.0],
    ],
    toBar: 21,
  },
  (root) => {
    const c = copy.why;
    header(root, '04', c);
    const toks = c.tokens;
    const [changed, replacement] = c.change;
    const X0 = 264;
    const STEP = 202;
    const CY = 520;
    const KY = 630;
    const label = 'font-family:Maple;font-size:19px;color:var(--dim)';
    const rowL = [
      text(root, 120, CY + 24, c.rowToken, label),
      text(root, 120, KY + 14, c.rowKv, label),
    ];
    const chips = toks.map((w, i) => at(el('div', 'chip', root, w), X0 + i * STEP, CY));
    const kvs = toks.map((_, i) => at(el('div', 'kv', root, ''), X0 + i * STEP, KY));
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', 1920);
    svg.setAttribute('height', 1080);
    svg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
    root.appendChild(svg);
    const cx = (i) => X0 + i * STEP + 90;
    const arcs = [0, 1, 2, 3, 4, 5].map((i) => {
      const p = document.createElementNS(svgNS, 'path');
      const x1 = cx(6);
      const x2 = cx(i);
      const y = CY - 6;
      const h = 30 + (6 - i) * 16;
      p.setAttribute('d', `M ${x1} ${y} C ${x1} ${y - h}, ${x2} ${y - h}, ${x2} ${y}`);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', '#B794F6');
      p.setAttribute('stroke-width', '3');
      p.setAttribute('pathLength', '1');
      p.setAttribute('stroke-dasharray', '1');
      p.setAttribute('stroke-linecap', 'round');
      svg.appendChild(p);
      return p;
    });
    const arcL = text(
      root,
      cx(6) - 540,
      CY - 150,
      c.attention,
      'font-family:Maple;font-size:19px;color:var(--purple);width:500px;text-align:right'
    );
    const prefixHash = (list, i) => hash(list.slice(0, i + 1).join('|'));
    const edited = toks.map((w, j) => (j === changed ? replacement : w));
    const before = toks.map((_, i) => prefixHash(toks, i));
    const after = toks.map((_, i) => prefixHash(edited, i));
    const okLine = at(el('div', 'a', root), X0, KY + 70, changed * STEP - 22, 2);
    okLine.style.background = 'var(--green)';
    const okL = text(
      root,
      X0,
      KY + 84,
      c.reused,
      'font-family:Maple;font-size:21px;color:var(--green)'
    );
    const noLine = at(
      el('div', 'a', root),
      X0 + changed * STEP,
      KY + 70,
      (7 - changed) * STEP - 22,
      2
    );
    noLine.style.background = 'var(--red)';
    const noL = text(
      root,
      X0 + changed * STEP,
      KY + 84,
      c.recomputed,
      'font-family:Maple;font-size:21px;color:var(--red)'
    );
    const card = (x, title, body) => {
      const e = at(el('div', 'card', root), x, 820, 820, 130);
      e.innerHTML = `<div style="padding:26px 32px"><div style="font-size:28px;font-weight:600;letter-spacing:-.02em">${title}</div><div style="font-size:23px;color:var(--muted);margin-top:8px">${body}</div></div>`;
      return e;
    };
    const c1 = card(120, c.card1Title, c.card1Body);
    const c2 = card(980, c.card2Title, c.card2Body);
    return (t) => {
      rowL.forEach((l, i) => rv(l, k(t, 0.8 + i * 0.4, 0.5), 0, 4, -20));
      const frame = Math.floor((t * FPS) / 2);
      chips.forEach((chip, i) => {
        rv(chip, k(t, 0.8 + i * 0.07, 0.5, E.expo), 24, 6);
        if (i === changed) {
          const sw = k(t, 4.4, 0.3);
          chip.textContent = sw > 0.5 ? replacement : toks[i];
          chip.style.borderColor = sw > 0 ? `rgba(255,107,107,${sw})` : 'var(--line)';
          chip.style.color = sw > 0.5 ? 'var(--red)' : 'var(--text)';
          chip.style.transform = `scale(${1 + 0.08 * Math.sin(Math.PI * sw)})`;
        }
      });
      kvs.forEach((kv, i) => {
        const s = 1.2 + i * 0.18;
        kv.style.opacity = k(t, s - 0.2, 0.3);
        let val = t < s + 0.35 ? scramble(i * 9, frame) : before[i];
        let tone = 'var(--purple)';
        if (i >= changed) {
          const rs = 4.8 + (i - changed) * 0.22;
          if (t >= rs) {
            val = t < rs + 0.4 ? scramble(i * 13, frame) : after[i];
            tone = 'var(--red)';
          }
        } else if (t >= 4.8) tone = 'var(--green)';
        kv.textContent = val;
        kv.style.color = tone;
        kv.style.borderColor = tone === 'var(--purple)' ? 'rgba(183,148,246,.25)' : tone;
        kv.style.background =
          tone === 'var(--green)'
            ? 'rgba(74,222,128,.08)'
            : tone === 'var(--red)'
              ? 'rgba(255,107,107,.08)'
              : 'rgba(183,148,246,.08)';
      });
      const fade = 1 - k(t, 4.2, 0.4);
      arcs.forEach((p, i) => {
        p.setAttribute('stroke-dashoffset', 1 - k(t, 2.6 + (5 - i) * 0.1, 0.6, E.inOut));
        p.style.opacity = fade;
      });
      arcL.style.opacity = k(t, 2.8, 0.4) * fade;
      [okLine, noLine].forEach((l, i) => {
        const v = k(t, 4.9 + i * 0.3, 0.5);
        l.style.opacity = v;
        l.style.transformOrigin = 'left';
        l.style.transform = `scaleX(${v})`;
      });
      rv(okL, k(t, 5.0, 0.4), 10, 4);
      rv(noL, k(t, 5.4, 0.4), 10, 4);
      rv(c1, k(t, 6.5, 0.6), 30, 8);
      rv(c2, k(t, 6.8, 0.6), 30, 8);
    };
  }
);

scene(
  7.4,
  {
    pre: 1.6,
    holds: [
      [2.8, 1.8],
      [4.85, 2.5],
    ],
    toBar: 26,
  },
  (root) => {
    const c = copy.bill;
    header(root, '05', c);
    const prices = [
      [0.2, 'var(--green)'],
      [4, 'var(--blue)'],
      [5, 'var(--amber)'],
      [8, '#FF9F2E'],
    ];
    const BX = 760;
    const PX = 115;
    const R = prices.map(([price, color], i) => {
      const [field, desc, mult] = c.rows[i];
      const y = 400 + i * 104;
      const l = at(el('div', 'a', root), 120, y);
      l.innerHTML = `<div class="mono" style="font-size:24px;color:var(--text)">${field}</div><div style="font-size:21px;color:var(--muted);margin-top:4px">${desc}</div>`;
      const b = at(el('div', 'bar', root), BX, y + 2, 0, 56);
      b.style.background = color;
      const p = text(
        root,
        BX,
        y + 6,
        '',
        `font-family:Maple;font-size:32px;font-weight:500;color:${color}`
      );
      const m = text(root, BX, y + 14, mult, 'font-family:Maple;font-size:21px;color:var(--muted)');
      return { l, b, p, m, price };
    });
    const foot = at(el('div', 'a', root), 120, 840, 1680);
    foot.style.cssText += 'font-size:40px;font-weight:600;letter-spacing:-.025em';
    const fw = words(foot, c.foot);
    const pills = row(root, 120, 920, 16);
    const ps = c.pills.map((label) => {
      const p = el('div', 'pill', pills, label);
      p.style.cssText +=
        'position:static;background:var(--panel2);border:1px solid var(--line);color:var(--text)';
      return p;
    });
    return (t) => {
      R.forEach((r, i) => {
        rv(r.l, k(t, 0.8 + i * 0.2, 0.5), 0, 6, -30);
        const v = k(t, 1.1 + i * 0.22, 1.0, E.expo);
        const w = Math.max(6, r.price * PX * v);
        r.b.style.width = w + 'px';
        r.b.style.opacity = k(t, 1.1 + i * 0.22, 0.2);
        r.p.style.left = BX + w + 22 + 'px';
        r.p.textContent = money(r.price * v);
        r.p.style.opacity = k(t, 1.1 + i * 0.22, 0.3);
        r.m.style.left = BX + w + 170 + 'px';
        r.m.style.opacity = k(t, 1.6 + i * 0.22, 0.4);
      });
      rvWords(fw, t, 3.2, 0.04, 0.6);
      ps.forEach((p, i) => rv(p, k(t, 4.1 + i * 0.2, 0.5), 14, 4));
    };
  }
);

scene(
  9.6,
  {
    pre: 2.0,
    holds: [
      [6.38, 2.0],
      [7.85, 2.5],
    ],
    toBar: 32,
  },
  (root) => {
    const c = copy.ttl;
    header(root, '06', c);
    const AX = 400;
    const PPM = 33;
    const TY = [500, 650];
    const xm = (m) => AX + m * PPM;
    const trackL = c.tracks.map(([a, b], i) => {
      const l = at(el('div', 'a', root), 120, TY[i] - 20);
      l.innerHTML = `<div class="mono" style="font-size:24px">${a}</div><div style="font-size:19px;color:var(--muted);margin-top:4px">${b}</div>`;
      const base = at(el('div', 'a', root), AX, TY[i] - 1, 40 * PPM, 2);
      base.style.background = 'var(--line)';
      return [l, base];
    });
    const bands = [
      [0, 0, 14, 'var(--green)'],
      [0, 14, 32, 'rgba(255,107,107,.28)'],
      [0, 32, 40, 'var(--green)'],
      [1, 0, 40, 'var(--green)'],
    ].map(([tr, a, b, color]) => {
      const d = at(el('div', 'a', root), xm(a), TY[tr] - 7, 0, 14);
      d.style.background = color;
      d.style.borderRadius = '7px';
      return { d, a, b };
    });
    const dots = [];
    [0, 1].forEach((tr) =>
      [0, 3, 6, 9, 32].forEach((m) => {
        const d = at(el('div', 'a', root), xm(m) - 11, TY[tr] - 11, 22, 22);
        d.style.cssText += 'border-radius:50%;background:var(--text);border:4px solid var(--bg)';
        if (m === 32) d.style.background = tr === 0 ? 'var(--red)' : 'var(--green)';
        dots.push({ d, m });
      })
    );
    const ticks = [0, 10, 20, 30, 40].map((m) =>
      text(
        root,
        xm(m) - 60,
        720,
        m ? `${m} ${c.minutes}` : '0',
        'font-family:Maple;font-size:19px;color:var(--dim);width:120px;text-align:center'
      )
    );
    const head = at(el('div', 'a', root), AX, 440, 2, 270);
    head.style.background = 'rgba(255,255,255,.35)';
    const headL = text(
      root,
      AX,
      412,
      '',
      'font-family:Maple;font-size:18px;color:var(--muted);width:120px;text-align:center'
    );
    const resetL = text(
      root,
      xm(0),
      TY[0] - 52,
      c.reset,
      'font-family:Maple;font-size:19px;color:var(--green)'
    );
    const expL = text(
      root,
      xm(14) + 10,
      TY[0] + 18,
      c.expired,
      'font-family:Maple;font-size:19px;color:var(--red)'
    );
    const brk = text(
      root,
      xm(20.5) - 200,
      TY[0] + 58,
      c.lunch,
      'font-family:Maple;font-size:20px;color:var(--muted);width:400px;text-align:center'
    );
    const badge = (label, y, color, bg) => {
      const b = el('div', 'pill', root, label);
      b.style.cssText += `left:auto;right:${1920 - (xm(32) - 24)}px;top:${y}px;background:${bg};color:${color};border:1px solid ${color};transform-origin:right center`;
      return b;
    };
    const miss = badge(c.miss, TY[0] - 62, 'var(--red)', 'rgba(255,107,107,.13)');
    const hit = badge(c.hit, TY[1] - 62, 'var(--green)', 'rgba(74,222,128,.12)');
    const plans = row(root, 120, 830, 16);
    const conf = c.plans.map(([a, b], i) => {
      const overage = i === 2;
      const p = el(
        'div',
        'pill',
        plans,
        `<span style="color:var(--muted)">${a}</span>&nbsp;&nbsp;<span style="color:${overage ? 'var(--red)' : 'var(--text)'}">${b}</span>`
      );
      p.style.cssText += `position:static;background:var(--panel);border:1px solid ${overage ? 'rgba(255,107,107,.6)' : 'var(--line)'};font-size:21px;padding:12px 20px`;
      return p;
    });
    const ov = text(
      root,
      120,
      905,
      c.override,
      'font-family:Maple;font-size:19px;color:var(--dim)'
    );
    return (t) => {
      trackL.forEach(([l, b], i) => {
        rv(l, k(t, 0.7 + i * 0.15, 0.5), 0, 6, -30);
        b.style.opacity = k(t, 0.8, 0.5);
      });
      ticks.forEach((e, i) => (e.style.opacity = k(t, 0.9 + i * 0.05, 0.4)));
      const T = 40 * k(t, 1.1, 5.0, E.inOut);
      bands.forEach((b) => (b.d.style.width = clamp(T - b.a, 0, b.b - b.a) * PPM + 'px'));
      dots.forEach(({ d, m }) =>
        pop(d, k(t, 1.1 + 5.0 * (m / 40) * 0.9, 0.3, E.back) * (T >= m - 0.3 ? 1 : 0))
      );
      const live = (t > 1.0 && t < 6.4 ? 1 : clamp(1 - (t - 6.4) * 3)) * k(t, 1.0, 0.3);
      head.style.left = xm(T) + 'px';
      head.style.opacity = live;
      headL.style.left = xm(T) - 60 + 'px';
      headL.style.opacity = live;
      headL.textContent = `${Math.round(T)} ${c.minutes}`;
      rv(resetL, T > 6 ? k(t, 2.2, 0.4) : 0, 8, 4);
      expL.style.opacity = T > 14 ? 1 : 0;
      rv(brk, T > 18 ? k(t, 3.4, 0.5) : 0, 8, 4);
      pop(miss, T >= 32 ? k(t, 5.3, 0.45, E.back) : 0);
      pop(hit, T >= 32 ? k(t, 5.45, 0.45, E.back) : 0);
      conf.forEach((p, i) => rv(p, k(t, 6.6 + i * 0.18, 0.5), 16, 6));
      rv(ov, k(t, 7.3, 0.5), 8, 4);
    };
  }
);

scene(
  7.8,
  {
    pre: 1.4,
    holds: [
      [3.15, 1.5],
      [5.05, 3.0],
    ],
    toBar: 37,
  },
  (root) => {
    const c = copy.turn;
    header(root, '07', c);
    const values = [
      [0.036, 3, 'var(--green)'],
      [0.41, 2, '#A3A9B4'],
      [0.51, 2, 'var(--red)'],
      [0.82, 2, 'var(--red)'],
    ];
    const BX = 640;
    const PX = 1000 / 0.82;
    const R = values.map(([v, d, color], i) => {
      const [a, b] = c.rows[i];
      const y = 400 + i * 100;
      const l = at(el('div', 'a', root), 120, y + 6);
      l.innerHTML = `<span style="font-size:30px;font-weight:500">${a}</span>${b ? `<span class="mono" style="font-size:20px;color:var(--muted);margin-left:14px">${b}</span>` : ''}`;
      const bar = at(el('div', 'bar', root), BX, y, 0, 56);
      bar.style.background = color;
      const p = text(
        root,
        BX,
        y + 6,
        '',
        `font-family:Maple;font-size:32px;font-weight:500;color:${color}`
      );
      return { l, bar, p, v, d };
    });
    const noRef = at(el('div', 'a', root), BX + 0.41 * PX, 380, 2, 400);
    noRef.style.cssText +=
      'background:repeating-linear-gradient(to bottom,rgba(255,255,255,.35) 0 6px,transparent 6px 12px)';
    const foot = at(el('div', 'a', root), 120, 830, 1700);
    foot.style.cssText += 'font-size:48px;font-weight:600;letter-spacing:-.03em';
    const fw = words(foot, c.foot);
    const note = at(el('div', 'a', root), 120, 908, 1700);
    note.style.cssText += 'font-size:26px;color:var(--muted)';
    const nw = words(note, c.note);
    return (t) => {
      R.forEach((r, i) => {
        rv(r.l, k(t, 0.8 + i * 0.18, 0.5), 0, 6, -30);
        const v = k(t, 1.1 + i * 0.3, 1.0, E.expo);
        const w = Math.max(6, r.v * PX * v);
        r.bar.style.width = w + 'px';
        r.bar.style.opacity = k(t, 1.1 + i * 0.3, 0.2);
        r.p.style.left = BX + w + 22 + 'px';
        r.p.textContent = money(r.v * v, r.d);
        r.p.style.opacity = k(t, 1.1 + i * 0.3, 0.3);
      });
      noRef.style.opacity = k(t, 2.6, 0.5) * 0.9;
      rvWords(fw, t, 3.2, 0.05, 0.6);
      rvWords(nw, t, 4.0, 0.02, 0.6);
    };
  }
);

scene(7.8, { pre: 1.6, holds: [[3.65, 4.0]], toBar: 43 }, (root) => {
  const c = copy.breaks;
  header(root, '08', c);
  const cols = [
    [c.breaks, 'var(--red)', 'rgba(255,107,107,.13)', '×', c.breakList],
    [c.keeps, 'var(--green)', 'rgba(74,222,128,.12)', '✓', c.keepList],
  ];
  const items = [];
  const heads = cols.map(([name, color, bg, icon, list], ci) => {
    const x = ci ? 1000 : 120;
    const h = text(
      root,
      x,
      392,
      `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${color};margin-right:14px;vertical-align:middle"></span>${name}`,
      `font-family:Maple;font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:${color}`
    );
    list.forEach((s, i) => {
      const r = at(el('div', 'a', root), x, 450 + i * 66, 860, 54);
      r.style.cssText += 'display:flex;align-items:center;gap:18px';
      r.innerHTML = `<span style="flex:none;width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:${color};background:${bg}">${icon}</span><span class="mono" style="font-size:25px">${s}</span>`;
      items.push({ r, i, ci });
    });
    return h;
  });
  const note = text(root, 120, 880, c.note, 'font-size:22px;color:var(--muted)');
  return (t) => {
    heads.forEach((h, i) => rv(h, k(t, 0.8 + i * 0.1, 0.5), 10, 4));
    items.forEach(({ r, i, ci }) => rv(r, k(t, 1.0 + i * 0.2 + ci * 0.1, 0.55, E.expo), 0, 8, -40));
    rv(note, k(t, 3.0, 0.6), 10, 4);
  };
});

scene(
  7.2,
  {
    pre: 2.2,
    holds: [
      [3.3, 1.0],
      [4.2, 1.2],
      [5.9, 1.5],
    ],
    toBar: 49,
  },
  (root) => {
    const c = copy.advisor;
    header(root, '09', c);
    const BASE = 800;
    const MAXH = 280;
    const X0 = 140;
    const STEP = 80;
    const slot = (i) => i + (i > 4 ? 1 : 0);
    const h = (i) => ((i + 1) / 10) * MAXH;
    const axis = at(el('div', 'a', root), X0 - 10, BASE, 980, 2);
    axis.style.background = 'var(--line)';
    const axisL = text(
      root,
      X0 - 10,
      BASE + 12,
      c.turns,
      'font-family:Maple;font-size:18px;color:var(--dim)'
    );
    const column = (x, i, css) => {
      const e = at(el('div', 'a', root), x, BASE - h(i), 48, h(i));
      e.style.cssText += `border-radius:8px 8px 3px 3px;transform-origin:bottom;${css}`;
      return e;
    };
    const cols = [...Array(10)].map((_, i) =>
      column(X0 + slot(i) * STEP, i, 'background:var(--green);border-top:8px solid var(--amber)')
    );
    const calls = [4, 9].map((i) =>
      column(
        X0 + (slot(i) + 1) * STEP,
        i,
        'background:var(--red);box-shadow:0 0 30px rgba(255,107,107,.35)'
      )
    );
    const legend = row(root, X0 - 10, BASE + 48, 48);
    const legendItems = ['var(--green)', 'var(--red)'].map((color, i) => {
      const e = el(
        'div',
        'mono',
        legend,
        `<span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:${color};margin-right:12px;vertical-align:-1px"></span>${c.legend[i]}`
      );
      e.style.cssText += 'font-size:19px;color:var(--muted)';
      return e;
    });
    const when = text(
      root,
      188,
      452,
      c.when,
      'font-family:Maple;font-size:20px;color:var(--red);width:900px;text-align:right'
    );
    const RX = 1240;
    const big = text(
      root,
      RX - 8,
      420,
      '',
      'font-size:150px;font-weight:700;letter-spacing:-.06em;line-height:1'
    );
    const bigL = text(root, RX, 590, c.bigLabel, 'font-size:24px;color:var(--muted)');
    const priced = (y, color, label) => {
      const bar = at(el('div', 'bar', root), RX, y, 0, 44);
      bar.style.background = color;
      const price = text(
        root,
        RX,
        y + 4,
        '',
        `font-family:Maple;font-size:28px;font-weight:500;color:${color}`
      );
      const caption = text(
        root,
        RX,
        y + 52,
        label,
        'font-family:Maple;font-size:18px;color:var(--muted)'
      );
      return { bar, price, caption };
    };
    const cold = priced(650, 'var(--red)', c.uncached);
    const warm = priced(740, 'var(--green)', c.warm);
    const off = el('div', 'pill', root, '/advisor off');
    at(off, 120, 900);
    off.style.cssText +=
      'font-size:26px;padding:10px 22px;background:rgba(255,181,71,.12);color:var(--amber);border:1px solid rgba(255,181,71,.45)';
    const offL = text(root, 384, 911, c.offNote, 'font-size:23px;color:var(--muted)');
    const PX = 160;
    const grow = (p, value, v, start) => {
      const w = Math.max(6, value * PX * v);
      p.bar.style.width = w + 'px';
      p.price.style.left = RX + w + 18 + 'px';
      p.price.textContent = money(value * v);
      p.price.style.opacity = k(start, 0, 0.3);
    };
    return (t) => {
      axis.style.opacity = k(t, 0.4, 0.4);
      axisL.style.opacity = k(t, 0.5, 0.4);
      cols.forEach((col, i) => {
        const v = k(t, 0.6 + i * 0.15, 0.5, E.expo);
        col.style.opacity = clamp(v * 3);
        col.style.transform = `scaleY(${v})`;
      });
      legendItems.forEach((l, i) => rv(l, k(t, 0.9 + i * 1.8, 0.5), 8, 4));
      [2.6, 3.5].forEach((s, i) => {
        const v = k(t, s, 0.6, E.back);
        calls[i].style.opacity = clamp(v * 3);
        calls[i].style.transform = `scaleY(${v})`;
      });
      rv(when, k(t, 3.7, 0.5), 8, 4);
      big.textContent = Math.round(700 * k(t, 4.4, 1.2, E.expo)) + 'k';
      rv(big, k(t, 4.3, 0.4), 20, 6);
      rv(bigL, k(t, 4.6, 0.5), 10, 4);
      grow(cold, 2.8, k(t, 4.8, 1.0, E.expo), t - 4.8);
      grow(warm, 0.14, k(t, 5.0, 1.0, E.expo), t - 5.0);
      rv(cold.caption, k(t, 5.0, 0.4), 6, 3);
      rv(warm.caption, k(t, 5.2, 0.4), 6, 3);
      rv(off, k(t, 6.1, 0.5, E.back), 14, 4);
      rv(offL, k(t, 6.4, 0.5), 10, 4);
    };
  }
);

scene(
  10,
  {
    pre: 0.6,
    holds: [
      [2.85, 4.0],
      [8.05, 1.0],
    ],
    toBar: 55,
  },
  (root) => {
    const c = copy.habits;
    header(root, '10', c);
    const rows = c.list.map((s, i) => {
      const r = at(el('div', 'a', root), 120, 300 + i * 92, 1680);
      r.style.cssText +=
        'display:flex;align-items:baseline;gap:28px;font-size:36px;letter-spacing:-.015em';
      const n = el('span', 'mono', r, String(i + 1).padStart(2, '0'));
      n.style.cssText = 'font-size:22px;color:var(--amber);width:36px;flex:none';
      words(el('span', '', r), s);
      return r;
    });
    const out = el('div', 'a', root);
    out.style.cssText =
      'left:0;top:0;width:1920px;height:1080px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center';
    const o1 = el('div', 'mono', out, c.rule);
    o1.style.cssText =
      'font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:var(--amber);margin-bottom:28px';
    const o2 = el('div', '', out);
    o2.style.cssText =
      'font-size:80px;font-weight:600;letter-spacing:-.04em;line-height:1.1;width:1500px';
    const ow = words(o2, c.ruleLine);
    const o3 = el('div', '', out);
    o3.style.cssText = 'font-size:30px;color:var(--muted);margin-top:36px';
    const o3w = words(o3, c.ruleSub);
    const url = el('div', 'mono', out, 'melmayan.fr');
    url.style.cssText = 'font-size:24px;color:var(--dim);margin-top:80px;letter-spacing:.06em';
    return (t) => {
      const gone = k(t, 5.5, 0.5, E.inOut);
      root.querySelectorAll('.kicker,.h1').forEach((e) => {
        e.style.opacity = 1 - gone;
        e.style.filter = gone ? `blur(${gone * 8}px)` : 'none';
      });
      rows.forEach((r, i) => {
        rv(r, k(t, 0.8 + i * 0.28, 0.6, E.expo), 0, 8, -40);
        if (gone) {
          r.style.opacity = Math.min(+r.style.opacity, 1 - gone);
          r.style.filter = `blur(${gone * 8}px)`;
        }
      });
      rv(o1, k(t, 5.9, 0.5), 10, 4);
      rvWords(ow, t, 6.0, 0.05, 0.8);
      rvWords(o3w, t, 6.8, 0.03, 0.6);
      rv(url, k(t, 7.4, 0.6), 10, 4);
    };
  }
);

const DURATION = cursor;
const brand = el('div', 'brand', stage, copy.brand);
const prog = el('div', 'progress', stage);
const fill = el('i', '', prog);
scenes.forEach((s) => (el('b', '', prog).style.left = (s.start / DURATION) * 100 + '%'));

function render(t) {
  document.getElementById('grid').style.transform =
    `translate(${(t * 6) % 40}px,${(t * 3) % 40}px)`;
  for (const s of scenes) {
    const on = t >= s.start - 0.001 && t < s.end + 0.001;
    s.root.style.visibility = on ? 'visible' : 'hidden';
    if (!on) continue;
    const last = s === scenes[scenes.length - 1];
    const ex = last ? k(t, s.end - 0.6, 0.6, E.inOut) : k(t, s.end - 0.45, 0.45, E.inOut);
    s.root.style.opacity = 1 - ex;
    s.root.style.transform = `translateY(${-24 * ex}px)`;
    s.root.style.filter = ex > 0 ? `blur(${ex * 10}px)` : 'none';
    s.upd(t - s.start);
  }
  const chrome = k(t, scenes[1].start - 0.6, 0.6) * (1 - k(t, DURATION - 0.6, 0.6));
  brand.style.opacity = chrome;
  prog.style.opacity = chrome;
  fill.style.width = (t / DURATION) * 100 + '%';
}

window.__duration = DURATION;
window.__chapters = scenes.map((s) => Math.round(s.start * 10) / 10);
window.__render = render;
render(Number(new URLSearchParams(location.search).get('t') || 0));
