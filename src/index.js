const loaderUtils = require(`loader-utils`);
const mapValues = require(`lodash.mapvalues`);
const map = require(`lodash.map`);
const memoize = require(`lodash.memoize`);
const babel = require(`babel-core`);

const normalizeLoader = require(`./normalizeLoader`);
const querifyLoader = require(`./querifyLoader`);
/**
 * Convert objective use definitions to string query. I use memoize function
 * for performance reasons. Practically this transformation should be
 * performed once. But since loaders don't have an initial stage, outside
 * Map is the only way to prepare internal data.
 */
const shapeToQueries = memoize(function (shape) {
  return mapValues(
      shape,
      (use, key) => Reflect.apply(
            querifyLoader,
            this,
            [
              normalizeLoader(use, key),
              key
            ]
          )
      );
});

/* Babel repl */
const repl = (code) => babel.transform(code, {
  presets: [
    [
require.resolve(`babel-preset-env`), {
      targets: {
        ie: 10
      }
    }
]
  ],
  ast: false,
  babelrc: false,
  comments: false,
  compact: true,
  filename: `md.chunk.js`,
  sourceType: `module`
});

module.exports = function () {};

module.exports.pitch = function richLoader() {
  const shape = loaderUtils.getOptions(this);

  try {
    const queries = Reflect.apply(shapeToQueries, this, [shape]);
    const output = map(
      queries,
      (query, key) => `module.exports[${JSON.stringify(key)}]=require('!${query}!${this.resourcePath}');`
    );

    /* Const result = repl(`
       module.exports = {
       ${output.join(`,\n`)}
       }
       `).code; */

    return `module.exports = {};${output.join(`\n`)}`;
  } catch (e) {
    this.emitError(e);
  }

  return `
    module.exports = {}
  `;
};