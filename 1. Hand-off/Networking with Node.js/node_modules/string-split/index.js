'use strict'

/*!
 * imports.
 */

var curry2 = require('curry2')

/*!
 * exports.
 */

module.exports = curry2(split)

/**
 * A curried `String.prototype.split` with support
 * for splitting by String, RegExp, or Function.
 *
 * @param {String|RegExp|Function} splitBy
 * String, RegExp, or Function to split by.
 *
 * @param {String} string
 * String to split.
 *
 * @return {Array}
 * List of split string parts.
 */

function split (splitBy, string) {
  return (typeof splitBy === 'function')
  ? predicate(splitBy, string)
  : string.split(splitBy)
}

/**
 * Split via predicate function.
 *
 * @param {Function} fn
 * Predicate function.
 *
 * @param {String} string
 * String to split.
 *
 * @return {Array}
 * List of split string parts.
 */

function predicate (fn, string) {
  var idx = -1
  var end = string.length
  var out = []
  var buf = ''

  while (++idx < end) {
    if (fn(string[idx], idx) === true) {
      if (buf) out.push(buf)
      buf = ''
    } else {
      buf += string[idx]
    }
  }

  if (buf) out.push(buf)
  return out
}
