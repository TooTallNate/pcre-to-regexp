
/**
 * Module exports.
 */

module.exports = PCRE;

/**
 * Returns a JavaScript RegExp instance from the given PCRE-compatible string.
 * Flags may be passed in after the final delimiter in the `format` string.
 *
 * An empty array may be passsed in as the second argument, which will be
 * populated with the "named capture group" names as Strings in the Array,
 * once the RegExp has been returned.
 *
 * @param {String} pattern - PCRE regexp string to compile to a JS RegExp
 * @param {Array} [namedCaptures] - optional empty array, which will be populated with the named captures extracted from the PCRE regexp
 * @return {RegExp} returns a JavaScript RegExp instance from the given `pattern` and optionally `flags`
 * @public
 */

function PCRE (pattern, namedCaptures) {
  pattern = String(pattern || '').trim();
  var originalPattern = pattern;
  var delim;
  var flags = '';

  // A delimiter can be any non-alphanumeric, non-backslash,
  // non-whitespace character.
  var hasDelim = /^[^a-zA-Z\\\s]/.test(pattern);
  if (hasDelim) {
    delim = pattern[0];
    var lastDelimIndex = pattern.lastIndexOf(delim);

    // pull out the flags in the pattern
    flags += pattern.substring(lastDelimIndex + 1);

    // strip the delims from the pattern
    pattern = pattern.substring(1, lastDelimIndex);
  }

  // populate namedCaptures array and removed named captures from the `pattern`
  pattern = pattern.replace(/\(\?P<([^\>]+)>([^\)]+)\)/g, function (capture, name, regexp) {
    if (namedCaptures) namedCaptures.push(name);
    return '(' + regexp + ')';
  });

  // TODO: convert PCRE-only flags to JS
  // TODO: handle lots more stuff....
  // http://www.php.net/manual/en/reference.pcre.pattern.syntax.php

  var regexp = new RegExp(pattern, flags);

  regexp.delimiter = delim;
  regexp.pcrePattern = originalPattern;
  regexp.pcreFlags = flags;

  return regexp;
}
