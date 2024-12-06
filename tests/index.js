const assert = require('assert');
const diffler = require('../src');

describe('getDiff', () => {
  describe('simple checks', () => {
    it('returns false when no changes detected', () => {
      const testObjectA = { name: 'gary' };
      const testObjectB = { name: 'gary' };
      const difference = diffler(testObjectA, testObjectB);
      assert.equal(Object.keys(difference).length, 0);
      assert.deepEqual(difference, {});
    });

    it('detect a single property change', () => {
      const testObjectA = { name: 'gary' };
      const testObjectB = { name: 'cindy' };
      const difference = diffler(testObjectA, testObjectB);

      assert.equal(Object.keys(difference).length, 1);
      assert.equal(Object.keys(difference.name).length, 2);

      assert.equal(difference.name.from, 'gary');
      assert.equal(difference.name.to, 'cindy');
    });

    it('detect no changes', () => {
      const testObjectA = { name: 'gary' };
      const testObjectB = { name: 'gary' };
      const difference = diffler(testObjectA, testObjectB);

      assert.equal(Object.keys(difference).length, 0);
    });

    it('detect type changes', () => {
      const testObjectA = { name: '1' };
      const testObjectB = { name: 1 };
      const difference = diffler(testObjectA, testObjectB);

      assert.equal(Object.keys(difference).length, 1);
      assert.equal(Object.keys(difference.name).length, 2);

      assert.equal(difference.name.from, '1');
      assert.equal(difference.name.to, 1);
    });
  });

  describe('multiple checks', () => {
    it('detect a nested property change', () => {
      const testObjectA = {
        name: 'gary',
        age: 33,
        weight: { unit: 'kg', value: 80 },
      };
      const testObjectB = {
        name: 'gary',
        age: 33,
        weight: { unit: 'kg', value: 79 },
      };
      const difference = diffler(testObjectA, testObjectB);

      assert.equal(Object.keys(difference).length, 1);
      assert.equal(Object.keys(difference.weight.value).length, 2);

      assert.equal(difference.weight.value.from, 80);
      assert.equal(difference.weight.value.to, 79);
    });

    it('detect multiple nested property change', () => {
      const testObjectA = {
        name: 'gary',
        age: 33,
        weight: { unit: 'kg', value: 80 },
      };
      const testObjectB = {
        name: 'gary',
        age: 34,
        weight: { unit: 'stone', value: 12.4 },
      };
      const difference = diffler(testObjectA, testObjectB);

      assert.equal(Object.keys(difference).length, 2);
      assert.equal(Object.keys(difference.weight).length, 2);

      assert.equal(difference.age.from, 33);
      assert.equal(difference.age.to, 34);

      assert.equal(difference.weight.value.from, 80);
      assert.equal(difference.weight.value.to, 12.4);

      assert.equal(difference.weight.unit.from, 'kg');
      assert.equal(difference.weight.unit.to, 'stone');
    });
  });

  describe('property removals', () => {
    it('detect a single property removal as null', () => {
      const testObjectA = { name: 'gary' };
      const testObjectB = {};
      const difference = diffler(testObjectA, testObjectB);

      assert.equal(Object.keys(difference).length, 1);
      assert.equal(Object.keys(difference.name).length, 2);

      assert.equal(difference.name.from, 'gary');
      assert.equal(difference.name.to, null);
    });

    it('detect a nested property removal as null', () => {
      const testObjectA = {
        name: 'gary',
        age: 33,
        weight: { unit: 'kg', value: 80 },
      };
      const testObjectB = { name: 'gary', age: 33 };
      const difference = diffler(testObjectA, testObjectB);

      assert.equal(Object.keys(difference).length, 1);
      assert.equal(Object.keys(difference.weight).length, 2);

      assert.deepEqual(difference.weight.from, { unit: 'kg', value: 80 });
      assert.equal(difference.weight.to, null);
    });

    it('detect comparisons with null', () => {
      const differenceFrom = diffler({ a: null, b: 'things' }, { a: 'more', b: 'things' });
      const differenceTo = diffler({ a: 'some', b: 'things' }, { a: null, b: 'things' });
      const same = diffler({ a: null, b: 'things' }, { a: null, b: 'things' });

      assert.equal(Object.keys(differenceFrom).length, 1);
      assert.equal(Object.keys(differenceTo).length, 1);
      assert.equal(Object.keys(same).length, 0);

      assert.equal(differenceFrom.a.from, null);
      assert.equal(differenceTo.a.to, null);
    });

    // https://github.com/omgaz/diffler/issues/31
    it('detect comparisons with defined undefined', () => {
      const differenceFrom = diffler({ a: undefined, b: 'things' }, { a: 'more', b: 'things' });
      const differenceTo = diffler({ a: 'some', b: 'things' }, { a: undefined, b: 'things' });
      const same = diffler({ a: undefined, b: 'things' }, { a: undefined, b: 'things' });

      assert.equal(Object.keys(differenceFrom).length, 1);
      assert.equal(Object.keys(differenceTo).length, 1);
      assert.equal(Object.keys(same).length, 0);

      assert.equal(differenceFrom.a.from, undefined);
      assert.equal(differenceTo.a.to, undefined);
    });

    // https://github.com/omgaz/diffler/issues/31
    it('detect comparisons with arrays of mixed types', () => {
      const difference = diffler({ a: [1], b: ['one'] }, { a: ['one'], b: [1] });

      assert.equal(Object.keys(difference).length, 2);

      console.log(difference);

      assert.equal(difference.a[0].from, '1');
      assert.equal(difference.a[0].to, 'one');
      assert.equal(difference.b[0].from, 'one');
      assert.equal(difference.b[0].to, 1);
    });

    // https://github.com/omgaz/diffler/issues/31
    it('detect comparisons with arrays of mixed primitives and objects', () => {
      const difference = diffler(
        { a: ['something'], b: [{ b: 'something' }] },
        { a: [{ a: 'something' }], b: ['something'] },
      );

      assert.equal(Object.keys(difference).length, 2);

      assert.equal(difference.a[0].from, 'something');
      assert.deepEqual(difference.a[0].to, {
        a: 'something',
      });
      assert.deepEqual(difference.b[0].from, {
        b: 'something',
      });
      assert.equal(difference.b[0].to, 'something');
    });

    it('detect changes in arrays of objects', () => {
      const testObjectA = {
        items: [
          { id: 1, value: 'a' },
          { id: 2, value: 'b' },
        ],
      };
      const testObjectB = {
        items: [
          { id: 1, value: 'a' },
          { id: 2, value: 'c' },
        ],
      };
      const difference = diffler(testObjectA, testObjectB);

      assert.equal(Object.keys(difference).length, 1);
      assert.equal(Object.keys(difference.items[1]).length, 1);
      assert.equal(difference.items[1].value.from, 'b');
      assert.equal(difference.items[1].value.to, 'c');
    });

    it('detect additions in arrays of objects', () => {
      const testObjectA = { items: [{ id: 1, value: 'a' }] };
      const testObjectB = {
        items: [
          { id: 1, value: 'a' },
          { id: 2, value: 'b' },
        ],
      };
      const difference = diffler(testObjectA, testObjectB);

      assert.equal(Object.keys(difference).length, 1);
      assert.deepEqual(difference.items[1], { from: undefined, to: { id: 2, value: 'b' } });
    });

    it('detect removals in arrays of objects', () => {
      const testObjectA = {
        items: [
          { id: 1, value: 'a' },
          { id: 2, value: 'b' },
        ],
      };
      const testObjectB = { items: [{ id: 1, value: 'a' }] };
      const difference = diffler(testObjectA, testObjectB);

      assert.equal(Object.keys(difference).length, 1);
      assert.deepEqual(difference.items[1], { from: { id: 2, value: 'b' }, to: undefined });
    });
  });
});
