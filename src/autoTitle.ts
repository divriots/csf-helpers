export function autoTitle(file: string): string {
  const parts = file
    .replace(/([^/])\.[^/.]*?$/, '$1') // strip extension
    .split('/')
    .map((it) => it.replace(/\.stories$/, '')) // strip stories suffix
    .filter(
      (it) => it && it !== 'stories' && it !== 'index' && it !== 'src' && it !== '..' && it !== '.'
    );
  return parts.filter((it, i) => it !== parts[i - 1]).join('/');
}

