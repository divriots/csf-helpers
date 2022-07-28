import type { NormalizedProjectAnnotations } from './storybook-extra-types';
import { getStoryStore } from './getStoryStore'

export function setupGlobals(
  stories: { [file: string]: () => Promise<any> },
  projectAnnotations: NormalizedProjectAnnotations
) {
  const storyStore = getStoryStore();
  storyStore.projectAnnotations = projectAnnotations;
  Object.entries(stories).forEach(([file, moduleImport]) => {
    storyStore.load(file, moduleImport);
  })
}
