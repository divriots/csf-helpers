// imported from https://github.com/storybookjs/storybook/tree/next/lib/store/src (MIT)

import type {
  ArgTypes,
  GlobalTypes,
  InputType,
  StrictArgTypes,
  StrictGlobalTypes,
  StrictInputType,
} from '@storybook/csf';

const normalizeType = (type: InputType['type']): StrictInputType['type'] => {
  return typeof type === 'string' ? { name: type } : type;
};

const normalizeControl = (
  control: InputType['control']
): StrictInputType['control'] =>
  typeof control === 'string' ? { type: control } : control;

export const normalizeInputType = (
  inputType: InputType,
  key: string
): StrictInputType => {
  const { type, control, ...rest } = inputType;
  const normalized: StrictInputType = {
    name: key,
    ...rest,
  };
  if (type) normalized.type = normalizeType(type);
  if (control) {
    normalized.control = normalizeControl(control);
  } else if (control === false) {
    normalized.control = { disable: true };
  }
  return normalized;
};

export const normalizeInputTypes = (
  inputTypes: ArgTypes | GlobalTypes
): StrictArgTypes | StrictGlobalTypes =>
  Object.fromEntries(
    Object.entries(inputTypes).map(([k, v]) => [k, normalizeInputType(v, k)])
  );
