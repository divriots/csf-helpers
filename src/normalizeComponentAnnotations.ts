// imported from https://github.com/storybookjs/storybook/tree/next/lib/store/src (MIT)

import { sanitize } from '@storybook/csf';
import type { AnyFramework } from '@storybook/csf';

import { normalizeInputTypes } from './normalizeInputTypes';
import {
  NormalizedComponentAnnotations,
  StoryDefault,
} from './storybook-extra-types';

export function normalizeComponentAnnotations<TFramework extends AnyFramework>(
  defaultExport: StoryDefault<TFramework>,
  title: string = defaultExport.title!,
  importPath?: string
): NormalizedComponentAnnotations<TFramework> {
  const { id, argTypes, ...rest } = defaultExport;
  return {
    id: sanitize(id || title),
    ...rest,
    title,
    // @ts-ignore
    ...(argTypes && { argTypes: normalizeInputTypes(argTypes) }),
    parameters: {
      fileName: importPath,
      ...defaultExport.parameters,
    },
  };
}
