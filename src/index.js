const loaderUtils = require(`loader-utils`);
const mapValues = require(`lodash.mapvalues`);
const map = require(`lodash.map`);
const memoize = require(`lodash.memoize`);
const normalizeLoader = require(`./normalizeLoader`);
const querifyLoader = require(`./querifyLoader`);
const fixWinOsPathSep = require(`./fixWinOsPathSep`);

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

module.exports = function () {};

module.exports.pitch = function richLoader() {
  const shape = loaderUtils.getOptions(this);

  try {
    const queries = Reflect.apply(shapeToQueries, this, [shape]);
    const output = map(
      queries,
      (query, key) => {
        const webpackStyleQuery = `${query}!${fixWinOsPathSep(this.resourcePath)}`;
        return `module.exports[${JSON.stringify(key)}]=require('!${webpackStyleQuery}');`;
      }
    );

    return `module.exports = {};${output.join(`\n`)}`;
  } catch (e) {
    this.emitError(e);
  }

  return `
    module.exports = {}
  `;
};