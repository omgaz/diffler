const assert = require('assert');
const diffler = require('../src');

describe('getDiff', () => {
  describe('simple checks', () => {
    it('returns false when no changes detected', () => {
      const testObjectA = { name: 'gary' };
      const testObjectB = { name: 'gary' };
      const difference = diffler(testObjectA, testObjectB);
      assert.strictEqual(Object.keys(difference).length, 0);
      assert.deepStrictEqual(difference, {});
    });

    it('should detect a single property change', () => {
      const testObjectA = { name: 'gary' };
      const testObjectB = { name: 'cindy' };
      const difference = diffler(testObjectA, testObjectB);

      assert.strictEqual(Object.keys(difference).length, 1);
      assert.strictEqual(Object.keys(difference.name).length, 2);

      assert.strictEqual(difference.name.from, 'gary');
      assert.strictEqual(difference.name.to, 'cindy');
    });

    it('should detect no changes', () => {
      const testObjectA = { name: 'gary' };
      const testObjectB = { name: 'gary' };
      const difference = diffler(testObjectA, testObjectB);

      assert.strictEqual(Object.keys(difference).length, 0);
    });

    it('should detect type changes', () => {
      const testObjectA = { name: '1' };
      const testObjectB = { name: 1 };
      const difference = diffler(testObjectA, testObjectB);

      assert.strictEqual(Object.keys(difference).length, 1);
      assert.strictEqual(Object.keys(difference.name).length, 2);

      assert.strictEqual(difference.name.from, '1');
      assert.strictEqual(difference.name.to, 1);
    });
  });

  describe('array checks', () => {
    it('returns false when no changes detected', () => {
      const testObjectA = { arr: ['one', 'two'] };
      const testObjectB = { arr: ['one', 'two'] };
      const difference = diffler(testObjectA, testObjectB);
      assert.strictEqual(Object.keys(difference).length, 0);
      assert.deepStrictEqual(difference, {});
    });

    it('returns change when array order shifted', () => {
      const testObjectA = { arr: ['one', 'two', 'three'] };
      const testObjectB = { arr: ['three', 'two', 'one'] };
      const difference = diffler(testObjectA, testObjectB);
      assert.strictEqual(Object.keys(difference).length, 1);
      assert.deepStrictEqual(difference, { arr: { 0: { from: 'one', to: 'three' }, 2: { from: 'three', to: 'one' } } });
    });

    it('returns false when array order shifted but respectArrayOrder is false', () => {
      const testObjectA = { arr: ['one', 'two', 'three'] };
      const testObjectB = { arr: ['three', 'two', 'one'] };
      const difference = diffler(testObjectA, testObjectB, { respectArrayOrder: false });
      assert.strictEqual(Object.keys(difference).length, 0);
      assert.deepStrictEqual(difference, {});
    });

    it('returns false when array order shifted but respectArrayOrder is false as numbers', () => {
      const testObjectA = { arr: [1, 2, 3] };
      const testObjectB = { arr: [2, 3, 1] };
      const difference = diffler(testObjectA, testObjectB, { respectArrayOrder: false });
      assert.strictEqual(Object.keys(difference).length, 0);
      assert.deepStrictEqual(difference, {});
    });

    it('returns false when array order shifted but respectArrayOrder is false as mixed', () => {
      const testObjectA = { arr: [1, 'two', 3] };
      const testObjectB = { arr: ['two', 3, 1] };
      const difference = diffler(testObjectA, testObjectB, { respectArrayOrder: false });
      assert.strictEqual(Object.keys(difference).length, 0);
      assert.deepStrictEqual(difference, {});
    });

    it('returns diff when array order shifted for non-primitives and respectArrayOrder is false', () => {
      const testObjectA = {
        myArray: [{ foo: 'bar' }, { baz: 'bat' }],
      };

      const testObjectB = {
        myArray: [{ baz: 'bat' }, { foo: 'bar' }],
      };
      const difference = diffler(testObjectA, testObjectB, { respectArrayOrder: false });
      assert.strictEqual(Object.keys(difference).length, 1);
      assert.deepStrictEqual(difference, {});
    });

    it('returns change when array item added', () => {
      const testObjectA = { arr: ['one', 'two'] };
      const testObjectB = { arr: ['one', 'two', 'three'] };
      const difference = diffler(testObjectA, testObjectB);
      assert.strictEqual(Object.keys(difference).length, 1);
      assert.deepStrictEqual(difference, { arr: { 2: { from: null, to: 'three' } } });
    });

    it('returns change when array item removed', () => {
      const testObjectA = { arr: ['one', 'two', 'three'] };
      const testObjectB = { arr: ['one', 'two'] };
      const difference = diffler(testObjectA, testObjectB);
      assert.strictEqual(Object.keys(difference).length, 1);
      assert.deepStrictEqual(difference, { arr: { 2: { from: 'three', to: null } } });
    });

    it('returns change and removal when array item removed from middle', () => {
      const testObjectA = { arr: ['one', 'two', 'three'] };
      const testObjectB = { arr: ['one', 'three'] };
      const difference = diffler(testObjectA, testObjectB);
      assert.strictEqual(Object.keys(difference).length, 1);
      assert.deepStrictEqual(difference, { arr: { 1: { from: 'two', to: 'three' }, 2: { from: 'three', to: null } } });
    });
  });

  describe('multiple checks', () => {
    it('should detect a nested property change', () => {
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

      assert.strictEqual(Object.keys(difference).length, 1);
      assert.strictEqual(Object.keys(difference.weight.value).length, 2);

      assert.strictEqual(difference.weight.value.from, 80);
      assert.strictEqual(difference.weight.value.to, 79);
    });

    it('should detect multiple nested property change', () => {
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

      assert.strictEqual(Object.keys(difference).length, 2);
      assert.strictEqual(Object.keys(difference.weight).length, 2);

      assert.strictEqual(difference.age.from, 33);
      assert.strictEqual(difference.age.to, 34);

      assert.strictEqual(difference.weight.value.from, 80);
      assert.strictEqual(difference.weight.value.to, 12.4);

      assert.strictEqual(difference.weight.unit.from, 'kg');
      assert.strictEqual(difference.weight.unit.to, 'stone');
    });
  });

  describe('property removals', () => {
    it('should detect a single property removal as null', () => {
      const testObjectA = { name: 'gary' };
      const testObjectB = {};
      const difference = diffler(testObjectA, testObjectB);

      assert.strictEqual(Object.keys(difference).length, 1);
      assert.strictEqual(Object.keys(difference.name).length, 2);

      assert.strictEqual(difference.name.from, 'gary');
      assert.strictEqual(difference.name.to, null);
    });

    it('should detect a nested property removal as null', () => {
      const testObjectA = {
        name: 'gary',
        age: 33,
        weight: { unit: 'kg', value: 80 },
      };
      const testObjectB = { name: 'gary', age: 33 };
      const difference = diffler(testObjectA, testObjectB);

      assert.strictEqual(Object.keys(difference).length, 1);
      assert.strictEqual(Object.keys(difference.weight).length, 2);

      assert.deepStrictEqual(difference.weight.from, { unit: 'kg', value: 80 });
      assert.strictEqual(difference.weight.to, null);
    });
  });
});
