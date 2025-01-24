import { set } from '../utils/Lodash';
import Validator from '../utils/Validator';

import { existsSync, unlinkSync, writeFileSync } from 'graceful-fs';
import { resolve } from 'node:path';

/**
 * MemoryDriver is a class that manages an in-memory cache with support for various operations
 * such as setting, getting, deleting, and iterating over key-value pairs.
 * @template V The type of the values stored in the cache.
 */
export default class MemoryDriver<V = any> {
  protected readonly _cache: Map<string, V> = new Map();
  protected readonly options!: _MemoryDriverOptions;

  /**
   * Creates an instance of MemoryDriver.
   * @param {MemoryDriverOptions} [options={}] The options for the memory driver.
   */
  public constructor(options: MemoryDriverOptions = {}) {
    // @ts-ignore
    this.constructor.checkOptions(this.options, options, { type: 'memory' });

    if (this.constructor.name != 'MemoryDriver' && existsSync(this.options.path)) {
      try {
        this.read();
      } catch {
        throw new ReferenceError('Database malformed');
      }
    }

    if (this.constructor.name != 'MemoryDriver' && !existsSync(this.options.path)) writeFileSync(this.options.path, '{}', { encoding: 'utf8' });
  }

  /**
   * Reads data from the storage and populates the cache.
   * This method is intended to be implemented by subclasses.
   * 
   * @throws {Error} Throws an error if the method is not implemented.
   */
  protected read(): void {
    throw new Error('Method not implemented.');
  }

  /**
   * Writes the current cache contents to the storage.
   * This method is intended to be implemented by subclasses.
   * 
   * @throws {Error} Throws an error if the method is not implemented.
   */
  protected write(): void {
    throw new Error('Method not implemented.');
  }

  /**
   * Gets the cache as a Map.
   * @returns {Map<string, V>} The cache containing key-value pairs.
   */
  public get cache(): typeof this._cache {
    return this._cache;
  }

  /**
   * Returns an iterator for the cache entries.
   * @returns {IterableIterator<[string, V]>} An iterator that yields key-value pairs from the cache.
   */
  *[Symbol.iterator](): IterableIterator<[string, V]> {
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
    if (this.options.size != 0 && (this.cache.size >= this.options.size)) throw new RangeError(`Database limit exceeded. (${this.cache.size}/${this.options.size})`);

    this.cache.set(Validator.string(key), value);

    if (this.constructor.name != 'MemoryDriver') this.write();

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
    return this.cache.delete(Validator.string(key)) ?? false;
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
    const arr: { key: string, value: V }[] = new Array(this.cache.size);
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
   * 
   * This method checks the provided options against the default values and ensures that
   * they are valid. It will throw errors if the options are not in the expected format
   * or if they contain invalid values.
   * 
   * @param target - The target object where validated options will be assigned.
   * @param base - The base options to validate against.
   * @param override - Optional parameters to override the base options.
   * 
   * @throws {Error} Throws an error if the base options are not an object or if any
   * of the provided options are invalid.
   * 
   * @returns {void} This method does not return a value.
   */
  static checkOptions(target: object, base: MemoryDriverOptions, override?: MemoryDriverOptions): void {
    const _options = Object.create({});

    if (typeof base !== 'object' || base === null) throw new Error('Options must be an object');

    Object.defineProperty(_options, 'type', { value: override?.type ?? (base?.type ?? 'memory') });
    Object.defineProperty(_options, 'path', { value: override?.path ?? (base?.path ?? `erfdb.${_options.type}`) });
    Object.defineProperty(_options, 'size', { value: override?.size ?? (base?.size ?? 0) });
    Object.defineProperty(_options, 'spaces', { value: (override as JsonDriverOptions)?.spaces ?? ((base as JsonDriverOptions)?.spaces ?? 2) });

    if (typeof _options.type === 'string') {
      const validTypes = ['json', 'bson', 'yaml', 'memory', 'custom', 'auto'];

      if (!validTypes.includes(_options.type)) throw new Error(`Invalid type: ${_options.type}. Must be one of: ${validTypes.join(', ')}`);
    }

    if (!(_options.path instanceof URL)) {
      try {
        const path = _options.path.toString();

        Object.defineProperty(_options, 'path', { value: path.startsWith('file://') ? new URL(path) : new URL(`file://${resolve(process.cwd(), path)}`) });
      } catch (error: any) {
        throw new Error(`Invalid path: ${error.message}`);
      }
    }

    if (typeof _options.size !== 'number' || _options.size < 0) throw new Error('Size must be a non-negative number');
    if (typeof _options.spaces !== 'number' || _options.spaces < 0) throw new Error('Spaces must be a non-negative number');

    Object.assign(target, _options);
  }
}