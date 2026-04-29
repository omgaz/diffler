import diffler from '.';

describe('diffler', () => {
  describe('simple checks', () => {
    it('returns empty object when no changes detected', () => {
      const before = { name: 'gary' };
      const after = { name: 'gary' };
      expect(diffler(before, after)).toEqual({});
    });

    it('detects a single property change', () => {
      const before = { name: 'gary' };
      const after = { name: 'cindy' };
      const difference = diffler(before, after);

      expect(Object.keys(difference)).toHaveLength(1);
      expect(difference.name).toEqual({ from: 'gary', to: 'cindy' });
    });

    it('detects no changes', () => {
      const before = { name: 'gary' };
      const after = { name: 'gary' };
      expect(Object.keys(diffler(before, after))).toHaveLength(0);
    });

    it('detects type changes', () => {
      const before = { name: '1' };
      const after = { name: 1 };
      const difference = diffler(before, after as Record<string, unknown>);

      expect(Object.keys(difference)).toHaveLength(1);
      expect(difference.name).toEqual({ from: '1', to: 1 });
    });
  });

  describe('nested checks', () => {
    it('detects a nested property change', () => {
      const before = { name: 'gary', age: 33, weight: { unit: 'kg', value: 80 } };
      const after = { name: 'gary', age: 33, weight: { unit: 'kg', value: 79 } };
      const difference = diffler(before, after);

      expect(Object.keys(difference)).toHaveLength(1);
      expect(difference.weight).toEqual({ value: { from: 80, to: 79 } });
    });

    it('detects multiple nested property changes', () => {
      const before = { name: 'gary', age: 33, weight: { unit: 'kg', value: 80 } };
      const after = { name: 'gary', age: 34, weight: { unit: 'stone', value: 12.4 } };
      const difference = diffler(before, after);

      expect(Object.keys(difference)).toHaveLength(2);
      expect(difference.age).toEqual({ from: 33, to: 34 });
      expect(difference.weight).toEqual({
        value: { from: 80, to: 12.4 },
        unit: { from: 'kg', to: 'stone' },
      });
    });
  });

  describe('property removals', () => {
    it('detects a single property removal as null', () => {
      const before = { name: 'gary' };
      const after = {};
      const difference = diffler(before, after);

      expect(Object.keys(difference)).toHaveLength(1);
      expect(difference.name).toEqual({ from: 'gary', to: null });
    });

    it('detects a nested property removal as null', () => {
      const before = { name: 'gary', age: 33, weight: { unit: 'kg', value: 80 } };
      const after = { name: 'gary', age: 33 };
      const difference = diffler(before, after);

      expect(Object.keys(difference)).toHaveLength(1);
      expect(difference.weight).toEqual({ from: { unit: 'kg', value: 80 }, to: null });
    });

    it('detects comparisons with null', () => {
      const differenceFrom = diffler({ a: null, b: 'things' }, { a: 'more', b: 'things' });
      const differenceTo = diffler({ a: 'some', b: 'things' }, { a: null, b: 'things' });
      const same = diffler({ a: null, b: 'things' }, { a: null, b: 'things' });

      expect(Object.keys(differenceFrom)).toHaveLength(1);
      expect(Object.keys(differenceTo)).toHaveLength(1);
      expect(Object.keys(same)).toHaveLength(0);

      expect(differenceFrom.a).toEqual({ from: null, to: 'more' });
      expect(differenceTo.a).toEqual({ from: 'some', to: null });
    });

    it('detects comparisons with defined undefined', () => {
      const differenceFrom = diffler({ a: undefined, b: 'things' }, { a: 'more', b: 'things' });
      const differenceTo = diffler({ a: 'some', b: 'things' }, { a: undefined, b: 'things' });
      const same = diffler({ a: undefined, b: 'things' }, { a: undefined, b: 'things' });

      expect(Object.keys(differenceFrom)).toHaveLength(1);
      expect(Object.keys(differenceTo)).toHaveLength(1);
      expect(Object.keys(same)).toHaveLength(0);

      expect(differenceFrom.a).toEqual({ from: undefined, to: 'more' });
      expect(differenceTo.a).toEqual({ from: 'some', to: undefined });
    });
  });

  describe('array comparisons', () => {
    it('detects comparisons with arrays of mixed types', () => {
      const difference = diffler({ a: [1], b: ['one'] }, { a: ['one'], b: [1] });

      expect(Object.keys(difference)).toHaveLength(2);
      expect(difference.a).toEqual({ 0: { from: 1, to: 'one' } });
      expect(difference.b).toEqual({ 0: { from: 'one', to: 1 } });
    });

    it('detects comparisons with arrays of mixed primitives and objects', () => {
      const difference = diffler(
        { a: ['something'], b: [{ b: 'something' }] },
        { a: [{ a: 'something' }], b: ['something'] },
      );

      expect(Object.keys(difference)).toHaveLength(2);
      expect(difference.a).toEqual({ 0: { from: 'something', to: { a: 'something' } } });
      expect(difference.b).toEqual({ 0: { from: { b: 'something' }, to: 'something' } });
    });

    it('detects changes in arrays of objects', () => {
      const before = {
        items: [
          { id: 1, value: 'a' },
          { id: 2, value: 'b' },
        ],
      };
      const after = {
        items: [
          { id: 1, value: 'a' },
          { id: 2, value: 'c' },
        ],
      };
      const difference = diffler(before, after);

      expect(Object.keys(difference)).toHaveLength(1);
      expect(difference.items).toEqual({ 1: { value: { from: 'b', to: 'c' } } });
    });

    it('detects additions in arrays of objects', () => {
      const before = { items: [{ id: 1, value: 'a' }] };
      const after = {
        items: [
          { id: 1, value: 'a' },
          { id: 2, value: 'b' },
        ],
      };
      const difference = diffler(before, after);

      expect(Object.keys(difference)).toHaveLength(1);
      expect(difference.items).toEqual({
        1: { from: undefined, to: { id: 2, value: 'b' } },
      });
    });

    it('detects removals in arrays of objects', () => {
      const before = {
        items: [
          { id: 1, value: 'a' },
          { id: 2, value: 'b' },
        ],
      };
      const after = { items: [{ id: 1, value: 'a' }] };
      const difference = diffler(before, after);

      expect(Object.keys(difference)).toHaveLength(1);
      expect(difference.items).toEqual({
        1: { from: { id: 2, value: 'b' }, to: undefined },
      });
    });
  });
});
