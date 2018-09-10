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
            config: require.resolve(`./react-markdown.config.js`),
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
      headings: [
        {
          loader: 'skeleton-loader',
          options: {
            procedure: function customProcedure(ast) {
              /* ... */
            }
          }
        }
      ]
    },
  }
}
```

Will export the following structure:

```js
{
  attributes: {/* Markdown attributes */},
  Component: function(...) {/* React component */}
}
```

Distant resources
--

If you are importing a resource from the outside the directory where *node_modules* have placed, specify loaders absolute paths by using `require.resolve`.

```js
[
  require.resolve(`json-loader`),
  require.resolve(`yaml-loader`)
]
```

This is because, on the nested level, the paths to the loaders will be resolved relative to the directory in which your file is located.

Inside itself
--

You can specify as nested loader the same `complex-loader`.

```js
{
  test: /\.png/,
  exclude: /node_modules/,
  use: {
    loader : `complex-loader`,
    options: {
      deeper: {
        loader: `complex-loader`,
        options: {
          and: {
            loader: `complex-loader`,
            options: {
              deeper: 'url-loader'
            }
          }
        }
      }
    }
  }
}
// Will give:
/*
{
  deeper: {
    and: {
      deeper: 'path/to/file.png'
    }
  }
}
*/
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
