import { set } from '../utils/Lodash';
import Validator from '../utils/Validator';

import { existsSync, unlinkSync } from 'graceful-fs';

/**
 * MemoryDriver is a class that manages an in-memory cache with support for various operations
 * such as setting, getting, deleting, and iterating over key-value pairs.
 * @template V The type of the values stored in the cache.
 */
export default class MemoryDriver<V = any> {
  protected readonly _cache: Map<string, V> = new Map();
  protected readonly options: _MemoryDriverOptions;

  /**
   * Creates an instance of MemoryDriver.
   * @param {MemoryDriverOptions} [options={}] The options for the memory driver.
   */
  public constructor(options: MemoryDriverOptions = {}) {
    // @ts-ignore
    this.options = this.constructor.checkOptions({ ...options, type: 'memory' });

    if (this.constructor.name != 'MemoryDriver' && existsSync(this.options.path)) {
      try {
        this.read();
      } catch {
        throw new ReferenceError('Database malformed');
      }
    }
  }

  protected read(): void {
    throw new Error('Method not implemented.');
  }

  protected write(): void {
    throw new Error('Method not implemented.');
  }

  public get cache(): typeof this._cache {
    return this._cache;
  }

  *[Symbol.iterator]() {
    yield* this.cache;
  }

  /**
   * Gets the number of entries in the cache.
   * @returns {number} The size of the cache.
   */
  public get size(): number {
    return this.cache.size;
  }

  /**
   * Sets a value in the cache.
   * @param {string} key The key to set.
   * @param {V} value The value to set.
   * @returns {V} The set value.
   */
  public set(key: string, value: V): V {
    if (this.options.size != 0 && (this.size > this.options.size)) throw new RangeError(`Database limit exceeded. (${this.size}/${this.options.size})`);

    this.cache.set(Validator.string(key), Validator.any(value));

    return value;
  }

  /**
   * Gets a value from the cache.
   * @param {string} key The key to get.
   * @returns {V | undefined} The value associated with the key, or undefined if the key does not exist.
   */
  public get(key: string): V | undefined {
    const data = this.cache.get(Validator.string(key));

    return data;
  }

  /**
   * Checks if a key exists in the cache.
   * @param {string} key The key to check.
   * @returns {boolean} True if the key exists, false otherwise.
   */
  public has(key: string): boolean {
    return this.cache.has(Validator.string(key));
  }

  /**
   * Deletes a key from the cache.
   * @param {string} key The key to delete.
   * @returns {boolean} True if the key was deleted, false otherwise.
   */
  public del(key: string): boolean {
    return this.has(key) ? this.cache.delete(Validator.string(key)) : false;
  }

  /**
   * Deletes the database file associated with the driver if it exists.
   * This method only applies to subclasses of MemoryDriver and not to the MemoryDriver itself.
   * 
   * @returns {boolean} True if the database file was successfully deleted, false otherwise.
   */
  public destroy(): boolean {
    let _status: boolean = false;

    if (this.constructor.name === 'MemoryDriver') _status = false;

    const path = this.options.path;

    unlinkSync(path);
    _status = !existsSync(path);

    return _status;
  }

  /**
   * Clears all entries in the cache.
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Converts the cache to a JSON object.
   * @returns {Record<string, V>} The JSON representation of the cache.
   */
  public toJSON(): Record<string, V> {
    const data: Record<string, V> = {};

    for (const [key, value] of this) set(data, key, value);

    return data;
  }

  /**
   * Converts the cache to an array of key-value pairs.
   * @returns {{ key: string, value: V }[]} The array representation of the cache.
   */
  public toArray(): { key: string, value: V }[] {
    const data = this.toJSON();

    const arr: { key: string, value: V }[] = [];

    for (const key in data) arr.push({ key, value: data[key] });

    return arr;
  }

  /**
   * Converts the cache to a Set of key-value pairs.
   * @returns A Set containing objects with key-value pairs.
   */
  public toSet(): Set<{ key: string, value: V }> {
    return new Set(this.toArray());
  }

  /**
   * Executes a callback for each entry in the cache.
   * @param {(value: V, key: string, Driver: this) => void} callback The callback to execute.
   */
  public each(callback: (value: V, key: string, Driver: this) => void): void {
    Validator.function(callback);

    for (const [key, value] of this) callback(value, key, this);
  }

  /**
   * Creates a new MemoryDriver instance containing only the entries that satisfy the provided callback function.
   * 
   * @param {(value: V, key: string, driver: this) => boolean} callback - The function to test each entry. 
   * It is called with three arguments: the value of the entry, the key of the entry, and the MemoryDriver instance itself.
   * 
   * @returns {MemoryDriver<V>} A new MemoryDriver instance with entries that pass the test implemented by the callback.
   */
  public map(callback: (value: V, key: string, Driver: this) => boolean): MemoryDriver<V> {
    Validator.function(callback);
    // @ts-ignore
    const _cache: MemoryDriver<V> = new this.constructor[Symbol.species](this.options);

    for (const [key, value] of this) callback(value, key, this) ? _cache.set(key, value) : null;

    return _cache;
  }

  /**
   * Validates and sets default values for the provided options.
   * @param {MemoryDriverOptions} [o={}] The options to validate.
   * @returns {MemoryDriverOptions} The validated and defaulted options.
   */
  static checkOptions(o?: MemoryDriverOptions): _MemoryDriverOptions {
    o ??= {};

    Validator.object(o);

    o.type ??= 'memory';
    o.path ??= new URL(`file:///${process.cwd()}/erx.db.${o.type}`);
    o.size ??= 0;
    o.debugger ??= false;

    return Validator.ObjectValidation({
      type: Validator.StringInputValidation('json', 'bson', 'yaml', 'memory', 'custom', 'auto'),
      path: Validator.URLValidation,
      size: Validator.NumberValidation,
      debugger: Validator.BooleanValidation
    }).parse(o);
  }
}