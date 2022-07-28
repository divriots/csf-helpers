import { StoryStore } from './storyStore';

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

