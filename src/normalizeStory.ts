// imported from https://github.com/storybookjs/storybook/tree/next/lib/store/src (MIT)

import type {
  NormalizedComponentAnnotations,
  NormalizedStoryAnnotations,
} from './storybook-extra-types';
import type {
  AnyFramework,
  LegacyStoryAnnotationsOrFn,
  StoryId,
  StoryAnnotations,
  StoryFn,
  ArgTypes,
} from '@storybook/csf';
import { storyNameFromExport, toId } from '@storybook/csf';
import { normalizeInputTypes } from './normalizeInputTypes';

export function normalizeStory<TFramework extends AnyFramework>(
  key: StoryId,
  storyAnnotations: LegacyStoryAnnotationsOrFn<TFramework>,
  meta: NormalizedComponentAnnotations<TFramework>
): NormalizedStoryAnnotations<TFramework> {
  let userStoryFn: StoryFn<TFramework>;
  let storyObject: StoryAnnotations<TFramework>;
  if (typeof storyAnnotations === 'function') {
    userStoryFn = storyAnnotations;
    storyObject = storyAnnotations;
  } else {
    storyObject = storyAnnotations;
  }

  const { story } = storyObject;
  if (story) {
    console.warn(`storyFn.story in now deprecated in StoryBook 6.0`);
  }

  const exportName = storyNameFromExport(key);
  const name =
    (typeof storyObject !== 'function' && storyObject.name) ||
    storyObject.storyName ||
    story?.name ||
    exportName;
  const decorators = [
    ...(storyObject.decorators || []),
    ...(story?.decorators || []),
  ];
  const parameters = { ...story?.parameters, ...storyObject.parameters };
  const args = { ...story?.args, ...storyObject.args };
  const argTypes = {
    ...story?.argTypes,
    ...storyObject.argTypes,
  } as ArgTypes;
  const loaders = [...(storyObject.loaders || []), ...(story?.loaders || [])];
  const { render, play } = storyObject;

  // eslint-disable-next-line no-underscore-dangle
  const id = parameters.__id || toId(meta.id || meta.title!, exportName);
  return {
    id,
    name,
    decorators,
    parameters,
    args,
    argTypes: normalizeInputTypes(argTypes),
    loaders,
    ...(render && { render }),
    // @ts-ignore
    ...(userStoryFn && { userStoryFn }),
    ...(play && { play }),
  };
}
