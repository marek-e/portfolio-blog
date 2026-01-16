export async function initMermaidDiagrams() {
  const containers = document.querySelectorAll('[data-mermaid-chart]');
  if (containers.length === 0) return;

  const mermaid = (await import('mermaid')).default;
  const isDark = document.documentElement.classList.contains('dark');

  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'base',
    securityLevel: 'loose',
    fontFamily: 'inherit',
  });

  containers.forEach(async (container, index) => {
    const chart = container.getAttribute('data-chart');
    if (!chart || container.hasAttribute('data-mermaid-rendered')) return;

    container.setAttribute('data-mermaid-rendered', '');

    try {
      const { svg } = await mermaid.render(`mermaid-diagram-${index}-${Date.now()}`, chart);
      container.innerHTML = svg;
      container.classList.remove('min-h-32');
    } catch (err) {
      container.innerHTML = `
        <div class="text-red-600 dark:text-red-400">
          <p class="font-medium">Mermaid diagram error:</p>
          <pre class="mt-2 text-xs overflow-auto">${err instanceof Error ? err.message : 'Failed to render'}</pre>
        </div>
      `;
    }
  });
}

// Re-render on theme change
export function setupMermaidThemeObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        // Remove rendered flag to allow re-render
        document.querySelectorAll('[data-mermaid-rendered]').forEach((el) => {
          el.removeAttribute('data-mermaid-rendered');
        });
        initMermaidDiagrams();
      }
    });
  });
  observer.observe(document.documentElement, { attributes: true });
}
