
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
  var numGroups = 0;
  pattern = replaceCaptureGroups(pattern, function (group) {
    if (/^\(\?[P<']/.test(group)) {
      // PCRE-style "named capture"
      // It is possible to name a subpattern using the syntax (?P<name>pattern).
      // This subpattern will then be indexed in the matches array by its normal
      // numeric position and also by name. PHP 5.2.2 introduced two alternative
      // syntaxes (?<name>pattern) and (?'name'pattern).
      var match = /^\(\?P?[<']([^>']+)[>']([^\)]+)\)$/.exec(group);
      if (namedCaptures) namedCaptures[numGroups] = match[1];
      numGroups++;
      return '(' + match[2] + ')';
    } else if ('(?:' === group.substring(0, 3)) {
      // non-capture group, leave untouched
      return group;
    } else {
      // regular capture, leave untouched
      numGroups++;
      return group;
    }
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

/**
 * Invokes `fn` for each "capture group" encountered in the PCRE `pattern`,
 * and inserts the returned value into the pattern instead of the capture
 * group itself.
 *
 * @private
 */

function replaceCaptureGroups (pattern, fn) {
  var start;
  var depth = 0;
  var escaped = false;

  for (var i = 0; i < pattern.length; i++) {
    var cur = pattern[i];
    if (escaped) {
      // skip this letter, it's been escaped
      escaped = false;
      continue;
    }
    switch (cur) {
      case '(':
        // we're only interested in groups when the depth reaches 0
        if (0 === depth) {
          start = i;
        }
        depth++;
        break;
      case ')':
        if (depth > 0) {
          depth--;

          // we're only interested in groups when the depth reaches 0
          if (0 === depth) {
            var end = i + 1;
            var l = start === 0 ? '' : pattern.substring(0, start);
            var r = pattern.substring(end);
            var v = String(fn(pattern.substring(start, end)));
            pattern = l + v + r;
            i = start;
          }
        }
        break;
      case '\\':
        escaped = true;
        break;
    }
  }
  return pattern;
}
