import { initStoryContext } from './initStoryContext';
import type { Story } from './storybook-extra-types'
import type { ViewMode, Args } from '@storybook/csf'

export async function renderStory(story: Story, el: HTMLElement, viewMode: ViewMode = 'story', abortSignal?: AbortSignal, queryArgs?: Args) {
  const storyContext = await initStoryContext(
    story,
    el,
    viewMode,
    abortSignal,
    queryArgs
  );
  return story.renderToDOM(
    {
      ...story,
      storyFn: () => story.unboundStoryFn(storyContext),
      storyContext,
    },
    el
  );
}