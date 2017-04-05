// @flow

const {
  HistorySync,
  DEFAULT_SORT,
  DEFAULT_IS_DESCENDING
} = require('../lib/components/history-sync');

const defaults = {
  sortBy: DEFAULT_SORT,
  isDescending: DEFAULT_IS_DESCENDING
};

describe('HistorySync.parseHash()', () => {
  const { parseHash } = HistorySync;

  it('returns defaults when hash is empty', () => {
    expect(parseHash('#')).toEqual(defaults);
    expect(parseHash('')).toEqual(defaults);
  });

  it('returns default sortBy when it is invalid', () => {
    expect(parseHash('#sort=blarg')).toEqual(defaults);
  });

  it('returns valid sortBy when it is valid', () => {
    expect(parseHash('#sort=issues').sortBy).toEqual('issues');
    expect(parseHash('#sort=homepage').sortBy).toEqual('homepage');
  });

  it('returns isDescending=true when it is "on"', () => {
    expect(parseHash('#desc=on').isDescending).toBe(true);
  });

  it('returns isDescending=false when it is anything else', () => {
    expect(parseHash('#desc=lol').isDescending).toBe(false);
  });
});

describe('HistorySync.stringifyHash()', () => {
  const { stringifyHash } = HistorySync;

  it('returns empty string when given defaults', () => {
    expect(stringifyHash(defaults)).toEqual('');
  });

  it('works when isDescending=true', () => {
    expect(stringifyHash({
      sortBy: DEFAULT_SORT,
      isDescending: true
    })).toEqual('#desc=on');
  });

  it('works when sortBy is non-default', () => {
    expect(stringifyHash({
      sortBy: 'issues',
      isDescending: DEFAULT_IS_DESCENDING
    })).toEqual('#sort=issues');
  });

  it('works when sortBy and isDescending are non-default', () => {
    expect(stringifyHash({
      sortBy: 'issues',
      isDescending: true
    })).toEqual('#sort=issues&desc=on');
  });
});
