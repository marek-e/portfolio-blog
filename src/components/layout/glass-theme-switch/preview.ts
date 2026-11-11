export function createFooterPreview(button: HTMLButtonElement, initial: number) {
  const scene = button.closest<HTMLElement>('.footer-scene');
  const day = scene?.querySelector<HTMLElement>('.footer-art-day');
  let disposed = false;
  let ready = false;
  let value = initial;
  const update = (next: number) => {
    value = next;
    if (!ready || !scene || !day) return;
    scene.style.setProperty('--footer-daylight', `${(next * 100).toFixed(3)}%`);
    scene.dataset.previewTone = next > 0.5 ? 'day' : 'night';
    scene.dataset.previewMidpoint = next > 0.2 && next < 0.8 ? '' : 'false';
    day.style.opacity = String(next);
  };
  if (scene && day) {
    Promise.all(
      ['/images/footer-day-v1.webp', '/images/footer-night-v1.webp'].map((src) => {
        const image = new Image();
        image.src = src;
        return image.decode();
      })
    )
      .then(() => {
        if (disposed) return;
        ready = true;
        scene.dataset.themePreview = '';
        update(value);
      })
      .catch(() => {});
  }
  return {
    update,
    destroy() {
      disposed = true;
      if (!scene || !day) return;
      delete scene.dataset.themePreview;
      delete scene.dataset.previewTone;
      delete scene.dataset.previewMidpoint;
      scene.style.removeProperty('--footer-daylight');
      day.style.removeProperty('opacity');
    },
  };
}
