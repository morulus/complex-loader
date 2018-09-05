"use strict";

var loaderUtils = require(`loader-utils`);
var mapValues = require(`lodash.mapvalues`);
var map = require(`lodash.map`);
var memoize = require(`lodash.memoize`);
var babel = require(`babel-core`);

var normalizeLoader = require(`./normalizeLoader`);
var querifyLoader = require(`./querifyLoader`);
/**
 * Convert objective use definitions to string query. I use memoize function
 * for performance reasons. Practically this transformation should be
 * performed once. But since loaders don't have an initial stage, outside
 * Map is the only way to prepare internal data.
 */
var shapeToQueries = memoize(function (shape) {
  var _this = this;

  return mapValues(shape, function (use, key) {
    return Reflect.apply(querifyLoader, _this, [normalizeLoader(use, key), key]);
  });
});

/* Babel repl */
var repl = function repl(code) {
  return babel.transform(code, {
    presets: [[require.resolve(`babel-preset-env`), {
      targets: {
        ie: 10
      }
    }]],
    ast: false,
    babelrc: false,
    comments: false,
    compact: true,
    filename: `md.chunk.js`,
    sourceType: `module`
  });
};

module.exports = function () {};

module.exports.pitch = function richLoader() {
  var _this2 = this;

  var shape = loaderUtils.getOptions(this);

  try {
    var queries = Reflect.apply(shapeToQueries, this, [shape]);
    var output = map(queries, function (query, key) {
      return `module.exports[${JSON.stringify(key)}]=require('!${query}!${_this2.resourcePath}');`;
    });

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