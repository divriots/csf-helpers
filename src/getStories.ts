import {
  isExportStory,
} from '@storybook/csf';
import { StoryDefault } from './storybook-extra-types';

export function getStories(moduleStories: any): string[] {
  const { includeStories, excludeStories } =
    (moduleStories.default as StoryDefault) || {};

  const namedExportsOrder = moduleStories.__namedExportsOrder;

  const exports = Object.keys(moduleStories).filter(
    (id) =>
      id !== 'default' &&
      id !== '__STORY__' &&
      id !== '__namedExportsOrder' &&
      id !== '__LOCATIONS_MAP__' &&
      id !== '__SOURCE_FILE__' &&
      id !== '__FRAMEWORK__' &&
      !/^__/.test(id) &&
      isExportStory(id, { includeStories, excludeStories })
  );

  // No named export order, just send exports
  if (!namedExportsOrder) return exports;

  const stories: string[] = [];

  // Add ordered stories first (if they exist)
  for (let i = 0; i < namedExportsOrder.length; i++) {
    const s = namedExportsOrder[i];
    const index = exports.indexOf(s);
    if (index > -1) {
      stories.push(s);
      exports[index] = '';
    }
  }

  // Add the rest
  for (let i = 0; i < exports.length; i++) {
    const s = exports[i];
    if (s && s !== '') stories.push(s);
  }

  return stories;
}

