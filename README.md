# tw-json

[![npm version](https://badge.fury.io/js/tw-json.svg)](https://www.npmjs.com/package/tw-json)

A simple and customizable JSON viewer component built with React and styled using Tailwind CSS. Perfect for easily displaying JSON data in your web applications with a clean and modern look.

## Features 🚀

- 🦾 100% TypeScript
- 🎨 Customizable: Key, value, editable, copy, select... Anything you can think of!
- 🌈 Theme support: light or dark or with custom classNames with TailwindCss.
- 📋 Copy to Clipboard

## Installation

You can install `tw-json` using npm or yarn:

```bash
npm install tw-json
# or
yarn add tw-json
```

## Props

All the available props bellow

| Prop                  | Description                                               | Default   |
| --------------------- | --------------------------------------------------------- | --------- |
| `jsonData` (required) | The JSON data to be visualized.                           | —         |
| `classNames`          | An object to override class names for various JSON types. | `{}`      |
| `defaultExpandAll`    | Whether to expand all nodes by default.                   | `false`   |
| `showType`            | Whether to show the data type next to each value.         | `true`    |
| `theme`               | The color theme of the viewer.                            | `'light'` |
| `showToolbox`         | Whether to show the toolbox (e.g., copy/export buttons).  | `false`   |
| `toolboxOptions`      | Control what to show in the toolbox, see bellow.          | `{}`      |

ClassNames props

| Prop           | Description                     | Default |
| -------------- | ------------------------------- | ------- |
| `keyClass`     | Custom class for keys.          | `""`    |
| `numberClass`  | Custom class for numbers.       | `""`    |
| `stringClass`  | Custom class for strings.       | `""`    |
| `booleanClass` | Custom class for booleans.      | `""`    |
| `nullClass`    | Custom class for `null` values. | `""`    |
| `arrayClass`   | Custom class for arrays.        | `""`    |
| `objectClass`  | Custom class for objects.       | `""`    |

toolboxOptions props

| Prop         | Description                           | Default |
| ------------ | ------------------------------------- | ------- |
| `showSearch` | Display the search box or not.        | `true`  |
| `showExport` | Display the download as JSON button.  | `true`  |
| `showCopy`   | Display the copy to clipboard button. | `true`  |

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

## Share your work and tag me so I can see what you can do with my package

- [X / Twitter](https://x.com/szbdev)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/szbdev)
