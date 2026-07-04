// Small SVG-building helpers shared by every generated asset.

/** Deterministic PRNG (mulberry32) so scattered details are reproducible run to run. */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Smooth closed blob through points placed around (cx, cy) at per-point radii.
 * `radii` is an array of {angle?, r} or plain radius numbers spread evenly.
 * Catmull-Rom → cubic bezier for a soft, organic outline.
 */
export function blobPath(cx, cy, radii, { rotate = 0, squashY = 1 } = {}) {
  const pts = radii.map((r, i) => {
    const radius = typeof r === 'number' ? r : r.r;
    const angle =
      rotate +
      (typeof r === 'object' && r.angle !== undefined ? r.angle : (i / radii.length) * Math.PI * 2);
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius * squashY,
    };
  });
  return catmullRomClosed(pts);
}

/** Closed Catmull-Rom spline through `pts`, emitted as cubic beziers. */
export function catmullRomClosed(pts) {
  const n = pts.length;
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d + ' Z';
}

/** Open smoothed path through waypoints (for roads / rivers). */
export function smoothOpenPath(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Soft contact shadow under an object (sun top-left → shadow bottom-right, PRD §8.1). */
export function shadow(cx, cy, rx, ry, opacity = 0.16) {
  return `<ellipse cx="${cx + rx * 0.12}" cy="${cy + ry * 0.25}" rx="${rx}" ry="${ry}" fill="rgba(30,40,30,${opacity})"/>`;
}

export function svgDoc(width, height, body, defs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${defs ? `<defs>${defs}</defs>` : ''}${body}</svg>`;
}
