import type { AnyFramework, ProjectAnnotations } from '@storybook/csf';
import type { NormalizedProjectAnnotations } from './storybook-extra-types';
import { normalizeInputTypes } from './normalizeInputTypes';
import * as defaultRender from './defaultRender';

export function normalizeProjectAnnotations<TFramework extends AnyFramework>({
  argTypes,
  globalTypes,
  argTypesEnhancers,
  ...annotations
}: ProjectAnnotations<TFramework>): NormalizedProjectAnnotations<TFramework> {
  return {
    ...(argTypes && { argTypes: normalizeInputTypes(argTypes) }),
    ...(globalTypes && { globalTypes: normalizeInputTypes(globalTypes) }),
    argTypesEnhancers: [
      ...(argTypesEnhancers || []),
    ],
    ...defaultRender,
    ...annotations,
  };

}