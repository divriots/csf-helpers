import type {
  Story,
  StoryDefault,
  StoryObj,
} from './storybook-extra-types';
import { normalizeStory } from './normalizeStory';
import { normalizeComponentAnnotations } from './normalizeComponentAnnotations';
import { prepareStory } from './prepareStory';

export function initStory(
  storyFn: StoryObj,
  key: string,
  moduleDef: StoryDefault,
  storyPath?: string
): Story {
  const normalizedCmp = normalizeComponentAnnotations(
    moduleDef,
    moduleDef.title || 'Stories',
    storyPath
  );
  const normalized = normalizeStory(key, storyFn, normalizedCmp);

  return prepareStory(normalized, normalizedCmp, {});
}

