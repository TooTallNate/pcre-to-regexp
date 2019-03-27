
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

    it('should have [ , "username", , "id" ] for keys', function () {
      var keys = [];
      var re = PCRE("%^https?:\/\/twitter\\.com(\/\\#\\!)?\/(?P<username>[a-zA-Z0-9_]{1,20})\\\/status(es)?\/(?P<id>\\d+)\/?$%i", keys);
      var expectedKeys = new Array(4);
      expectedKeys[1] = 'username';
      expectedKeys[3] = 'id';
      assert.deepEqual(keys, expectedKeys);
    });

    it('should match "https://twitter.com/tootallnate/status/481604870626349056"', function () {
      var re = PCRE("%^https?:\/\/twitter\\.com(\/\\#\\!)?\/(?P<username>[a-zA-Z0-9_]{1,20})\\\/status(es)?\/(?P<id>\\d+)\/?$%i");
      var match = re.exec('https://twitter.com/tootallnate/status/481604870626349056');
      assert(match);
      assert(match[2] === 'tootallnate');
      assert(match[4] === '481604870626349056');
    });

  });

  // "Character classes"
  describe('given "/[:alnum:]/"', function () {

    it('should match "1"', function () {
      var re = PCRE("/[:alnum:]/");
      assert(re.test('1'));
    });

    it('should match "0"', function () {
      var re = PCRE("/[:alnum:]/");
      assert(re.test('0'));
    });

    it('should match "a"', function () {
      var re = PCRE("/[:alnum:]/");
      assert(re.test('a'));
    });

    it('should match "Z"', function () {
      var re = PCRE("/[:alnum:]/");
      assert(re.test('Z'));
    });

  });

  describe('given "/[:lower:]/"', function () {

    it('should match "a"', function () {
      var re = PCRE("/[:lower:]/");
      assert(re.test('a'));
    });

    it('should not match "A"', function () {
      var re = PCRE("/[:lower:]/");
      assert(!re.test('A'));
    });

    it('should not match "0"', function () {
      var re = PCRE("/[:lower:]/");
      assert(!re.test('0'));
    });

  });

  describe('given "/[:digit:]/"', function () {

    it('should match "3"', function () {
      var re = PCRE("/[:digit:]/");
      assert(re.test('3'));
    });

    it('should not match "G"', function () {
      var re = PCRE("/[:digit:]/");
      assert(!re.test('G'));
    });

  });

  describe('given "/[:punct:]/"', function () {

    it('should match "]"', function () {
      var re = PCRE("/[:punct:]/");
      assert(re.test(']'));
    });

    it('should match "!"', function () {
      var re = PCRE("/[:punct:]/");
      assert(re.test('!'));
    });

    it('should match "/"', function () {
      var re = PCRE("/[:punct:]/");
      assert(re.test('/'));
    });

    it('should match "\\"', function () {
      var re = PCRE("/[:punct:]/");
      assert(re.test('\\'));
    });

    it('should match "^"', function () {
      var re = PCRE("/[:punct:]/");
      assert(re.test('^'));
    });

    it('should match "|"', function () {
      var re = PCRE("/[:punct:]/");
      assert(re.test('|'));
    });

    it('should match "~"', function () {
      var re = PCRE("/[:punct:]/");
      assert(re.test('~'));
    });

    it('should not match " "', function () {
      var re = PCRE("/[:punct:]/");
      assert(!re.test(' '));
    });

    it('should not match "f"', function () {
      var re = PCRE("/[:punct:]/");
      assert(!re.test('f'));
    });

  });

  // PHP 5.2.2-style "alternative" named capture stynax using single quotes
  describe('given "#(?\'name\'foo)bar#"', function () {

    it('should have [ "name" ] for keys', function () {
      var keys = [];
      var re = PCRE("#(?\'name\'foo)bar#", keys);
      assert.deepEqual(keys, ['name']);
    });

    it('should match "foobar"', function () {
      var re = PCRE("#(?\'name\'foo)bar#");
      var match = re.exec('foobar');
      assert(match);
      assert(match[1] === 'foo');
    });

  });

  // PHP 5.2.2-style "alternative" named capture stynax using angle brackets
  describe('given "#(?<name>foo)bar#"', function () {

    it('should have [ "name" ] for keys', function () {
      var keys = [];
      var re = PCRE("#(?\'name\'foo)bar#", keys);
      assert.deepEqual(keys, ['name']);
    });

    it('should match "foobar"', function () {
      var re = PCRE("#(?<name>foo)bar#");
      var match = re.exec('foobar');
      assert(match);
      assert(match[1] === 'foo');
    });

  });

  describe('given "/^\\/blog\\/(?<uid>[^\\/]+)$/"', function () {
    const input = '/^\\/blog\\/(?<uid>[^\\/]+)$/'

    it('should have [ "uid" ] for keys', function () {
      var keys = [];
      var re = PCRE(input, keys);
      assert.deepEqual(keys, ['uid']);
    });

    it('should match "foobar"', function () {
      var re = PCRE(input);
      var match = re.exec('/blog/hiking-woods');
      assert(match);
      assert(match[1] === 'hiking-woods');
    });

  });

});

function isRegExp(re) {
  return typeof re === 'object' &&
    re !== null &&
    Object.prototype.toString.call(re) === '[object RegExp]';
}
