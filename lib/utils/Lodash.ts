import Validator from './Validator';

/**
 * Sets a value at a specified path within an object, creating nested objects/arrays as needed.
 * Supports dot notation and array indexing (e.g. 'a.b[0].c').
 *
 * @param {Record<string, any>} object - The target object to modify
 * @param {string} path - The path where the value should be set (e.g. 'a.b.c' or 'a.b[0].c')
 * @param {unknown} [value] - The value to set at the specified path
 * @returns {Record<string, any>} The modified object
 * @throws {TypeError} If object is not a valid object or path is not a string
 * @throws {RangeError} If array index in path is invalid
 *
 * @example
 * // Simple property
 * set({}, 'a.b.c', 123) // => { a: { b: { c: 123 } } }
 *
 * // Array path
 * set({}, 'a[0].b', 123) // => { a: [{ b: 123 }] }
 */
export function set(object: Record<string, any>, path: string, value?: unknown): Record<string, any> {
  Validator.object(object);
  Validator.string(path);

  const keys: string[] = path.split('.');
  let current: Record<string, any> = object;

  for (let index = 0; index < keys.length - 1; index++) {
    const key = keys[index];

    if (!Object.prototype.hasOwnProperty.call(current, key)) {
      if (key.includes('[')) {
        const arrayKey = key.substring(0, key.indexOf('['));
        const arrayIndex = Number(key.substring(key.indexOf('[') + 1, key.indexOf(']')));

        if (Number.isNaN(arrayIndex) || arrayIndex < 0)
          throw new RangeError('Invalid array index in path');

        if (!current[arrayKey])
          current[arrayKey] = [];
        current = current[arrayKey];

        if (!current[arrayIndex])
          current[arrayIndex] = {};
        current = current[arrayIndex];
      } else {
        current[key] = {};
        current = current[key];
      }
    } else
      current = current[key];
  }

  const finalKey = keys[keys.length - 1];
  if (finalKey.includes('[')) {
    const arrayKey = finalKey.substring(0, finalKey.indexOf('['));
    const arrayIndex = Number(finalKey.substring(finalKey.indexOf('[') + 1, finalKey.indexOf(']')));

    if (Number.isNaN(arrayIndex) || arrayIndex < 0)
      throw new RangeError('Invalid array index in path');

    if (!current[arrayKey])
      current[arrayKey] = [];
    current = current[arrayKey];
    current[arrayIndex] = value;
  } else
    current[finalKey] = value;

  return object;
}

/**
 * Safely retrieves a value at a specified path within an object.
 * Supports both dot notation strings and array paths.
 *
 * @param {object} object - The source object to retrieve from
 * @param {Array<string | number> | string} path - The path to the desired value
 *                                                Can be array of keys/indices or dot notation string
 * @returns {unknown} The value at the path if found, undefined otherwise
 *
 * @example
 * // Using string path
 * get({a: {b: {c: 123}}}, 'a.b.c') // => 123
 *
 * // Using array path
 * get({a: [{b: 123}]}, ['a', 0, 'b']) // => 123
 */
export function get(object: object, path: Array<string | number> | string): unknown {
  if (!object || typeof object !== 'object')
    return undefined;

  const segments = Array.isArray(path)
    ? path
    : path.split('.').map(key => key.includes('[')
      ? key.replace(/\[|\]/g, '')
      : key
    );

  let current: any = object;

  for (const key of segments) {
    if (current === null)
      return undefined;

    if (Array.isArray(current) && typeof key === 'string' && key.includes('[')) {
      const index = Number(key.match(/\d+/)?.[0]);
      if (Number.isNaN(index) || index < 0 || index >= current.length)
        return undefined;
      current = current[index];
    } else
      current = current[key];

    if (current === undefined)
      return undefined;
  }

  return current;
}

/**
 * Deeply merges multiple source objects into a target object.
 * Arrays are concatenated, objects are merged recursively.
 *
 * @param {Record<string, any>} target - The target object to merge into
 * @param {...Record<string, any>} sources - One or more source objects to merge from
 * @returns {Record<string, any>} The modified target object
 * @throws {TypeError} If sources is not an array
 *
 * @example
 * merge({a: 1}, {b: 2}, {c: 3}) // => {a: 1, b: 2, c: 3}
 * merge({a: [1]}, {a: [2]}) // => {a: [1, 2]}
 * merge({a: {b: 1}}, {a: {c: 2}}) // => {a: {b: 1, c: 2}}
 */
export function merge(target: Record<string, any>, ...sources: Array<Record<string, any>>): Record<string, any> {
  Validator.instance(Array, sources);

  if (!sources.length)
    return target;

  const source = sources.shift();
  if (!source)
    return target;

  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object') {
      if (!target[key] || typeof target[key] !== 'object')
        target[key] = Array.isArray(source[key]) ? [] : {};
      if (Array.isArray(source[key])) {
        if (!Array.isArray(target[key]))
          target[key] = [];
        target[key] = [...target[key], ...source[key]];
      } else
        merge(target[key], source[key]);
    } else if (source[key] !== undefined)
      target[key] = source[key];
  }

  return merge(target, ...sources);
}

export default { set, get, merge };