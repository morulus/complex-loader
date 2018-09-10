complex-loader
==

[![npm version](https://img.shields.io/npm/v/complex-loader.svg)](https://www.npmjs.com/package/complex-loader)

Combine results from multiple loaders into one object.

You are not limited to a way to describe options and nested loaders.

```js
{
  test: /\.md$/,
  exclude: /node_modules/,
  use: {
    loader : `complex-loader`,
    options: {
      attributes: [
        `json-loader`,
        `yaml-loader`,
        {
          loader : `front-matter-loader`,
          options: {
            onlyAttributes: true,
          },
        },
      ],
      Component: [
        {
          loader : `markdown-feat-react-loader`,
          options: {
            replace(code) {
              return code.replace('debugger;', '')
            },
            importImages: true,
          }
        },
        {
          loader : `front-matter-loader`,
          options: {
            onlyBody: true,
          },
        },
      ],
    },
  }
}
```

Notice
--

If you are import a resource from the outside the directory where _node_modules_ have placed, resolve loaders absolute paths.

```js
[
  require.resolve(`json-loader`),
  require.resolve(`yaml-loader`)
]
```

Author and license
--

Vladimir Kalmykov <vladimirmorulus@gmail.com>

Under [MIT](https://github.com/morulus/complex-loader/blob/master/LICENSE) license, 2018

See also
--

- [invoke-loader](https://github.com/morulus/invoke-loader) Resolve and invoke loader and options, the paths to which are specified in the options
- [git-commits-loader](https://github.com/morulus/git-commits-loader) Collect information about file commits
- [markdown-heading-loader](https://github.com/morulus/markdown-heading-loader) Just get primary heading of markdown document
- [markdown-feat-react-loader](https://github.com/morulus/markdown-feat-react-loader) Use React components directly in markdown
