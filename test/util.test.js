const { shortenUrl } = require('../lib/util');

describe('util.shortenUrl()', () => {
  it('returns the URL if it does not have hostname and pathname', () => {
    expect(shortenUrl('blarg')).toBe('blarg');
  });

  it('removes protocol', () => {
    expect(shortenUrl('http://blarg.com')).toBe('blarg.com');
  });

  it('trims trailing slash', () => {
    expect(shortenUrl('https://blarg.com/')).toBe('blarg.com');
  });

  it('removes querystring details', () => {
    expect(shortenUrl('https://blarg.com/?q=bleh')).toBe('blarg.com');
  });

  it('removes hash details', () => {
    expect(shortenUrl('https://blarg.com/#boop')).toBe('blarg.com');
  });

  it('removes port details', () => {
    expect(shortenUrl('https://blarg.com:8080')).toBe('blarg.com');
  });
});
