const { urlToCacheKey } = require('../lib/cache');

describe('urlToCacheKey', () => {
  test('works with URLs that have a path ending with "/"', () => {
    expect(urlToCacheKey('https://boop.com/')).toEqual([
      'boop.com', '__index'
    ]);
  });

  test('works with URLs that have multiple sub-paths', () => {
    expect(urlToCacheKey('https://boop.com/a/b/c')).toEqual([
      'boop.com', 'a__b__c'
    ]);
  });

  test('slugifies parts', () => {
    expect(urlToCacheKey('https://blarg.com/fop[')).toEqual([
      'blarg.com', 'fop'
    ]);
  });

  test('slugifies querystring', () => {
    expect(urlToCacheKey('https://blarg.com/fop?boop=1')).toEqual([
      'blarg.com', 'fop_boop1'
    ]);
  });
});
