function createBevelMap(width: number, height: number, radius: number) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(width / 2);
  canvas.height = Math.ceil(height / 2);
  const context = canvas.getContext('2d');
  if (!context) return '';

  const image = context.createImageData(canvas.width, canvas.height);
  const bevel = 22;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const px = ((x + 0.5) / canvas.width - 0.5) * width;
      const py = ((y + 0.5) / canvas.height - 0.5) * height;
      const qx = Math.abs(px) - (width / 2 - radius);
      const qy = Math.abs(py) - (height / 2 - radius);
      const corner = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
      const depth = radius - (corner + Math.min(Math.max(qx, qy), 0));
      const bend = depth > 0 && depth < bevel ? Math.sin((depth / bevel) * Math.PI) : 0;
      const nx = corner > 0 ? Math.max(qx, 0) / corner : Number(qx > qy);
      const ny = corner > 0 ? Math.max(qy, 0) / corner : Number(qy >= qx);
      const index = (y * canvas.width + x) * 4;

      image.data[index] = 128 + Math.sign(px) * nx * bend * 127;
      image.data[index + 1] = 128 + Math.sign(py) * ny * bend * 127;
      image.data[index + 2] = 128;
      image.data[index + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
  return canvas.toDataURL();
}

export function initGlassRefraction(cards: HTMLElement[], enabled: () => boolean) {
  const sizes = new WeakMap<HTMLElement, string>();

  const update = (card: HTMLElement) => {
    const layer = card.querySelector<HTMLElement>('.card-3d-refraction');
    const map = card.querySelector<SVGFEImageElement>('.card-3d-displacement-map');
    if (!layer || !map) return;

    if (!enabled()) {
      layer.removeAttribute('data-refraction-ready');
      return;
    }

    const width = card.offsetWidth;
    const height = card.offsetHeight;
    if (!width || !height) return;

    const radius = Math.min(
      parseFloat(getComputedStyle(card).borderTopLeftRadius),
      width / 2,
      height / 2
    );
    const size = `${width}:${height}:${radius}`;
    if (sizes.get(card) !== size) {
      const source = createBevelMap(width, height, radius);
      if (!source) return;
      map.setAttribute('href', source);
      sizes.set(card, size);
    }

    layer.setAttribute('data-refraction-ready', '');
  };

  const observer = new ResizeObserver((entries) => {
    entries.forEach(({ target }) => update(target as HTMLElement));
  });
  cards.forEach((card) => observer.observe(card));

  return {
    refresh: () => cards.forEach(update),
    destroy: () => observer.disconnect(),
  };
}
