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
  private _size: number = 0; // Cache size for O(1) access

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
    return this._size;
  }

  /**
   * Sets a value in the cache.
   * @param {string} key The key to set.
   * @param {V} value The value to set.
   * @returns {V} The set value.
   */
  public set(key: string, value: V): V {
    if (this.options.size != 0 && (this._size >= this.options.size)) throw new RangeError(`Database limit exceeded. (${this._size}/${this.options.size})`);

    const validKey = Validator.string(key);
    if (!this.cache.has(validKey)) this._size++;

    this.cache.set(validKey, value);

    return value;
  }

  /**
   * Sets multiple key-value pairs at once.
   * @param {Array<[string, V]>} entries Array of key-value pairs
   * @returns {this} The driver instance
   */
  public setMany(entries: Array<[string, V]>): this {
    for (const [key, value] of entries) this.set(key, value);

    return this;
  }

  /**
   * Gets a value from the cache.
   * @param {string} key The key to get.
   * @returns {V | undefined} The value associated with the key, or undefined if the key does not exist.
   */
  public get(key: string): V | undefined {
    return this.cache.get(Validator.string(key));
  }

  /**
   * Gets multiple values at once.
   * @param {string[]} keys Array of keys to get
   * @returns {Array<V | undefined>} Array of values
   */
  public getMany(keys: string[]): Array<V | undefined> {
    return keys.map(key => this.get(key));
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
    const validKey = Validator.string(key);
    if (this.cache.delete(validKey)) {
      this._size--;
      return true;
    }

    return false;
  }

  /**
   * Deletes multiple keys at once.
   * @param {string[]} keys Array of keys to delete
   * @returns {number} Number of keys deleted
   */
  public delMany(keys: string[]): number {
    let deleted = 0;

    for (const key of keys) {
      if (this.del(key)) deleted++;
    }

    return deleted;
  }

  /**
   * Deletes the database file associated with the driver if it exists.
   * This method only applies to subclasses of MemoryDriver and not to the MemoryDriver itself.
   *
   * @returns {boolean} True if the database file was successfully deleted, false otherwise.
   */
  public destroy(): boolean {
    if (this.constructor.name === 'MemoryDriver') return false;

    try {
      unlinkSync(this.options.path);
      return !existsSync(this.options.path);
    } catch {
      return false;
    }
  }

  /**
   * Clears all entries in the cache.
   */
  public clear(): void {
    this.cache.clear();
    this._size = 0;
  }

  /**
   * Converts the cache to a JSON object.
   * @returns {Record<string, V>} The JSON representation of the cache.
   */
  public toJSON(): Record<string, V> {
    const data: Record<string, V> = {};

    for (const [key, value] of this.cache) set(data, key, value);

    return data;
  }

  /**
   * Converts the cache to an array of key-value pairs.
   * @returns {{ key: string, value: V }[]} The array representation of the cache.
   */
  public toArray(): { key: string, value: V }[] {
    const arr: { key: string, value: V }[] = new Array(this._size);
    let i = 0;

    for (const [key, value] of this.cache) arr[i++] = { key, value };

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

    for (const [key, value] of this.cache) callback(value, key, this);
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

    for (const [key, value] of this.cache) {
      if (callback(value, key, this)) _cache.set(key, value);
    }

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
    o.path ??= new URL(`file:///${process.cwd()}/erfdb.${o.type}`);
    o.size ??= 0;
    o.debugger ??= false;

    return Validator.object({
      type: Validator.stringInput('json', 'bson', 'yaml', 'memory', 'custom', 'auto'),
      path: Validator.URLValidation,
      size: Validator.NumberValidation,
      debugger: Validator.BooleanValidation
    }).parse(o);
  }
}