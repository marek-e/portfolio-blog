export function createFooterPreview(button: HTMLButtonElement, initial: number) {
  const scene = button.closest<HTMLElement>('.footer-scene');
  const day = scene?.querySelector<HTMLElement>('.footer-art-day');
  let disposed = false;
  let ready = false;
  let value = initial;
  const update = (next: number) => {
    value = next;
    if (!ready || !scene || !day) return;
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
      day.style.removeProperty('opacity');
    },
  };
}
