import type {
  NormalizedProjectAnnotations,
  Story,
  StoryDefault,
  StoryObj,
} from './storybook-extra-types';
import { normalizeStory } from './normalizeStory';
import { normalizeComponentAnnotations } from './normalizeComponentAnnotations';
import { prepareStory } from './prepareStory';
import { autoTitle } from './autoTitle';

export function initStory(
  storyFn: StoryObj,
  key: string,
  moduleDef: StoryDefault = {},
  storyPath?: string,
  projectAnnotations: NormalizedProjectAnnotations = {}
): Story {
  const normalizedCmp = normalizeComponentAnnotations(
    moduleDef,
    moduleDef.title || autoTitle(storyPath) || 'Stories',
    storyPath
  );
  const normalized = normalizeStory(key, storyFn, normalizedCmp);

  return prepareStory(normalized, normalizedCmp, projectAnnotations);
}

