complex-loader
==

[![npm version](https://img.shields.io/npm/v/complex-loader.svg)](https://www.npmjs.com/package/complex-loader)

Webpack complex loader. Allows you to perform import by the several rules at once.

## Usage

### Writing rules

Describe the desired result shape in the *complex-loader* options. The shape is a plain object. Each shape property should contain the rule of loading.

For example:
```js
{
  test: /\.md$/,
  loader : 'complex-loader',
  options:  {
    raw: `raw-loader`,
    html: `html-loader!markdown-loader`,
    heading: `markdown-heading-loader`,
    ...
  }
}
```

The rule can be described as [inline](https://webpack.js.org/concepts/loaders/#inline) query:

For example:
```js
`yaml-loader!front-matter-loader?attributesOnly`
```

Or as a plain object (similar to the [Webpack rule](https://webpack.js.org/concepts/loaders/#configuration) use property):

For example:
```js
{
  loader: 'front-matter-loader',
  options: {
    attributesOnly: true
  }
}
```

Or a combinations of these:

```js
[
  'bundle-loader?lazy!markdown-loader',
  {
    loader: 'front-matter-loader',
    options: {
      bodyOnly: true
    }
  }
]
```

### Harvest

The import result will be always an object, with the shape you described.

```js
import summary from 'index.md'

console.log(typeof summary); // object
```

Each property of which will contain the result of the loaders, which described for its key in the shape.

```js
{
  heading: 'Hello, world',
  frontMatter: {
    id: 'hello_world'
  },
  content: '----\nid: hello_world----\nHello, world\n=='
}
```

### Code splitting

If you prefer to get standard file content concurrent with its metadata, just put the standard rule to one of the properties of the shape:

```js
{
  test: /\.js$/,
  loader: `complex-loader`,
  options: {
    Component: `babel-loader`,
    heading: `markdown-heading-loader`
  }
}
```

```js
import summary from './MyComponent';

render(summary.Component)
```

But real benefit can be obtained by adding `bundle-loader` to the loaders chain. Bundle loader creates the separated bundle for this file, and `lazy` option prevent its immediate loading. In this way, you make your module much lightweight. This is especially useful for loading hundreds of resources.

For example, you can load all files from a certain directory, but got only a lightweight array of headings and functions for load real resource.

```js
{
  test: /\.js$/,
  loader: `complex-loader`,
  options: {
    getComponent: `bundle-loader?lazy!html-loader!markdown-loader`,
    heading: `markdown-heading-loader`
  }
}
```

### Use with another loaders in a chain

*complex-loader* is a pitch loader. It means that you can not use this loader to continue processing data of any other loader. It always looks to the source.

Features
--

### No options stringifying

This loader does not strongly requires only stringifiable options. Instead, it caches original options in memory and transfer them to a loader later, therefor options keeps original.

This allows you to use the functions, circular values and other non-serializable data in loader options.

### Nested rules

You can specify *complex-loader* as sub-loader, by gaining the ability to create nested structures.

```js
{
  test: /\.md$/,
  loader: 'complex-loader',
  options: {
    metadata: {
      loader: 'complex-loader',
      options: {
        heading: 'markdown-heading-loader'
      }
    }
  }
}
```

Install
--

```shell
yarn add complex-loader --dev
```

Issues and pre-release
--

The loader has not yet been tested in all the nuances. The caching method has not yet shown its reliability. Therefore, there may be anomalies. Keep this in mind.

For now there is few doubtful moments:

- Should I implement in-build nesting? For now you can created nested structures only by defining `complex-loader` again as child loader. But why not make support for nested objects? And how in this case to distinguish the nested object is a shape of the loader?
- Support functional loaders. Now there is opportunity to pass directly the function as a loader, instead of the string. May it be in demand?
- Caching options - it is good or bad? And what underwater rocks awaits us here?

Author and license
--

Morulus <vladimirmorulus@gmail.com>

Under [MIT](https://github.com/morulus/complex-loader/blob/master/LICENSE) license, 2018

See also
--

- [invoke-loader](https://github.com/morulus/invoke-loader) Resolve and invoke loader and options, the paths to which are specified in the options
- [git-commits-loader](https://github.com/morulus/git-commits-loader) Collect information about file commits
- [markdown-heading-loader](https://github.com/morulus/markdown-heading-loader) Just get primary heading of markdown document
- [markdown-feat-react-loader](https://github.com/morulus/markdown-feat-react-loader) Use React components directly in markdown
