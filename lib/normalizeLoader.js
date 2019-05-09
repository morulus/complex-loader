"use strict";
/*
 * Bringing the use definition to the standard shape { loader, options }
 or query string
 */

module.exports = function normalizeLoader(use) {
  if (typeof use === `string`) {
    return use;
  } else if (typeof use === `object`) {
    if (use instanceof Array) {
      return use.map(normalizeLoader);
    }

    var loader = use.loader,
        options = use.options;

    if (!loader || typeof loader !== `string`) {
      throw new TypeError(`The loader should be a string`);
    } else if (typeof options === `object`) {
      return {
        loader,
        options
      };
    } else {
      /* Force string if there are no options */
      return loader;
    }
  } else {
    throw new Error(`Invalid loader type ${typeof use}`);
  }
};