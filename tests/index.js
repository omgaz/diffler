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

    it('should detect a single property change', () => {
      const testObjectA = { name: 'gary' };
      const testObjectB = { name: 'cindy' };
      const difference = diffler(testObjectA, testObjectB);

      assert.equal(Object.keys(difference).length, 1);
      assert.equal(Object.keys(difference.name).length, 2);

      assert.equal(difference.name.from, 'gary');
      assert.equal(difference.name.to, 'cindy');
    });

    it('should detect no changes', () => {
      const testObjectA = { name: 'gary' };
      const testObjectB = { name: 'gary' };
      const difference = diffler(testObjectA, testObjectB);

      assert.equal(Object.keys(difference).length, 0);
    });

    it('should detect type changes', () => {
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

      assert.equal(Object.keys(difference).length, 1);
      assert.equal(Object.keys(difference.weight.value).length, 2);

      assert.equal(difference.weight.value.from, 80);
      assert.equal(difference.weight.value.to, 79);
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
    it('should detect a single property removal as null', () => {
      const testObjectA = { name: 'gary' };
      const testObjectB = {};
      const difference = diffler(testObjectA, testObjectB);

      assert.equal(Object.keys(difference).length, 1);
      assert.equal(Object.keys(difference.name).length, 2);

      assert.equal(difference.name.from, 'gary');
      assert.equal(difference.name.to, null);
    });

    it('should detect a nested property removal as null', () => {
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
  });
});
