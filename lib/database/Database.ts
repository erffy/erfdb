import MemoryDriver from '../drivers/MemoryDriver';
import Validator from '../utils/Validator';

/**
 * Represents a database for storing key-value pairs with various utility methods.
 */
export default class Database<V = any> {
  protected readonly options: _DatabaseOptions<V>;

  /**
   * Creates an instance of Database.
   * @param options - The options to configure the database.
   */
  public constructor(options?: DatabaseOptions<V>) {
    this.options = Database.checkOptions<V>(options);
  }

  /**
   * Iterates over the entries in the database.
   * @yields The key-value pairs in the database.
   */
  *[Symbol.iterator](): Iterator<[string, V]> {
    yield* this.options.driver;
  }

  /**
   * Gets the size of the database.
   * @returns The number of entries in the database.
   */
  public get size(): number {
    return this.options.driver.size;
  }

  /**
   * Retrieves all entries in the database.
   * @param amount - The maximum number of entries to retrieve. Defaults to 0 (retrieve all).
   * @returns An array of key-value pairs.
   */
  public all(amount: number = 0): { key: string, value: V }[] {
    Validator.number(amount);

    const results: { key: string, value: V }[] = Array.from(this).map(([key, value]) => ({ key, value }));

    return amount > 0 ? results.slice(0, amount) : results;
  }

  /**
   * Retrieves all keys and values as separate arrays.
   * @returns An object containing the keys and values arrays.
   */
  public array(): { keys: string[], values: V[] } {
    const keys: string[] = [];
    const values: V[] = [];

    const data = this.options.driver.array();

    for (const { key, value } of data) {
      keys.push(key);
      values.push(value);
    }

    return { keys, values };
  }

  /**
   * Retrieves the key or value at the specified pattern.
   * @param pattern - The pattern specifying whether to retrieve a key or value.
   * @returns The key or value at the specified pattern, or undefined if not found.
   */
  public at(pattern: string): string | V | undefined {
    Validator.StringValidation.regex(/^(k|key|v|value):\d+$/).parse(pattern);

    const array = this.array();
    const keys = array.keys;
    const values = array.values;

    const [type, _index] = pattern.split(':');

    let index = Number(_index);
    if (isNaN(index)) return undefined;
    index = Math.floor(index);
    Validator.NumberValidation.greaterThanOrEqual(0).parse(index);

    if (type === 'k' || type === 'key') return keys[index];
    else if (type === 'v' || type === 'value') return values[index];
    else return undefined;
  }

  /**
   * Creates a clone of the database.
   * @returns A new database instance with the same entries.
   */
  public clone(): Database<V> {
    const clone = new Database<V>({ driver: new MemoryDriver(this.options) });

    this.each((value, index, key) => clone.set(key, value));

    return clone;
  }

  /**
   * Concatenates multiple databases into one.
   * @param databases - The databases to concatenate.
   * @returns A new database instance with combined entries.
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
   * @param key - The key of the entry to delete.
   * @returns True if the entry was deleted, false otherwise.
   */
  public del(key: string): boolean {
    return this.options.driver.del(key);
  }

  /**
   * Iterates over each entry in the database and calls the provided callback.
   * @param callback - The function to call for each entry.
   * @returns The database instance.
   */
  public each(callback: (value: V, index: number, key: string, Database: this) => void): this {
    Validator.function(callback);

    const data = this.all();
    for (let index = 0; index < data.length; index++) {
      const { key, value } = data[index];

      callback(value, index, key, this);
    }

    return this;
  }

  /**
   * Checks if every entry in the database satisfies the provided callback.
   * @param callback - The function to test for each entry.
   * @returns True if every entry satisfies the callback, false otherwise.
   */
  public every(callback: (value: V, key: string, Database: this) => boolean): boolean {
    Validator.function(callback);

    const data = this.all();

    for (const { key, value } of data) {
      if (!callback(value, key, this)) return false;
    }

    return true;
  }

  /**
   * Filters the database based on the provided callback.
   * @param callback - The function to test for each entry.
   * @returns A new database instance with the filtered entries.
   */
  public filter(callback: (value: V, index: number, key: string, Database: this) => boolean): Database<V> {
    Validator.function(callback);

    const db: Database<V> = new Database({ driver: new MemoryDriver(this.options) });

    this.each((value, index, key, Database) => {
      if (callback(value, index, key, Database)) db.set(key, value);
    });

    return db;
  }

  /**
   * Finds the first entry that satisfies the provided callback.
   * @param callback - The function to test for each entry.
   * @returns The first entry that satisfies the callback, or undefined if none found.
   */
  public find(callback: (value: V, index: number, key: string, Database: this) => boolean): { key: string, value: V } | undefined {
    Validator.function(callback);

    const data = this.all();
    for (let index = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (callback(value, index, key, this)) return { key, value };
    }

    return undefined;
  }

  /**
   * Retrieves the value associated with the given key.
   * @param key - The key of the entry to retrieve.
   * @returns The value associated with the key, or undefined if not found.
   */
  public get(key: string): V | undefined {
    return this.options.driver.get(key);
  }

  /**
   * Checks if an entry with the given key exists.
   * @param key - The key to check.
   * @returns True if the entry exists, false otherwise.
   */
  public has(key: string): boolean {
    return this.options.driver.has(key);
  }

  /**
   * Creates a new database with the intersection of entries from the current database and another database.
   * @param other - The other database to intersect with.
   * @returns A new database instance with the intersected entries.
   */
  public intersection(other: Database<V>): Database<V> {
    Validator.instance(Database, other);

    const db: Database<V> = new Database({ driver: new MemoryDriver() });
    this.each((value, index, key) => {
      if (other.has(key)) db.set(key, value);
    });

    return db;
  }

  /**
   * Retrieves all entries in the database as a JSON object.
   * @returns A JSON object containing all entries.
   */
  public json(): Record<string, V> {
    return this.options.driver.json();
  }

  /**
   * Retrieves the key associated with the given value.
   * @param value - The value to find the key for.
   * @returns The key associated with the value, or undefined if not found.
   */
  public keyOf(value: V): string | undefined {
    const entry = this.find((v) => v === value);

    return entry ? entry.key : undefined;
  }

  /**
   * Performs mathematical operations on a numeric value stored in the cache.
   * Supported operations include addition, subtraction, multiplication, division,
   * modulus, and exponentiation.
   * @param {string} key - The key of the numeric value in the cache.
   * @param {MathOperators} operator - The mathematical operator ('+', '-', '*', '**', '%', '/').
   * @param {number} [count=1] - The operand for the mathematical operation (default: 1).
   * @param {boolean} [negative=false] - Whether to allow negative results (default: false).
   * @returns {number} The result of the mathematical operation.
   * @throws {TypeError} If the operator is not one of the supported operators.
   * @throws {RangeError} If attempting to perform an invalid mathematical operation.
   */
  public math(key: string, operator: MathOperators, count: number = 1, negative: boolean = false): number {
    Validator.StringInputValidation('+', '-', '*', '**', '%', '/').parse(operator);
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
   * @param callback - The function to test for each entry.
   * @returns A new database instance with the mapped entries.
   */
  public map(callback: (value: V, index: number, key: string, Database: this) => boolean): Database<V> {
    Validator.function(callback);

    const db: Database<V> = new Database({ driver: new MemoryDriver(this.options) });

    this.each((...args) => {
      if (callback(...args)) db.set(args[2], args[0]);
    });

    return db;
  }

  /**
   * Merges another database into the current database.
   * @param other - The other database to merge.
   * @returns The current database instance.
   */
  public merge(other: Database<V>): this {
    Validator.instance(Database, other);

    other.each((value, index, key) => this.set(key, value));

    return this;
  }

  /**
   * Partitions the database into two databases based on the provided callback.
   * @param callback - The function to test for each entry.
   * @returns A tuple containing two new database instances: one with entries that satisfy the callback and one with entries that do not.
   */
  public partition(callback: (value: V, index: number, key: string, Database: this) => boolean): [Database<V>, Database<V>] {
    Validator.function(callback);

    const db1: Database<V> = new Database({ driver: new MemoryDriver(this.options) });
    const db2: Database<V> = new Database({ driver: new MemoryDriver(this.options) });

    this.each((value, index, key, Database) => {
      if (callback(value, index, key, Database)) db1.set(key, value);
      else db2.set(key, value);
    });

    return [db1, db2];
  }

  /**
   * Creates a new database with only the specified keys.
   * @param keys - The keys to pick.
   * @returns A new database instance with the picked entries.
   */
  public pick(...keys: string[]): Database<V> {
    Validator.instance(Array, keys);
    const db = new Database<V>({ driver: new MemoryDriver() });

    for (const key of keys) {
      if (this.has(key)) db.set(key, this.get(key)!);
    }

    return db;
  }

  /**
   * Retrieves an array of values for a specific key name in the entries.
   * @param keyName - The key name to pluck values for.
   * @returns An array of values for the specified key name.
   */
  public pluck<T>(keyName: string): T[] {
    Validator.string(keyName);

    const values: T[] = [];
    this.each((value: any) => {
      if (typeof value === 'object' && value.hasOwnProperty(keyName)) values.push(value[keyName]);
    });

    return values;
  }

  /**
   * Reduces the entries in the database to a single value based on the provided callback and initial value.
   * @param callback - The function to execute on each entry.
   * @param initialValue - The initial value to start the reduction.
   * @returns The reduced value.
   */
  public reduce<R>(callback: (accumulator: R, value: V, index: number, key: string, Database: this) => R, initialValue: R): R {
    Validator.function(callback);

    let accumulator = initialValue;
    this.each((value, index, key, Database) => {
      accumulator = callback(accumulator, value, index, key, Database);
    });

    return accumulator;
  }

  /**
   * Sets a key-value pair in the database.
   * @param key - The key to set.
   * @param value - The value to associate with the key.
   * @returns The value that was set.
   */
  public set(key: string, value: V): V {
    return this.options.driver.set(key, value);
  }

  /**
   * Creates a new database with a subset of entries based on the start and end indices.
   * @param start - The starting index.
   * @param end - The ending index. Defaults to the size of the database.
   * @returns A new database instance with the sliced entries.
   */
  public slice(start: number = 0, end: number = this.size): Database<V> {
    Validator.NumberValidation.greaterThanOrEqual(0).parse(start);
    Validator.NumberValidation.greaterThanOrEqual(start).lessThanOrEqual(this.size).parse(end);

    const db: Database<V> = new Database({ driver: new MemoryDriver() });

    for (const { key, value } of this.all().slice(start, end)) db.set(key, value);

    return db;
  }

  /**
   * Checks if some entries in the database satisfy the provided callback.
   * @param callback - The function to test for each entry.
   * @returns True if at least one entry satisfies the callback, false otherwise.
   */
  public some(callback: (value: V, index: number, key: string, Database: this) => boolean): boolean {
    Validator.function(callback);

    const data = this.all();

    for (let index = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (callback(value, index, key, this)) return true;
    }

    return false;
  }

  /**
   * Sweeps entries from the database based on the provided callback.
   * @param callback - The function to test for each entry.
   * @returns The number of entries removed.
   */
  public sweep(callback: (value: V, key: string, Database: this) => boolean): number {
    Validator.function(callback);

    const size = this.size;

    this.each((value, index, key, db) => {
      if (callback(value, key, db)) this.del(key);
    });

    return size - this.size;
  }

  /**
   * Retrieves the value associated with the specified key.
   * 
   * Alternative to get() function. Only difference is this function uses find() function.
   * @param key - The key of the entry to retrieve.
   * @returns The value associated with the specified key, or undefined if the key is not found.
   */
  public valueOf(key: string): V | undefined {
    Validator.string(key);

    const entry = this.find((v, i, k) => k === key);

    return entry ? entry.value : undefined;
  }

  /**
   * Validates and checks the options for the database.
   * @param options - The options to validate and check.
   * @returns The validated and checked options.
   */
  static checkOptions<T>(options?: DatabaseOptions<T>): _DatabaseOptions<T> {
    options ??= {};

    Validator.object(options);

    MemoryDriver.checkOptions(options);

    options.spaces ??= 2;
    options.driver ??= new MemoryDriver(options);

    Validator.number(options.spaces);

    return options as _DatabaseOptions;
  }
}