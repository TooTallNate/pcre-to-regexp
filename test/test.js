
var PCRE = require('../');
var assert = require('assert');

describe('PCRE(pattern[, flags])', function () {

  it('should export a Function', function () {
    assert('function' === typeof PCRE);
  });

  it('should return a RegExp instance', function () {
    var r = PCRE();
    assert(isRegExp(r));
  });

  describe('given "#https?:\/\/speakerdeck.com\/.*#i"', function () {

    it('should match "https://speakerdeck.com/tootallnate/node-gyp-baynode-meetup-september-6-2012"', function () {
      var url = 'https://speakerdeck.com/tootallnate/node-gyp-baynode-meetup-september-6-2012';
      var re = PCRE("#https?:\/\/speakerdeck.com\/.*#i");
      assert(re.test(url));
    });

  });

  describe('given "%^https?:\/\/twitter\\.com(\/\\#\\!)?\/(?P<username>[a-zA-Z0-9_]{1,20})\\\/status(es)?\/(?P<id>\\d+)\/?$%i"', function () {

    it('should match "https://twitter.com/tootallnate/status/481604870626349056"', function () {
      var url = 'https://twitter.com/tootallnate/status/481604870626349056';
      var keys = [];
      var re = PCRE("%^https?:\/\/twitter\\.com(\/\\#\\!)?\/(?P<username>[a-zA-Z0-9_]{1,20})\\\/status(es)?\/(?P<id>\\d+)\/?$%i", keys);
      var expectedKeys = new Array(4);
      expectedKeys[1] = 'username';
      expectedKeys[3] = 'id';
      assert.deepEqual(keys, expectedKeys);
      var match = re.exec(url);
      assert(match);
      assert(match[2] === 'tootallnate');
      assert(match[4] === '481604870626349056');
    });

  });

});

function isRegExp(re) {
  return typeof re === 'object' &&
    re !== null &&
    Object.prototype.toString.call(re) === '[object RegExp]';
}
