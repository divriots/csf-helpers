import { render } from '../src/defaultRender';

try {
  class Test extends HTMLElement {} 
  customElements.define('test-elt', Test);
} catch (e) {}

export const renderStory = () => render({textContent: 'textContent'}, {component: customElements.get('test-elt')})