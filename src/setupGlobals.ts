import type { CSFFile, NormalizedProjectAnnotations } from './storybook-extra-types';
import { processCSFFile } from './processCSFFile';
import { prepareStory } from './prepareStory';

export function setupGlobals(
  stories: { [file: string]: () => Promise<any> },
  projectAnnotations: NormalizedProjectAnnotations
) {
  let cachedCSFFiles: CSFFile[];
  const storyStore = {
    async cacheAllCSFFiles() {
      cachedCSFFiles = await Promise.all(
        Object.entries(stories).map(async ([file, moduleImport]) =>
          processCSFFile(await moduleImport(), file)
        )
      );
    },
    extract() {
      if (!cachedCSFFiles) {
        throw new Error(
          'Cannot call extract() unless you call cacheAllCSFFiles() first.'
        );
      }
      return Object.fromEntries(
        cachedCSFFiles.flatMap((csf) =>
          csf.stories.map((story) => [
            story.id,
            prepareStory(story, csf.meta, projectAnnotations),
          ])
        )
      );
    },
  };
  (window as any).__STORYBOOK_STORY_STORE__ = storyStore;
  (window as any).__STORYBOOK_CLIENT_API__ = {
    storyStore,
  };
}
