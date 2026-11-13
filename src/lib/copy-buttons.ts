export function initCopyButtons() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll<HTMLElement>('[data-copy-button]').forEach((button) => {
    if (button.hasAttribute('data-copy-initialized')) return;
    button.setAttribute('data-copy-initialized', '');
    let resetTimer: ReturnType<typeof setTimeout>;

    button.addEventListener('click', async (event) => {
      const pre = button.closest('.relative')?.querySelector('pre');
      if (!pre) return;

      const immediate = event.detail === 0 || reducedMotion.matches;
      await navigator.clipboard.writeText(pre.textContent ?? '');

      clearTimeout(resetTimer);
      button.toggleAttribute('data-copy-instant', immediate || reducedMotion.matches);
      button.setAttribute('data-copied', '');
      button.setAttribute('aria-label', 'Copied!');
      resetTimer = setTimeout(() => {
        button.toggleAttribute('data-copy-instant', immediate || reducedMotion.matches);
        button.removeAttribute('data-copied');
        button.setAttribute('aria-label', 'Copy code');
      }, 2000);
    });
  });
}
