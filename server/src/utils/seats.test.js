const { seatKey, findSeatConflict } = require('./seats');

describe('seat helpers', () => {
  test('seatKey builds row-col', () => {
    expect(seatKey([3, 5])).toBe('3-5');
  });

  test('no conflict when seats are free', () => {
    const taken = new Set(['0-0', '0-1']);
    expect(findSeatConflict(taken, [[1, 0], [1, 1]])).toBeNull();
  });

  test('detects a double-booking conflict', () => {
    const taken = new Set(['2-2', '2-3']);
    expect(findSeatConflict(taken, [[5, 5], [2, 3]])).toBe('2-3');
  });

  test('empty request never conflicts', () => {
    expect(findSeatConflict(new Set(['0-0']), [])).toBeNull();
  });
});
