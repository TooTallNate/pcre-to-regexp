pcre-to-regexp
==============
### Converts PCRE regexp strings to JavaScript RegExp instances
[![Build Status](https://travis-ci.org/TooTallNate/pcre-to-regexp.svg?branch=master)](https://travis-ci.org/TooTallNate/pcre-to-regexp)

Creates a JavaScript `RegExp` instance from a PCRE regexp string.
Not currently feature-complete, but works enough for my needs. Send
pull requests for additional functionality!

Works with Node.js and in the browser via a CommonJS bundler like browserify.


Installation
------------

``` bash
$ npm install pcre-to-regexp
```

Example
-------

A basic example of a Twitter URL parsing PCRE regexp:

``` js
var url = "%^https?:\/\/twitter\\.com(\/\\#\\!)?\/(?P<username>[a-zA-Z0-9_]{1,20})\\\/status(es)?\/(?P<id>\\d+)\/?$%ig";

// parse the PCRE regexp into a JS RegExp
var keys = [];
var re = PCRE(url, keys);

console.log(keys);
// [ , 'username', , 'id' ]

console.log(re);
// /^https?://twitter\.com(/\#\!)?/([a-zA-Z0-9_]{1,20})\/status(es)?/(\d+)/?$/gi

var match = re.exec('https://twitter.com/tootallnate/status/481604870626349056');
console.log(match);
// [ 'https://twitter.com/justinabrahms/status/486924059264163840',
//   undefined,
//   'justinabrahms',
//   undefined,
//   '486924059264163840',
//   index: 0,
//   input: 'https://twitter.com/justinabrahms/status/486924059264163840' ]
```

Use code like this if you would like to transfer the "named captures" to the
`match` object:

``` js
// example of copying the named captures as keys on the `match` object
for (var i = 0; i < keys.length; i++) {
  if ('string' === typeof keys[i]) {
    match[keys[i]] = match[i + 1];
  }
}

console.log(match.username);
// 'tootallnate'

console.log(match.id);
// '481604870626349056'
```

API
---

### PCRE(String pattern[, Array keys]) → RegExp

Returns a JavaScript RegExp instance from the given PCRE-compatible string.
Flags may be passed in after the final delimiter in the `format` string.

An empty array may be passsed in as the second argument, which will be
populated with the "named capture group" names as Strings in the Array,
once the RegExp has been returned.
