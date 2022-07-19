import { storyNameFromExport, sanitize } from '@storybook/csf';

export function getStoryLabel(id: string, storyFn: any): string {
  if (storyFn) {
    if (typeof storyFn === 'function') {
      if (storyFn.story?.name) {
        return storyFn.story?.name;
      }
    } else if (storyFn.name) {
      return storyFn.name;
    }
    if (storyFn.storyName) {
      return storyFn.storyName;
    }
  }
  return sanitize(storyNameFromExport(id));
}

