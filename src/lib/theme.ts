export type Theme = 'light' | 'dark';

export function getTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function applyTheme(next: Theme) {
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  if (next === system) localStorage.removeItem('theme');
  else localStorage.setItem('theme', next);
  document.documentElement.classList.toggle('dark', next === 'dark');
}
