"use strict";

var loaderUtils = require(`loader-utils`);
var mapValues = require(`lodash.mapvalues`);
var map = require(`lodash.map`);
var memoize = require(`lodash.memoize`);
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

module.exports = function () {};

module.exports.pitch = function richLoader() {
  var _this2 = this;

  var shape = loaderUtils.getOptions(this);

  try {
    var queries = Reflect.apply(shapeToQueries, this, [shape]);
    var output = map(queries, function (query, key) {
      return `[${JSON.stringify(key)}]: require('!${query}!${_this2.resourcePath}')`;
    });

    return `
      module.exports = {
        ${output.join(`,\n`)}
      }
    `;
  } catch (e) {
    this.emitError(e);
  }

  return `
    module.exports = {}
  `;
};