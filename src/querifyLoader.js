const uuid4 = require(`uuid4`);
const objectHash = require(`object-hash`);
const resolve = require(`resolve`);
const fixWinOsPathSep = require(`./fixWinOsPathSep`);
const invokePath = require.resolve(`../invoke.js`);

/*
No matter what loader is, this function should return query string.
*/
module.exports = function querifyLoader(use, key) {
  if (typeof use === `string`) {
    return use;
  } else if (typeof use === `object`) {
    if (use instanceof Array) {
      return use.map(querifyLoader.bind(this)).join(`!`);
    }

    try {
      const { loader, options } = use;

      const resolvedUse = resolve.sync(
        loader,
        { basedir: this.context }
      );

      /* Build loader uid */
      const uid = uuid4();

      /* Since pitch execute just once for each file it's enough to create
       * a unique key without the chance of a memory leak.
       *  */
      const propertyLoaderUid = `${uid}/${key}/${loader}/${objectHash(options)}`;

      require.cache[propertyLoaderUid] = {
        exports: options
      };

      /* InvokePath & resolvedUse shouldn't have Windows-style path separators in according
      * to the issue https://github.com/morulus/complex-loader/issues/1 */
      return `${fixWinOsPathSep(invokePath)}?options=${propertyLoaderUid}&loader=${fixWinOsPathSep(resolvedUse)}&cache`;
    } catch (e) {
      throw new Error(e);
    }
  }
};