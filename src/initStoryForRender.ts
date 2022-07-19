import {
  Args,
  ViewMode,
  StoryContext,
  StoryContextForLoaders,
} from '@storybook/csf';
import type {
  Story,
} from './storybook-extra-types';

export async function initStoryForRender(
  canvasElement: HTMLElement,
  story: Story,
  viewMode: ViewMode,
  abortSignal?: AbortSignal,
  queryArgs?: Args
): Promise<{ storyFn: () => any; storyContext: StoryContext; story: Story }> {
  const { applyLoaders, unboundStoryFn } = story;

  const args = {
    ...story.initialArgs,
    ...queryArgs,
  };

  const contextWithArgs = {
    ...story,
    args,
    globals: {},
    hooks: null,
  };

  const loadedContext: StoryContext = await applyLoaders({
    ...contextWithArgs,
    viewMode,
  } as StoryContextForLoaders);
  if (abortSignal?.aborted) return {} as any;

  const storyContext: StoryContext = {
    ...loadedContext,
    // By this stage, it is possible that new args/globals have been received for this story
    // and we need to ensure we render it with the new values
    ...contextWithArgs,
    // @ts-ignore undefined in docs
    abortSignal,
    canvasElement,
  };
  return {
    story,
    storyContext,
    storyFn: () => unboundStoryFn(storyContext),
  };
}
