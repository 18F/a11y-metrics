// @flow

const {
  getAxeViolationStats,
  flattenViolations,
  uniqueWebpages
} = require('../lib/components/axe-violations');

const violation = kind => ({
  kind,
  helpUrl: `https://info/${kind}`,
  nodeCount: 1
});

describe('uniqueWebpages()', () => {
  it('filters out records w/ identical homepages', () => {
    const records /*: any */ = [
      {website: {homepage: 'a'}},
      {website: {homepage: 'b'}},
      {website: {homepage: 'a'}},
    ];
    expect(uniqueWebpages(records)).toEqual([
      {website: {homepage: 'a'}},
      {website: {homepage: 'b'}},
    ]);
  });
});

describe('getAxeViolationStats()', () => {
  it('matches snapshot', () => {
    expect(getAxeViolationStats([
      violation('foo'),
      violation('bar'),
      violation('foo'),
      violation('bar'),
      violation('baz'),
    ])).toMatchSnapshot();
  });
});
