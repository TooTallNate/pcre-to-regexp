
/**
 * Module exports.
 */

module.exports = PCRE;

/**
 * Returns a JavaScript RegExp instance from the given PCRE-compatible string.
 * Flags may be passed in after the final delimiter in the first argument, or
 * as a combination string as the second argument (like in the regular JavaScript
 * constructor).
 *
 * @param {String} pattern - PCRE regexp string to compile to a JS RegExp
 * @param {String} [flags] - optional "flags" string, a combination of single-letter PCRE "flags" to enable
 * @return {RegExp} returns a JavaScript RegExp instance from the given `pattern` and optionally `flags`
 * @public
 */

function PCRE (pattern, flags) {
  pattern = String(pattern || '').trim();
  var originalPattern = pattern;
  var delim;

  // A delimiter can be any non-alphanumeric, non-backslash,
  // non-whitespace character.
  var hasDelim = /^[^a-zA-Z\\\s]/.test(pattern);
  if (hasDelim) {
    delim = pattern[0];
    var lastDelimIndex = pattern.lastIndexOf(delim);

    // pull out the flags in the pattern
    flags = (flags || '') + pattern.substring(lastDelimIndex + 1);

    // strip the delims from the pattern
    pattern = pattern.substring(1, lastDelimIndex);
  }

  // TODO: convert PCRE-only flags to JS
  // TODO: handle lots more stuff....
  // http://www.php.net/manual/en/reference.pcre.pattern.syntax.php

  var regexp = new RegExp(pattern, flags);

  regexp.delimiter = delim;
  regexp.pcrePattern = originalPattern;
  regexp.pcreFlags = flags;

  return regexp;
}
