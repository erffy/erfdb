import Validator from './Validator';

/**
 * Sets the value at the specified path of the object. If a portion of the path
 * doesn't exist, it's created.
 *
 * @param {Record<string, any>} object - The object to modify.
 * @param {string} path - The path of the property to set.
 * @param {*} [value] - The value to set.
 * @returns {Record<string, any>} Returns the modified object.
 * @throws {TypeError} Throws error if object is not a valid object or path is not a string.
 */
export function set(object: Record<string, any>, path: string, value?: any): Record<string, any> {
  Validator.object(object);
  Validator.string(path);

  const keys: Array<string> = path.split('.');
  let current: Record<string, any> = object;

  for (let index = 0; index < keys.length - 1; index++) {
    const key: string = keys[index];

    if (!current.hasOwnProperty(key)) {
      if (key.includes('[')) {
        const arrayKey = key.substring(0, key.indexOf('['));
        const arrayIndex = Number(key.substring(key.indexOf('[') + 1, key.indexOf(']')));
        if (!current[arrayKey]) current[arrayKey] = [];
        current = current[arrayKey];
        if (!current[arrayIndex]) current[arrayIndex] = {};
        current = current[arrayIndex];
      } else {
        current[key] = {};
        current = current[key];
      }
    } else current = current[key];
  }

  // Set value at the final key
  const finalKey = keys[keys.length - 1];
  if (finalKey.includes('[')) {
    const arrayKey = finalKey.substring(0, finalKey.indexOf('['));
    const arrayIndex = Number(finalKey.substring(finalKey.indexOf('[') + 1, finalKey.indexOf(']')));
    if (!current[arrayKey]) current[arrayKey] = [];
    current = current[arrayKey];
    current[arrayIndex] = value;
  } else current[finalKey] = value;

  return object;
}

/**
 * Gets the value at the specified path of the object.
 *
 * @param {object} object - The object to retrieve the value from.
 * @param {Array<string | number> | string} path - The path of the property to get.
 * @returns {*} The value at the specified path, or undefined if not found.
 */
export function get(object: object, path: Array<string | number> | string): any {
  if (typeof object !== 'object') return undefined;
  if (typeof path === 'string') path = path.split('.').map((key) => key.includes('[') ? key.replace(/\[|\]/g, '') : key);

  let current: any = object;
  for (let i = 0; i < path.length; i++) {
    const key = path[i];

    if (Array.isArray(current) && typeof key === 'string' && key.includes('[')) current = current[Number(key.match(/\d+/g)![0])];
    else current = current[key];

    if (current === undefined || current === null) return undefined;
  }

  return current;
}

/**
 * Deeply merges objects into the target object.
 *
 * @param {Record<string, any>} target - The target object to merge into.
 * @param {...Record<string, any>} sources - The source objects to merge from.
 * @returns {Record<string, any>} Returns the modified target object.
 */
export function merge(target: Record<string, any>, ...sources: Array<Record<string, any>>): Record<string, any> {
  Validator.instance(Array, sources);
  if (!sources.length) return target;

  const source = sources.shift();
  if (!source) return target;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== 'object') target[key] = {};
        merge(target[key], source[key]);
      } else if (Array.isArray(source[key])) {
        if (!target[key] || !Array.isArray(target[key])) target[key] = [];
        target[key] = target[key].concat(source[key]);
      } else target[key] = source[key];
    }
  }

  return merge(target, ...sources);
}