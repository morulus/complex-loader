/**
 * Because invoke-loader doesn't exist in the target environment,
 * complex-loader must provide access to it.
 *
 * This file should use only with internal mechanisms.
 */
const invokeLoader = require(`invoke-loader`);

module.exports = invokeLoader;