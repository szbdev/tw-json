# tw-json

[![npm version](https://badge.fury.io/js/tw-json.svg)](https://www.npmjs.com/package/tw-json)

A simple and customizable JSON viewer component built with React and styled using Tailwind CSS. Perfect for easily displaying JSON data in your web applications with a clean and modern look.

## Features

- **JSON Syntax Highlighting:** Presents your JSON data with clear and readable syntax highlighting.
- **Collapsible Nodes:** Easily expand and collapse objects and arrays to navigate complex JSON structures.
- **Tailwind CSS Styling:** Integrates seamlessly with your Tailwind CSS projects, offering easy customization of the viewer's appearance.
- **React Component:** A straightforward React component that you can drop into your application.
- **Lightweight:** Designed to be small and efficient.

## Installation

You can install `tw-json` using npm or yarn:

```bash
npm install tw-json
# or
yarn add tw-json
```

## Props

All the available props bellow

| Prop                      | Description                                               | Default     |
| ------------------------- | --------------------------------------------------------- | ----------- |
| `jsonData` (required)     | The JSON data to be visualized.                           | —           |
| `classNames`              | An object to override class names for various JSON types. | `{}`        |
| `classNames.keyClass`     | Custom class for keys.                                    | `undefined` |
| `classNames.numberClass`  | Custom class for numbers.                                 | `undefined` |
| `classNames.stringClass`  | Custom class for strings.                                 | `undefined` |
| `classNames.booleanClass` | Custom class for booleans.                                | `undefined` |
| `classNames.nullClass`    | Custom class for `null` values.                           | `undefined` |
| `classNames.arrayClass`   | Custom class for arrays.                                  | `undefined` |
| `classNames.objectClass`  | Custom class for objects.                                 | `undefined` |
| `defaultExpandAll`        | Whether to expand all nodes by default.                   | `false`     |
| `showType`                | Whether to show the data type next to each value.         | `true`      |
| `theme`                   | The color theme of the viewer.                            | `'light'`   |
| `showToolbox`             | Whether to show the toolbox (e.g., copy/export buttons).  | `false`     |

```tsx
import JsonViewer from 'tw-json'

const myJson = {
  name: "Alice",
  age: 30,
  isAdmin: false,
  roles: ["user", "editor"],
  meta: null
}

<JsonViewer
  jsonData={myJson}
  defaultExpandAll={true}
  theme="dark"
  showType={true}
  showToolbox={true}
/>
```

## Todo

- [x] Add customizable class names
- [ ] Add usage documentation and examples
- [ ] Better view and customizable options
