import type {
  CSFFile,
  StoryDefault
} from './storybook-extra-types';
import { normalizeStory } from './normalizeStory';
import { normalizeComponentAnnotations } from './normalizeComponentAnnotations';
import { getStories } from './getStories';
import { autoTitle } from './autoTitle';

// Given the raw exports of a CSF file, check and normalize it.
export function processCSFFile(
  moduleExports: any,
  importPath: string,
  title?: string
): CSFFile {
  const moduleDefault = (moduleExports.default || {}) as StoryDefault;
  const meta = normalizeComponentAnnotations(
    moduleDefault,
    title || moduleDefault.title || autoTitle(importPath) || 'Stories',
    importPath
  );

  return {
    meta,
    stories: getStories(moduleExports).map((key) =>
      normalizeStory(key, moduleExports[key], meta)
    ),
  };
}
