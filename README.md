# CSF helpers

This is a collection of helper functions to manipulate, combine and resolve CSF stories.

## Table of Contents

- [Install](#install)
- [Usage](#usage)

## Install


```sh
$ npm install --save @divriots/csf-helpers
```

```javascript
import { ... } from "@divriots/csf-helpers";
```

## Usage

```js
import {
  normalizeProjectAnnotations,
  processCSFFile,
  prepareStory,
  renderStory
} from "@divriots/csf-helpers";

// normalizes project annotations (render, renderToDOM, globals, parameters ...)
const projectAnnotations = normalizeProjectAnnotations({
  parameters: {
    layout: 'centered'
  }
});

const module = await import('./stories.js')

// returns normalized component annotations, plus list of (normalized)
//  stories in the given module
const { meta, stories } = processCSFFile(module, './stories.js');

// prepares story for rendering, binds decorators, loaders, renderers
const prepared = prepareStory(stories[0], meta, projectAnnotations);

// renders story in given DOM element, returns dispose function to unmount
const dispose = await renderStory(
  prepared,
  document.getElementById('root')
)

