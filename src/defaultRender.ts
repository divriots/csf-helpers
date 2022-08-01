import type { StoryContext } from '@storybook/csf';
import type { RenderContext } from './storybook-extra-types';

export function render(args, { id, component }: StoryContext)  {
  if (!component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }
  if (component.prototype instanceof HTMLElement) {
    const ret = new component();
    if (args) {
      for (let [key, value] of Object.entries(args)) {
        // basic attribute/property inference
        if (key in ret) {
          ret[key] = value;
          continue;
        }
        if (typeof value === 'undefined' || value === false) {
          value = null;
        }
        if (value === true) {
          value = '';
        }
        if (value === null) {
          ret.removeAttribute(key);
        } else {
          ret.setAttribute(key, '' + value);
        }
      }
    }
    return ret;
  }
  throw new Error(
    `Unable to render story ${id} as no framework render implementation has been provided`
  );
}

export async function renderToDOM(
  { storyFn }: RenderContext,
  domElement: Element
): Promise<() => void> {
  const node = storyFn();
  if (node instanceof Element && node.nodeType === 1) {
    domElement.appendChild(node);
    return () => domElement.removeChild(node);
  } else if (typeof node === 'string') {
    domElement.innerHTML = node;
    return () => domElement.innerHTML = ''
  }
}
