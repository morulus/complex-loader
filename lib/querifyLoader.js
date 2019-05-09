"use strict";

var uuid4 = require(`uuid4`);

var objectHash = require(`object-hash`);

var resolve = require(`resolve`);
/* DEPRECATED: I use unique values from loader I know to
   build unique for this loader id, but if
   you know best way to do that, make your
   contributing. */

/* Function getLoaderUid(loader) {
   const uid = [];
   if (
   loader._module &&
   loader._module.NormalModule &&
   loader._module.NormalModule.issuer &&
   loader._module.NormalModule.issuer.ContextModule &&
   loader._module.NormalModule.issuer.ContextModule
   ) {
   uid.push(loader._module.NormalModule.issuer.ContextModule.debugId);
   uid.push(loader._module.NormalModule.issuer.ContextModule.regExp);
   } */

/* Sha1 is fastesd way to get string hash, information based on article https://medium.com/@chris_72272/what-is-the-fastest-node-js-hashing-algorithm-c15c1a0e164e*/

/* Return sha1(uid.join(`-`));
   } */


var invokePath = require.resolve(`../invoke.js`);
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
      var loader = use.loader,
          options = use.options;
      var resolvedUse = resolve.sync(loader, {
        basedir: this.context
      });
      /* Build loader uid */

      var uid = uuid4();
      /* Since pitch execute just once for each file it's enough to create
       * a unique key without the danger of a memory leak */

      var propertyLoaderUid = `${uid}/${key}/${loader}/${objectHash(options)}`;
      require.cache[propertyLoaderUid] = {
        exports: options
      };
      return `${invokePath}?options=${propertyLoaderUid}&loader=${resolvedUse}&cache`;
    } catch (e) {
      throw new Error(e);
    }
  }
};