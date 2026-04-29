type PlainObject = Record<string, unknown>;

type DiffResult = {
  from: unknown;
  to: unknown;
};

type DiffOutput = {
  [key: string]: DiffResult | DiffOutput;
};

const isPlainObject = (value: unknown): value is PlainObject =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const isOwnNonFunctionProperty = (object: PlainObject, key: string): boolean =>
  Object.hasOwn(object, key) && typeof object[key] !== 'function';

const compareValues = (first: unknown, second: unknown): DiffResult | DiffOutput | null => {
  if (typeof first !== typeof second) {
    return { from: first, to: second };
  }

  if (Array.isArray(first) && Array.isArray(second)) {
    const arrayDiff: DiffOutput = {};
    const maxLength = Math.max(first.length, second.length);

    for (let index = 0; index < maxLength; index++) {
      const difference = compareValues(first[index], second[index]);
      if (difference) arrayDiff[index] = difference;
    }

    return Object.keys(arrayDiff).length > 0 ? arrayDiff : null;
  }

  if (isPlainObject(first) && isPlainObject(second)) {
    const nestedDiff = diffler(first, second);
    return Object.keys(nestedDiff).length > 0 ? nestedDiff : null;
  }

  return first !== second ? { from: first, to: second } : null;
};

const diffler = (original: PlainObject, updated: PlainObject): DiffOutput => {
  const diff: DiffOutput = {};

  for (const key in original) {
    if (!isOwnNonFunctionProperty(original, key)) continue;

    if (!(key in updated)) {
      diff[key] = { from: original[key], to: null };
      continue;
    }

    const difference = compareValues(original[key], updated[key]);
    if (difference) {
      diff[key] = difference;
    }
  }

  for (const key in updated) {
    if (!isOwnNonFunctionProperty(updated, key)) continue;

    if (!(key in original)) {
      diff[key] = { from: null, to: updated[key] };
    }
  }

  return diff;
};

export type { DiffOutput, DiffResult, PlainObject };
export default diffler;
