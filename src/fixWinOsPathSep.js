const replace = require(`lodash.replace`);

const SEP_REGEXP = /\\/g;

/*
In a case of using this loader in Windows OS, the resource path should have
no Windows-style path separators. It sounds like an absurd, but it is a fact,
that resourcePath with backslashes lead to error "Can't resolve path"
under Windows OS.
The issue: https://github.com/morulus/complex-loader/issues/1
*/
module.exports = function fixWinOSPathSep(pathname, sep) {
  return replace(pathname, sep || SEP_REGEXP, `/`);
};