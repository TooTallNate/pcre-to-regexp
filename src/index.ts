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

function createPCRE(
	pattern: string,
	namedCaptures?: string[]
): createPCRE.PCRE {
	pattern = String(pattern || '').trim();
	let originalPattern = pattern;
	let delim;
	let flags = '';

	// A delimiter can be any non-alphanumeric, non-backslash,
	// non-whitespace character.
	let hasDelim = /^[^a-zA-Z\\\s]/.test(pattern);
	if (hasDelim) {
		delim = pattern[0];
		let lastDelimIndex = pattern.lastIndexOf(delim);

		// pull out the flags in the pattern
		flags += pattern.substring(lastDelimIndex + 1);

		// strip the delims from the pattern
		pattern = pattern.substring(1, lastDelimIndex);
	}

	// populate namedCaptures array and removed named captures from the `pattern`
	let numGroups = 0;
	pattern = replaceCaptureGroups(pattern, (group: string) => {
		if (/^\(\?[P<']/.test(group)) {
			// PCRE-style "named capture"
			// It is possible to name a subpattern using the syntax (?P<name>pattern).
			// This subpattern will then be indexed in the matches array by its normal
			// numeric position and also by name. PHP 5.2.2 introduced two alternative
			// syntaxes (?<name>pattern) and (?'name'pattern).
			let match = /^\(\?P?[<']([^>']+)[>']/.exec(group);
			if (!match) {
				throw new Error(
					`Failed to extract named captures from ${JSON.stringify(
						group
					)}`
				);
			}
			let capture = group.substring(match[0].length, group.length - 1);
			if (namedCaptures) {
				namedCaptures[numGroups] = match[1];
			}
			numGroups++;
			return `(${capture})`;
		}

		if (group.substring(0, 3) === '(?:') {
			// non-capture group, leave untouched
			return group;
		}

		// regular capture, leave untouched
		numGroups++;
		return group;
	});

	// replace "character classes" with their raw RegExp equivalent
	pattern = pattern.replace(
		/\[:([^:]+):\]/g,
		(characterClass: string, name: string) => {
			return createPCRE.characterClasses[name] || characterClass;
		}
	);

	// TODO: convert PCRE-only flags to JS
	// TODO: handle lots more stuff....
	// http://www.php.net/manual/en/reference.pcre.pattern.syntax.php

	return new createPCRE.PCRE(pattern, flags, originalPattern, flags, delim);
}

/**
 * Invokes `fn` for each "capture group" encountered in the PCRE `pattern`,
 * and inserts the returned value into the pattern instead of the capture
 * group itself.
 *
 * @private
 */

function replaceCaptureGroups(
	pattern: string,
	fn: (group: string) => string
): string {
	let start = 0;
	let depth = 0;
	let escaped = false;

	for (let i = 0; i < pattern.length; i++) {
		let cur = pattern[i];
		if (escaped) {
			// skip this letter, it's been escaped
			escaped = false;
			continue;
		}
		switch (cur) {
			case '(':
				// we're only interested in groups when the depth reaches 0
				if (depth === 0) {
					start = i;
				}
				depth++;
				break;
			case ')':
				if (depth > 0) {
					depth--;

					// we're only interested in groups when the depth reaches 0
					if (depth === 0) {
						let end = i + 1;
						let l = start === 0 ? '' : pattern.substring(0, start);
						let r = pattern.substring(end);
						let v = String(fn(pattern.substring(start, end)));
						pattern = l + v + r;
						i = start;
					}
				}
				break;
			case '\\':
				escaped = true;
				break;
			default:
				// skip
				break;
		}
	}
	return pattern;
}

namespace createPCRE { // eslint-disable-line no-redeclare
	export interface CharacterClasses {
		[name: string]: string;
	}

	export class PCRE extends RegExp {
		pcrePattern: string;
		pcreFlags: string;
		delimiter?: string;

		constructor(
			pattern: string,
			flags: string,
			pcrePattern: string,
			pcreFlags: string,
			delimiter?: string
		) {
			super(pattern, flags);
			this.pcrePattern = pcrePattern;
			this.pcreFlags = pcreFlags;
			this.delimiter = delimiter;
		}
	}

	/**
	 * Mapping of "character class" names to their JS RegExp equivalent.
	 * So that /[:digit:]/ gets converted into /\d/, etc.
	 *
	 * See: http://en.wikipedia.org/wiki/Regular_expression#Character_classes
	 */

	export const characterClasses: CharacterClasses = {
		alnum: '[A-Za-z0-9]',
		word: '[A-Za-z0-9_]',
		alpha: '[A-Za-z]',
		blank: '[ \\t]',
		cntrl: '[\\x00-\\x1F\\x7F]',
		digit: '\\d',
		graph: '[\\x21-\\x7E]',
		lower: '[a-z]',
		print: '[\\x20-\\x7E]',
		punct: '[\\]\\[!"#$%&\'()*+,./:;<=>?@\\\\^_`{|}~-]',
		space: '\\s',
		upper: '[A-Z]',
		xdigit: '[A-Fa-f0-9]'
	};
}

createPCRE.prototype = createPCRE.PCRE.prototype;
export = createPCRE;
