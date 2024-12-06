/**
 * @license MIT https://github.com/omgaz/diffler
 * Author: Gary Chisholm @omgaz
 */

/**
 * @typedef {object} DiffResult
 * @property {*} from Original value.
 * @property {*} to New value.
 */

/**
 * @param {any} value Value to check.
 * @returns {boolean} True if value is a plain object.
 */
const isPlainObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

/**
 * @param {object} obj The object to check.
 * @param {string} key The key to check in the object.
 * @returns {boolean} True if value is a valid property.
 */
const isValidProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] !== 'function';

/**
 * @param {any} val1 First value.
 * @param {any} val2 Second value.
 * @returns {DiffResult|null} Difference result or null if no change.
 */
const compareValues = (val1, val2) => {
  // Different types
  if (typeof val1 !== typeof val2) {
    return { from: val1, to: val2 };
  }

  // Handle arrays
  if (Array.isArray(val1) && Array.isArray(val2)) {
    const arrayDiff = {};
    const maxLength = Math.max(val1.length, val2.length);

    for (let i = 0; i < maxLength; i++) {
      const diff = compareValues(val1[i], val2[i]);
      if (diff) arrayDiff[i] = diff;
    }

    return Object.keys(arrayDiff).length ? arrayDiff : null;
  }

  // Handle objects
  if (isPlainObject(val1) && isPlainObject(val2)) {
    const nestedDiff = diffler(val1, val2);
    return Object.keys(nestedDiff).length ? nestedDiff : null;
  }

  // Compare values
  return val1 !== val2 ? { from: val1, to: val2 } : null;
};

/**.
 * Compares two objects and returns their differences
 *
 * @param {object} originalObj First object to compare
 * @param {object} newObj Second object to compare against
 * @returns {Object.<string, DiffResult>} Object containing changes
 */
function diffler(originalObj, newObj) {
  const diff = {};

  // Check for changes and removals
  for (const key in originalObj) {
    if (!isValidProperty(originalObj, key)) continue;

    if (!(key in newObj)) {
      diff[key] = { from: originalObj[key], to: null };
      continue;
    }

    const difference = compareValues(originalObj[key], newObj[key]);
    if (difference) {
      diff[key] = difference;
    }
  }

  // Check for additions
  for (const key in newObj) {
    if (!isValidProperty(newObj, key)) continue;

    if (!(key in originalObj)) {
      diff[key] = { from: null, to: newObj[key] };
    }
  }

  return diff;
}

module.exports = diffler;
