
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

});

function isRegExp(re) {
  return typeof re === 'object' &&
    re !== null &&
    Object.prototype.toString.call(re) === '[object RegExp]';
}
