// imported from https://github.com/storybookjs/storybook/tree/next/lib/store/src (MIT)

import type { ArgTypes } from '@storybook/csf';

export const getValuesFromArgTypes = (argTypes: ArgTypes = {}): ArgTypes =>
  Object.entries(argTypes).reduce((acc, [arg, { defaultValue }]) => {
    if (typeof defaultValue !== 'undefined') {
      acc[arg] = defaultValue;
    }
    return acc;
  }, {} as ArgTypes);
