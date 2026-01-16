export function initCopyButtons() {
  document.querySelectorAll('[data-copy-button]').forEach((button) => {
    if (button.hasAttribute('data-copy-initialized')) return;
    button.setAttribute('data-copy-initialized', '');

    button.addEventListener('click', async () => {
      const pre = button.closest('.relative')?.querySelector('pre');
      if (!pre) return;

      const code = pre.textContent ?? '';
      await navigator.clipboard.writeText(code);

      const copyIcon = button.querySelector('[data-copy-icon]');
      const checkIcon = button.querySelector('[data-check-icon]');

      // Animate out copy icon
      copyIcon?.classList.add('scale-0');

      setTimeout(() => {
        copyIcon?.classList.add('hidden');
        checkIcon?.classList.remove('hidden');
        checkIcon?.classList.add('flex');
        // Trigger reflow for animation
        if (checkIcon instanceof HTMLElement) void checkIcon.offsetWidth;
        checkIcon?.classList.remove('scale-0');
        checkIcon?.classList.add('scale-100');
        button.setAttribute('aria-label', 'Copied!');
      }, 150);

      setTimeout(() => {
        // Animate out check icon
        checkIcon?.classList.remove('scale-100');
        checkIcon?.classList.add('scale-0');

        setTimeout(() => {
          checkIcon?.classList.add('hidden');
          checkIcon?.classList.remove('flex');
          copyIcon?.classList.remove('hidden');
          if (copyIcon instanceof HTMLElement) void copyIcon.offsetWidth;
          copyIcon?.classList.remove('scale-0');
          button.setAttribute('aria-label', 'Copy code');
        }, 150);
      }, 2000);
    });
  });
}
