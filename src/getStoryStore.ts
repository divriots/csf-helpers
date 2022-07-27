import type { CSFFile, NormalizedProjectAnnotations } from './storybook-extra-types';
import type { ProjectAnnotations } from '@storybook/csf';
import { processCSFFile } from './processCSFFile';
import { prepareStory } from './prepareStory';
import { normalizeProjectAnnotations } from './normalizeProjectAnnotations';

export class StoryFileEvent extends Event {
  constructor(public file: string, public importer: () => Promise<any>, public projectAnnotations: NormalizedProjectAnnotations) {
    super('story-file', {});
  }
}

export class StoryStore extends EventTarget {
  _stories: Record<string, () => Promise<any>> = {};
  cachedCSFFiles: Record<string, CSFFile>;
  projectAnnotations: NormalizedProjectAnnotations;

  setProjectAnnotations(projectAnnotations: ProjectAnnotations) {
    this.projectAnnotations = normalizeProjectAnnotations(projectAnnotations);
  }

  load(file: string, moduleImport: () => Promise<any>): void {
    this._stories[file] = moduleImport;
    this.dispatchEvent(new StoryFileEvent(file, moduleImport, this.projectAnnotations));
  }
  async cacheAllCSFFiles(): Promise<void> {
    this.cachedCSFFiles = Object.fromEntries(await Promise.all(
      Object.entries(this._stories).map(async ([file, moduleImport]) =>
        [file, processCSFFile(await moduleImport(), file)]
      )
    ));
  }
  extract() {
    if (!this.cachedCSFFiles) {
      throw new Error(
        'Cannot call extract() unless you call cacheAllCSFFiles() first.'
      );
    }
    return Object.fromEntries(
      Object.values(this.cachedCSFFiles).flatMap((csf) =>
        csf.stories.map((story) => [
          story.id,
          prepareStory(story, csf.meta, this.projectAnnotations),
        ])
      )
    );
  }
}

export function getStoryStore(): StoryStore {
  let storyStore: StoryStore = (window as any).__STORYBOOK_STORY_STORE__;
  if (!storyStore) {
    storyStore = new StoryStore();
    (window as any).__STORYBOOK_STORY_STORE__ = storyStore;
    (window as any).__STORYBOOK_CLIENT_API__ = {
      storyStore,
    };
  }
  return storyStore;
}
