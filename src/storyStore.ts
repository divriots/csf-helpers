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

export class StoryStore {
  _target = new EventTarget();
  _stories: Record<string, () => Promise<any>> = {};
  cachedCSFFiles: Record<string, CSFFile>;
  projectAnnotations: NormalizedProjectAnnotations;

  // events
  on(eventName: 'story-file', listener: (e:StoryFileEvent) => void): () => void {
    this._target.addEventListener(eventName, listener);
    return () => this._target.removeEventListener(eventName, listener);
  }
  once(eventName: 'story-file', listener: (e:StoryFileEvent) => void): () => void {
    this._target.addEventListener(eventName, listener, { once: true });
    return () => this._target.removeEventListener(eventName, listener);
  }
  off(eventName: 'story-file', listener: (e:StoryFileEvent) => void) {
    return this._target.removeEventListener(eventName, listener);
  }
  
  setProjectAnnotations(projectAnnotations: ProjectAnnotations) {
    this.projectAnnotations = normalizeProjectAnnotations(projectAnnotations);
  }

  getStoryFiles(): Record<string, () => Promise<any>> {
    return this._stories;
  }

  load(file: string, moduleImport: () => Promise<any>): void {
    this._stories[file] = moduleImport;
    this._target.dispatchEvent(new StoryFileEvent(file, moduleImport, this.projectAnnotations));
  }
  loadModules(modules: Record<string, () => Promise<any>>): void {
    Object.entries(modules).forEach(([file, moduleImport]) => {
      this.load(file, moduleImport);
    })
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