import MemoryDriver from '../drivers/MemoryDriver';
import Validator from '../utils/Validator';

/**
 * Represents a database for storing key-value pairs with various utility methods.
 * @template V The type of values stored in the database. Defaults to any.
 */
export default class Database<V = any> {
  protected readonly options: _DatabaseOptions<V>;

  /**
   * Creates an instance of Database.
   * @param options - The options to configure the database.
   */
  public constructor(options: DatabaseOptions<V> = {}) {
    // @ts-ignore
    this.options = this.constructor.checkOptions(options);
  }

  /**
   * Iterates over the entries in the database.
   * @yields {[string, V]} The key-value pairs in the database.
   */
  *[Symbol.iterator](): Iterator<[string, V]> {
    yield* this.options.driver;
  }

  /**
   * Gets the size of the database.
   * @returns {number} The number of entries in the database.
   */
  public get size(): number {
    return this.options.driver.size;
  }

  /**
   * Gets whether the database is empty.
   * @returns {boolean} True if database has no entries, false otherwise.
   */
  public get isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Clears all entries in the database.
   * @returns {void}
   */
  public clear(): void {
    this.options.driver.clear();
  }

  /**
   * Retrieves all entries in the database.
   * @param {number} amount - The maximum number of entries to retrieve. Defaults to 0 (retrieve all).
   * @returns {Set<{key: string, value: V}>} A Set of key-value pairs.
   */
  public all(amount: number = 0): Set<{ key: string, value: V }> {
    Validator.number(amount);

    const results: { key: string, value: V }[] = this.options.driver.toArray();

    return new Set(amount > 0 ? results.slice(0, amount) : results);
  }

  /**
   * Retrieves the key or value at the specified pattern.
   * @param {string} pattern - The pattern specifying whether to retrieve a key or value (format: "key:index" or "value:index").
   * @returns {string | V | undefined} The key or value at the specified pattern, or undefined if not found.
   * @throws {Error} If pattern is invalid or index is out of bounds.
   */
  public at(pattern: string): string | V | undefined {
    Validator.StringValidation.regex(/^(k|key|v|value):\d+$/).parse(pattern);

    const array = this.toArray();
    const keys = array.keys;
    const values = array.values;

    const [type, _index] = pattern.split(':');

    let index = Number(_index);
    if (isNaN(index)) return undefined;
    index = Math.floor(index);
    Validator.NumberValidation.int().greaterThanOrEqual(0).lessThanOrEqual(this.size).parse(index);

    if (type === 'k' || type === 'key') return keys[index];
    else if (type === 'v' || type === 'value') return values[index];
    else return undefined;
  }

  /**
   * Creates a clone of the database.
   * @param {boolean} contents - Whether to clone the contents (default: true).
   * @returns {Database<V>} A new database instance with the same entries.
   */
  public clone(contents: boolean = true): Database<V> {
    Validator.boolean(contents);
    // @ts-ignore
    const clone: Database<V> = new this.constructor({ driver: new MemoryDriver(this.options) });

    if (contents) this.each((value, index, key) => clone.set(key, value));

    return clone;
  }

  /**
   * Concatenates multiple databases into one.
   * @param {...Database<V>[]} databases - The databases to concatenate.
   * @returns {Database<V>} A new database instance with combined entries.
   * @throws {Error} If any argument is not a Database instance.
   */
  public concat(...databases: Database<V>[]): Database<V> {
    const _db = this.clone();

    for (const db of databases) {
      Validator.instance(Database, db);

      db.each((value, index, key) => _db.set(key, value));
    }

    return _db;
  }

  /**
   * Deletes an entry by key.
   * @param {string} key - The key of the entry to delete.
   * @returns {boolean} True if the entry was deleted, false otherwise.
   */
  public del(key: string): boolean {
    return this.options.driver.del(key);
  }

  /**
   * Deletes the database file associated with the driver if it exists.
   * @returns {boolean} True if the database file was successfully deleted, false otherwise.
   */
  public destroy(): boolean {
    return this.options.driver.destroy();
  }

  /**
   * Iterates over each entry in the database and calls the provided callback.
   * @param {Function} callback - The function to call for each entry.
   * @param {V} callback.value - The value of the current entry.
   * @param {number} callback.index - The index of the current entry.
   * @param {string} callback.key - The key of the current entry.
   * @param {Database<V>} callback.Database - The database instance.
   * @returns {this} The database instance.
   */
  public each(callback: (value: V, index: number, key: string, Database: this) => void): void {
    Validator.function(callback);

    let index: number = 0;
    for (const { key, value } of this.all()) {
      callback(value, index, key, this);
      index++;
    }
  }

  /**
   * Checks if every entry in the database satisfies the provided callback.
   * @param {Function} callback - The function to test for each entry.
   * @param {V} callback.value - The value of the current entry.
   * @param {string} callback.key - The key of the current entry.
   * @param {Database<V>} callback.Database - The database instance.
   * @returns {boolean} True if every entry satisfies the callback, false otherwise.
   */
  public every(callback: (value: V, key: string, Database: this) => boolean): boolean {
    Validator.function(callback);

    for (const { key, value } of this.all()) {
      if (!callback(value, key, this)) return false;
    }

    return true;
  }

  /**
   * Retrieves the first entry in the database.
   * @returns {{key: string, value: V} | {}} The first key-value pair, or empty object if the database is empty.
   */
  public first(): { key: string; value: V; } | {} {
    const data = this.find((v, i, k) => i === 0);

    return data ?? {};
  }

  /**
   * Filters the database based on the provided callback.
   * @param {Function} callback - The function to test for each entry.
   * @param {V} callback.value - The value of the current entry.
   * @param {number} callback.index - The index of the current entry.
   * @param {string} callback.key - The key of the current entry.
   * @param {Database<V>} callback.Database - The database instance.
   * @returns {Database<V>} A new database instance with the filtered entries.
   */
  public filter(callback: (value: V, index: number, key: string, Database: this) => boolean): Database<V> {
    Validator.function(callback);

    const db: Database<V> = this.clone(false);

    this.each((value, index, key, Database) => {
      if (callback(value, index, key, Database)) db.set(key, value);
    });

    return db;
  }

  /**
   * Finds the first entry that satisfies the provided callback.
   * @param {Function} callback - The function to test for each entry.
   * @param {V} callback.value - The value of the current entry.
   * @param {number} callback.index - The index of the current entry.
   * @param {string} callback.key - The key of the current entry.
   * @param {Database<V>} callback.Database - The database instance.
   * @returns {{key: string, value: V, index: number} | undefined} The first entry that satisfies the callback, or undefined if none found.
   */
  public find(callback: (value: V, index: number, key: string, Database: this) => boolean): { key: string, value: V, index: number } | undefined {
    Validator.function(callback);

    let index: number = 0;
    for (const { key, value } of this.all()) {
      if (callback(value, index, key, this)) return { key, value, index };
      index++;
    }

    return undefined;
  }

  /**
   * Finds all entries that satisfy the provided callback.
   * @param {Function} callback - The function to test for each entry.
   * @param {V} callback.value - The value of the current entry.
   * @param {number} callback.index - The index of the current entry.
   * @param {string} callback.key - The key of the current entry.
   * @param {Database<V>} callback.Database - The database instance.
   * @returns {Array<{key: string, value: V, index: number}>} Array of matching entries.
   */
  public findAll(callback: (value: V, index: number, key: string, Database: this) => boolean): { key: string, value: V, index: number }[] {
    Validator.function(callback);
    const results: { key: string, value: V, index: number }[] = [];

    let index: number = 0;
    for (const { key, value } of this.all()) {
      if (callback(value, index, key, this)) results.push({ key, value, index });

      index++;
    }

    return results;
  }

  /**
   * Gets the value associated with the given key.
   * @param {string} key - The key of the entry to retrieve.
   * @returns {V | undefined} The value associated with the key, or undefined if not found.
   */
  public get(key: string): V | undefined {
    return this.options.driver.get(key);
  }

  /**
   * Checks if an entry with the given key exists.
   * @param {string} key - The key to check.
   * @returns {boolean} True if the entry exists, false otherwise.
   */
  public has(key: string): boolean {
    return this.options.driver.has(key);
  }

  /**
   * Returns the index of the given key.
   * @param {string} key - The key to find the index of.
   * @returns {number} The index of the key, or -1 if not found.
   */
  public indexOf(key: string): number {
    return this.find((v, i, k) => k === key)?.index ?? -1;
  }

  /**
   * Creates a new database with the intersection of entries from the current database and another database.
   * @param {Database<V>} other - The other database to intersect with.
   * @returns {Database<V>} A new database instance with the intersected entries.
   * @throws {Error} If other is not a Database instance.
   */
  public intersection(other: Database<V>): Database<V> {
    Validator.instance(Database, other);

    const db: Database<V> = this.clone(false);
    this.each((value, index, key) => {
      if (other.has(key)) db.set(key, value);
    });

    return db;
  }

  /**
   * Retrieves the key associated with the given value.
   * @param {V} value - The value to find the key for.
   * @returns {string | undefined} The key associated with the value, or undefined if not found.
   */
  public keyOf(value: V): string | undefined {
    return this.find((v) => v === value)?.key ?? undefined;
  }

  /**
   * Retrieves the last entry in the database.
   * @returns {{key: string, value: V} | {}} The last key-value pair, or empty object if the database is empty.
   */
  public last(): { key: string; value: V; } | {} {
    return this.find((v, i, k) => i === this.size - 1) ?? {};
  }

  /**
   * Performs mathematical operations on a numeric value stored in the cache.
   * @param {string} key - The key of the numeric value in the cache.
   * @param {MathOperators} operator - The mathematical operator ('+', '-', '*', '**', '%', '/').
   * @param {number} [count=1] - The operand for the mathematical operation.
   * @param {boolean} [negative=false] - Whether to allow negative results.
   * @returns {number} The result of the mathematical operation.
   * @throws {TypeError} If the operator is invalid or value is not a number.
   * @throws {RangeError} If attempting to perform an invalid mathematical operation.
   */
  public math(key: string, operator: MathOperators, count: number = 1, negative: boolean = false): number {
    Validator.stringInput('+', '-', '*', '**', '%', '/').parse(operator);
    Validator.NumberValidation.greaterThan(1).parse(count);

    if (!this.has(key)) this.set(key, 0 as V);

    let data: number = this.get(key) as number;
    Validator.number(data);

    switch (operator) {
      case '+': data += count; break;
      case '-': data -= count; break;
      case '%': data %= count; break;
      case '*': data *= count; break;
      case '/': data /= count; break;
      case '**': data **= count; break;
    }

    if (!negative && data < 0) data = 0;

    this.set(key, data as V);

    return data;
  }

  /**
   * Creates a new database with entries that satisfy the provided callback.
   * @param {Function} callback - The function to test for each entry.
   * @param {V} callback.value - The value of the current entry.
   * @param {number} callback.index - The index of the current entry.
   * @param {string} callback.key - The key of the current entry.
   * @param {Database<V>} callback.Database - The database instance.
   * @returns {Database<V>} A new database instance with the mapped entries.
   */
  public map(callback: (value: V) => V): Database<V> {
    const newDb = this.clone(false);
    this.each((value, index, key) => newDb.set(key, callback(value)));
    return newDb;
  }

  /**
   * Merges another database into the current database.
   * @param {Database<V>} other - The other database to merge.
   * @returns {this} The current database instance.
   * @throws {Error} If other is not a Database instance.
   */
  public merge(other: Database<V>): this {
    Validator.instance(Database, other);

    other.each((value, index, key) => this.set(key, value));

    return this;
  }

  /**
   * Partitions the database into two databases based on the provided callback.
   * @param {Function} callback - The function to test for each entry.
   * @param {V} callback.value - The value of the current entry.
   * @param {number} callback.index - The index of the current entry.
   * @param {string} callback.key - The key of the current entry.
   * @param {Database<V>} callback.Database - The database instance.
   * @returns {[Database<V>, Database<V>]} A tuple containing two new database instances: one with entries that satisfy the callback and one with entries that do not.
   */
  public partition(callback: (value: V, index: number, key: string, Database: this) => boolean): [Database<V>, Database<V>] {
    Validator.function(callback);

    const db1: Database<V> = this.clone(false);
    const db2: Database<V> = this.clone(false);

    this.each((value, index, key, Database) => {
      if (callback(value, index, key, Database)) db1.set(key, value);
      else db2.set(key, value);
    });

    return [db1, db2];
  }

  /**
   * Pushes a value to an array at the specified key.
   * @param {string} key - The key of the entry.
   * @param {V} value - The value to push.
   * @returns {V[]} The updated array after the push operation.
   */
  public push(key: string, value: V): V[] {
    const data = this.get(key);

    if (!Array.isArray(data)) return this.set(key, [value] as V) as V[];

    data.push(value);
    this.set(key, data as V);

    return data;
  }


  /**
   * Pulls a value from an array at the specified key.
   * @param {string} key - The key of the entry.
   * @param {V} value - The value to pull.
   * @returns {V[] | undefined} The updated array after the pull operation, or undefined if the key does not exist or is not an array.
   */
  public pull(key: string, value: V): V[] | undefined {
    const data = this.get(key);
    if (!Array.isArray(data)) return undefined;

    const index = data.indexOf(value);
    if (index !== -1) {
      data.splice(index, 1);
      this.set(key, data as V);
    }

    return data;
  }

  /**
   * Creates a new database with only the specified keys.
   * @param {...string[]} keys - The keys to pick.
   * @returns {Database<V>} A new database instance with the picked entries.
   * @throws {Error} If keys is not an array.
   */
  public pick(...keys: string[]): Database<V> {
    Validator.instance(Array, keys);

    const db: Database<V> = this.clone(false);

    for (const key of keys) {
      if (!this.has(key)) continue;

      db.set(key, this.get(key)!);
    }

    return db;
  }

  /**
   * Reduces the entries in the database to a single value based on the provided callback and initial value.
   * @param {Function} callback - The function to execute on each entry.
   * @param {R} callback.accumulator - The accumulator value.
   * @param {V} callback.value - The value of the current entry.
   * @param {number} callback.index - The index of the current entry.
   * @param {string} callback.key - The key of the current entry.
   * @param {Database<V>} callback.Database - The database instance.
   * @param {R} initialValue - The initial value to start the reduction.
   * @returns {R} The reduced value.
   * @template R The type of the reduced value.
   */
  public reduce<R>(callback: (accumulator: R, value: V, index: number, key: string, Database: this) => R, initialValue: R): R {
    Validator.function(callback);

    let accumulator = initialValue;
    this.each((value, index, key, Database) => accumulator = callback(accumulator, value, index, key, Database));

    return accumulator;
  }

  /**
   * Sets a key-value pair in the database.
   * @param {string} key - The key to set.
   * @param {V} value - The value to associate with the key.
   * @returns {V} The value that was set.
   */
  public set(key: string, value: V): V {
    return this.options.driver.set(key, value);
  }

  /**
   * Creates a new database with a subset of entries based on the start and end indices.
   * @param {number} [start=0] - The starting index.
   * @param {number} [end=this.size] - The ending index.
   * @returns {Database<V>} A new database instance with the sliced entries.
   * @throws {Error} If start or end indices are invalid.
   */
  public slice(start: number = 0, end: number = this.size): Database<V> {
    Validator.NumberValidation.greaterThanOrEqual(0).parse(start);
    Validator.NumberValidation.greaterThanOrEqual(start).lessThanOrEqual(this.size).parse(end);

    const db: Database<V> = this.clone(false);

    for (const { key, value } of Array.from(this.all()).slice(start, end)) db.set(key, value);

    return db;
  }

  /**
   * Checks if some entries in the database satisfy the provided callback.
   * @param {Function} callback - The function to test for each entry.
   * @param {V} callback.value - The value of the current entry.
   * @param {number} callback.index - The index of the current entry.
   * @param {string} callback.key - The key of the current entry.
   * @param {Database<V>} callback.Database - The database instance.
   * @returns {boolean} True if at least one entry satisfies the callback, false otherwise.
   */
  public some(callback: (value: V, index: number, key: string, Database: this) => boolean): boolean {
    Validator.function(callback);

    let index: number = 0;
    for (const { key, value } of this.all()) {
      if (callback(value, index, key, this)) return true;
      index++;
    }

    return false;
  }

  /**
   * Sorts the database entries based on the provided callback.
   * @param {Function} callback - The comparison function.
   * @param {V} callback.a - First value to compare.
   * @param {V} callback.b - Second value to compare.
   * @returns {Database<V>} A new sorted database instance.
   */
  public sort(callback: (a: V, b: V) => number): Database<V> {
    const sorted = Array.from(this.all()).sort((a, b) => callback(a.value, b.value));

    const db = this.clone(false);
    for (const { key, value } of sorted) db.set(key, value);
    return db;
  }

  /**
   * Sweeps entries from the database based on the provided callback.
   * @param {Function} callback - The function to test for each entry.
   * @param {V} callback.value - The value of the current entry.
   * @param {string} callback.key - The key of the current entry.
   * @param {Database<V>} callback.Database - The database instance.
   * @returns {number} The number of entries removed.
   */
  public sweep(callback: (value: V, key: string, Database: this) => boolean): number {
    Validator.function(callback);

    const size = this.size;

    this.each((value, index, key, db) => {
      if (!callback(value, key, db)) return;

      this.del(key);
    });

    return size - this.size;
  }

  /**
   * Retrieves all keys and values as separate arrays.
   * @returns {{keys: string[], values: V[]}} An object containing the keys and values arrays.
   */
  public toArray(): { keys: string[], values: V[] } {
    const keys: string[] = [];
    const values: V[] = [];

    const data = this.options.driver.toSet();

    for (const { key, value } of data) {
      keys.push(key);
      values.push(value);
    }

    return { keys, values };
  }

  /**
   * Converts the cache to two Sets, one for keys and one for values.
   * @returns {[Set<string>, Set<V>]} A tuple containing two Sets: one for keys and one for values.
   */
  public toSet(): [Set<string>, Set<V>] {
    const array = this.toArray();

    return [new Set(array.keys), new Set(array.values)];
  }

  /**
   * Retrieves all entries in the database as a JSON object.
   * @returns {Record<string, V>} A JSON object containing all entries.
   */
  public toJSON(): Record<string, V> {
    return this.options.driver.toJSON();
  }

  /**
   * Determines the type of the value associated with the specified key.
   * @param {string} key - The key of the entry to check.
   * @returns {string | undefined} The type of the value ('array' if the value is an array, or the result of the typeof operator).
   *          Returns undefined if the key does not exist.
   */
  public typeOf(key: string): string | undefined {
    Validator.string(key);

    if (!this.has(key)) return undefined;

    const data = this.get(key);

    if (Array.isArray(data)) return 'array';
    else return (typeof data);
  }

  /**
   * Retrieves the value associated with the specified key.
   * Alternative to get() function. Only difference is this function uses find() function.
   * @param {string} key - The key of the entry to retrieve.
   * @returns {V | undefined} The value associated with the specified key, or undefined if the key is not found.
   */
  public valueOf(key: string): V | undefined {
    return this.find((v, i, k) => k === Validator.string(key))?.value ?? undefined;
  }

  /**
   * Validates and sets default values for the provided options.
   *
   * This method checks the provided options against the default values and ensures that
   * they are valid. It will throw errors if the options are not in the expected format
   * or if they contain invalid values.
   *
   * @param base - The base options to validate against.
   * 
   * @throws {Error} Throws an error if the base options are not an object or if any
   * of the provided options are invalid.
   *
   * @returns {object} The validated options object.
   * 
   * @remarks This method utilizes the `MemoryDriver.checkOptions` method to validate
   * the options and ensures that the driver is an instance of `MemoryDriver`.
   */
  static checkOptions(base: object): object {
    const _options = Object.create({});

    MemoryDriver.checkOptions(_options, base);
    // @ts-ignore
    Object.defineProperty(_options, 'driver', { value: base?.driver ?? new MemoryDriver() });

    if (!(_options.driver instanceof MemoryDriver)) throw new Error('Driver must be an instance of MemoryDriver');

    return _options;
  }
}