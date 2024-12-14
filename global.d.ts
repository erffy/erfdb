/// <reference path="./@types">

declare module 'erfdb' {
  /**
   * Represents a database for storing key-value pairs with various utility methods.
   * @template V The type of values stored in the database. Defaults to any.
   */
  export class Database<V = any> {
    protected readonly options: _DatabaseOptions<V>;

    /**
     * Creates an instance of Database.
     * @param options - The options to configure the database.
     */
    public constructor(options?: DatabaseOptions<V>);

    /**
     * Iterates over the entries in the database.
     * @yields {[string, V]} The key-value pairs in the database.
     */
    [Symbol.iterator](): Iterator<[string, V]>;

    /**
     * Gets the size of the database.
     * @returns {number} The number of entries in the database.
     */
    public get size(): number;

    /**
     * Gets whether the database is empty.
     * @returns {boolean} True if database has no entries, false otherwise.
     */
    public get isEmpty(): boolean;

    /**
     * Clears all entries in the database.
     * @returns {void} This method does not return a value.
     */
    public clear(): void;

    /**
     * Retrieves all entries in the database.
     * @param {number} amount - The maximum number of entries to retrieve. Defaults to 0 (retrieve all).
     * @returns {Set<{key: string, value: V}>} A Set of key-value pairs.
     */
    public all(amount?: number): Set<{ key: string, value: V }>;

    /**
     * Retrieves the key or value at the specified pattern.
     * @param {string} pattern - The pattern specifying whether to retrieve a key or value (format: "key:index" or "value:index").
     * @returns {string | V | undefined} The key or value at the specified pattern, or undefined if not found.
     * @throws {Error} If pattern is invalid or index is out of bounds.
     */
    public at(pattern: string): string | V | undefined;

    /**
     * Creates a clone of the database.
     * @param {boolean} contents - Whether to clone the contents (default: true).
     * @returns {Database<V>} A new database instance with the same entries.
     */
    public clone(contents?: boolean): Database<V>;

    /**
     * Concatenates multiple databases into one.
     * @param {...Database<V>[]} databases - The databases to concatenate.
     * @returns {Database<V>} A new database instance with combined entries.
     * @throws {Error} If any argument is not a Database instance.
     */
    public concat(...databases: Database<V>[]): Database<V>;

    /**
     * Deletes an entry by key.
     * @param {string} key - The key of the entry to delete.
     * @returns {boolean} True if the entry was deleted, false otherwise.
     */
    public del(key: string): boolean;

    /**
     * Deletes multiple entries by keys.
     * @param {...string[]} keys - The keys of entries to delete.
     * @returns {number} Number of entries deleted.
     */
    public deleteMany(...keys: string[]): number;

    /**
     * Deletes the database file associated with the driver if it exists.
     * @returns {boolean} True if the database file was successfully deleted, false otherwise.
     */
    public destroy(): boolean;

    /**
     * Iterates over each entry in the database and calls the provided callback.
     * @param {Function} callback - The function to call for each entry.
     * @param {V} callback.value - The value of the current entry.
     * @param {number} callback.index - The index of the current entry.
     * @param {string} callback.key - The key of the current entry.
     * @param {Database<V>} callback.Database - The database instance.
     * @returns {void}
     */
    public each(callback: (value: V, index: number, key: string, Database: this) => void): void;

    /**
     * Checks if every entry in the database satisfies the provided callback.
     * @param {Function} callback - The function to test for each entry.
     * @param {V} callback.value - The value of the current entry.
     * @param {string} callback.key - The key of the current entry.
     * @param {Database<V>} callback.Database - The database instance.
     * @returns {boolean} True if every entry satisfies the callback, false otherwise.
     */
    public every(callback: (value: V, key: string, Database: this) => boolean): boolean;

    /**
     * Retrieves the first entry in the database.
     * @returns {{key: string, value: V} | {}} The first key-value pair, or empty object if the database is empty.
     */
    public first(): { key: string; value: V; } | {};

    /**
     * Filters the database based on the provided callback.
     * @param {Function} callback - The function to test for each entry.
     * @param {V} callback.value - The value of the current entry.
     * @param {number} callback.index - The index of the current entry.
     * @param {string} callback.key - The key of the current entry.
     * @param {Database<V>} callback.Database - The database instance.
     * @returns {Database<V>} A new database instance with the filtered entries.
     */
    public filter(callback: (value: V, index: number, key: string, Database: this) => boolean): Database<V>;

    /**
     * Finds the first entry that satisfies the provided callback.
     * @param {Function} callback - The function to test for each entry.
     * @param {V} callback.value - The value of the current entry.
     * @param {number} callback.index - The index of the current entry.
     * @param {string} callback.key - The key of the current entry.
     * @param {Database<V>} callback.Database - The database instance.
     * @returns {{key: string, value: V, index: number} | undefined} The first entry that satisfies the callback, or undefined if none found.
     */
    public find(callback: (value: V, index: number, key: string, Database: this) => boolean): { key: string, value: V, index: number } | undefined;

    /**
     * Finds all entries that satisfy the provided callback.
     * @param {Function} callback - The function to test for each entry.
     * @param {V} callback.value - The value of the current entry.
     * @param {number} callback.index - The index of the current entry.
     * @param {string} callback.key - The key of the current entry.
     * @param {Database<V>} callback.Database - The database instance.
     * @returns {Array<{key: string, value: V, index: number}>} Array of matching entries.
     */
    public findAll(callback: (value: V, index: number, key: string, Database: this) => boolean): { key: string, value: V, index: number }[];

    /**
     * Gets multiple values by their keys.
     * @param {...string[]} keys - The keys to retrieve values for.
     * @returns {Array<V | undefined>} Array of values in same order as keys.
     */
    public getMany(...keys: string[]): (V | undefined)[];

    /**
     * Gets the value associated with the given key.
     * @param {string} key - The key of the entry to retrieve.
     * @returns {V | undefined} The value associated with the key, or undefined if not found.
     */
    public get(key: string): V | undefined;

    /**
     * Checks if an entry with the given key exists.
     * @param {string} key - The key to check.
     * @returns {boolean} True if the entry exists, false otherwise.
     */
    public has(key: string): boolean;

    /**
     * Checks if multiple keys exist in the database.
     * @param {...string[]} keys - The keys to check.
     * @returns {boolean} True if all keys exist, false otherwise.
     */
    public hasAll(...keys: string[]): boolean;

    /**
     * Checks if any of the given keys exist in the database.
     * @param {...string[]} keys - The keys to check.
     * @returns {boolean} True if at least one key exists, false otherwise.
     */
    public hasAny(...keys: string[]): boolean;

    /**
     * Returns the index of the given key.
     * @param {string} key - The key to find the index of.
     * @returns {number} The index of the key, or -1 if not found.
     */
    public indexOf(key: string): number;

    /**
     * Creates a new database with the intersection of entries from the current database and another database.
     * @param {Database<V>} other - The other database to intersect with.
     * @returns {Database<V>} A new database instance with the intersected entries.
     * @throws {Error} If other is not a Database instance.
     */
    public intersection(other: Database<V>): Database<V>;

    /**
     * Retrieves the key associated with the given value.
     * @param {V} value - The value to find the key for.
     * @returns {string | undefined} The key associated with the value, or undefined if not found.
     */
    public keyOf(value: V): string | undefined;

    /**
     * Retrieves all keys associated with the given value.
     * @param {V} value - The value to find keys for.
     * @returns {string[]} Array of keys associated with the value.
     */
    public keysOf(value: V): string[];

    /**
     * Retrieves the last entry in the database.
     * @returns {{key: string, value: V} | {}} The last key-value pair, or empty object if the database is empty.
     */
    public last(): { key: string; value: V; } | {};

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
    public math(key: string, operator: MathOperators, count?: number, negative?: boolean): number;

    /**
     * Creates a new database with entries that satisfy the provided callback.
     * @param {Function} callback - The function to test for each entry.
     * @param {V} callback.value - The value of the current entry.
     * @param {number} callback.index - The index of the current entry.
     * @param {string} callback.key - The key of the current entry.
     * @param {Database<V>} callback.Database - The database instance.
     * @returns {Database<V>} A new database instance with the mapped entries.
     */
    public map(callback: (value: V, index: number, key: string, Database: this) => boolean): Database<V>;

    /**
     * Merges another database into the current database.
     * @param {Database<V>} other - The other database to merge.
     * @returns {this} The current database instance.
     * @throws {Error} If other is not a Database instance.
     */
    public merge(other: Database<V>): this;

    /**
     * Partitions the database into two databases based on the provided callback.
     * @param {Function} callback - The function to test for each entry.
     * @param {V} callback.value - The value of the current entry.
     * @param {number} callback.index - The index of the current entry.
     * @param {string} callback.key - The key of the current entry.
     * @param {Database<V>} callback.Database - The database instance.
     * @returns {[Database<V>, Database<V>]} A tuple containing two new database instances: one with entries that satisfy the callback and one with entries that do not.
     */
    public partition(callback: (value: V, index: number, key: string, Database: this) => boolean): [Database<V>, Database<V>];

    /**
     * Pushes a value to an array at the specified key.
     * @param {string} key - The key of the entry.
     * @param {V} value - The value to push.
     * @returns {V[]} The updated array after the push operation.
     */
    public push(key: string, value: V): V[];

    /**
     * Pushes multiple values to an array at the specified key.
     * @param {string} key - The key of the entry.
     * @param {...V[]} values - The values to push.
     * @returns {V[]} The updated array after the push operations.
     */
    public pushMany(key: string, ...values: V[]): V[];

    /**
     * Pulls a value from an array at the specified key.
     * @param {string} key - The key of the entry.
     * @param {V} value - The value to pull.
     * @returns {V[] | undefined} The updated array after the pull operation, or undefined if the key does not exist or is not an array.
     */
    public pull(key: string, value: V): V[] | undefined;

    /**
     * Creates a new database with only the specified keys.
     * @param {...string[]} keys - The keys to pick.
     * @returns {Database<V>} A new database instance with the picked entries.
     * @throws {Error} If keys is not an array.
     */
    public pick(...keys: string[]): Database<V>;

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
    public reduce<R>(callback: (accumulator: R, value: V, index: number, key: string, Database: this) => R, initialValue: R): R;

    /**
     * Sets a key-value pair in the database.
     * @param {string} key - The key to set.
     * @param {V} value - The value to associate with the key.
     * @returns {V} The value that was set.
     */
    public set(key: string, value: V): V;

    /**
     * Sets multiple key-value pairs in the database.
     * @param {Record<string, V>} entries - Object containing key-value pairs to set.
     * @returns {this} The database instance.
     */
    public setMany(entries: Record<string, V>): this;

    /**
     * Creates a new database with a subset of entries based on the start and end indices.
     * @param {number} [start=0] - The starting index.
     * @param {number} [end=this.size] - The ending index.
     * @returns {Database<V>} A new database instance with the sliced entries.
     * @throws {Error} If start or end indices are invalid.
     */
    public slice(start?: number, end?: number): Database<V>;

    /**
     * Checks if some entries in the database satisfy the provided callback.
     * @param {Function} callback - The function to test for each entry.
     * @param {V} callback.value - The value of the current entry.
     * @param {number} callback.index - The index of the current entry.
     * @param {string} callback.key - The key of the current entry.
     * @param {Database<V>} callback.Database - The database instance.
     * @returns {boolean} True if at least one entry satisfies the callback, false otherwise.
     */
    public some(callback: (value: V, index: number, key: string, Database: this) => boolean): boolean;

    /**
     * Sorts the database entries based on the provided callback.
     * @param {Function} callback - The comparison function.
     * @param {V} callback.a - First value to compare.
     * @param {V} callback.b - Second value to compare.
     * @returns {Database<V>} A new sorted database instance.
     */
    public sort(callback: (a: V, b: V) => number): Database<V>;

    /**
     * Sweeps entries from the database based on the provided callback.
     * @param {Function} callback - The function to test for each entry.
     * @param {V} callback.value - The value of the current entry.
     * @param {string} callback.key - The key of the current entry.
     * @param {Database<V>} callback.Database - The database instance.
     * @returns {number} The number of entries removed.
     */
    public sweep(callback: (value: V, key: string, Database: this) => boolean): number;

    /**
     * Retrieves all keys and values as separate arrays.
     * @returns {{keys: string[], values: V[]}} An object containing the keys and values arrays.
     */
    public toArray(): { keys: string[], values: V[] };

    /**
     * Converts the cache to two Sets, one for keys and one for values.
     * @returns {[Set<string>, Set<V>]} A tuple containing two Sets: one for keys and one for values.
     */
    public toSet(): [Set<string>, Set<V>];

    /**
     * Retrieves all entries in the database as a JSON object.
     * @returns {Record<string, V>} A JSON object containing all entries.
     */
    public toJSON(): Record<string, V>;

    /**
     * Determines the type of the value associated with the specified key.
     * @param {string} key - The key of the entry to check.
     * @returns {string | undefined} The type of the value ('array' if the value is an array, or the result of the typeof operator).
     *          Returns undefined if the key does not exist.
     */
    public typeOf(key: string): string | undefined;

    /**
     * Updates an existing entry with new data.
     * @param {string} key - The key of the entry to update.
     * @param {Function} updater - Function that receives the old value and returns the new value.
     * @param {V} updater.oldValue - The current value associated with the key.
     * @returns {V | undefined} The updated value, or undefined if key doesn't exist.
     */
    public update(key: string, updater: (oldValue: V) => V): V | undefined;

    /**
     * Retrieves the value associated with the specified key.
     * Alternative to get() function. Only difference is this function uses find() function.
     * @param {string} key - The key of the entry to retrieve.
     * @returns {V | undefined} The value associated with the specified key, or undefined if the key is not found.
     */
    public valueOf(key: string): V | undefined;

    /**
     * Validates and checks the options for the database.
     * @param {DatabaseOptions<T>} [options] - The options to validate and check.
     * @returns {_DatabaseOptions<T>} The validated and checked options.
     * @template T The type of values stored in the database.
     */
    static checkOptions<T>(options?: DatabaseOptions<T>): _DatabaseOptions<T>;
  }

  /**
   * MemoryDriver is a class that manages an in-memory cache with support for various operations
   * such as setting, getting, deleting, and iterating over key-value pairs.
   * @template V The type of values stored in the cache.
   */
  export class MemoryDriver<V = any> {
    protected readonly _cache: Map<string, V>;
    protected readonly options: _MemoryDriverOptions;
    private _size: number;

    /**
     * Creates an instance of MemoryDriver.
     * @param {MemoryDriverOptions} [options={}] The options for the memory driver.
     */
    public constructor(options?: MemoryDriverOptions);

    protected read(): void;

    protected write(): void;

    public get cache(): Map<string, V>;

    [Symbol.iterator](): IterableIterator<[string, V]>;

    /**
     * Gets the number of entries in the cache.
     * @returns {number} The size of the cache.
     */
    public get size(): number;

    /**
     * Sets a value in the cache.
     * @param {string} key The key to set.
     * @param {V} value The value to set.
     * @returns {V} The set value.
     */
    public set(key: string, value: V): V;

    /**
     * Sets multiple key-value pairs at once.
     * @param {Array<[string, V]>} entries Array of key-value pairs
     * @returns {this} The driver instance
     */
    public setMany(entries: Array<[string, V]>): this;

    /**
     * Gets a value from the cache.
     * @param {string} key The key to get.
     * @returns {V | undefined} The value associated with the key, or undefined if the key does not exist.
     */
    public get(key: string): V | undefined;

    /**
     * Gets multiple values at once.
     * @param {string[]} keys Array of keys to get
     * @returns {Array<V | undefined>} Array of values
     */
    public getMany(keys: string[]): Array<V | undefined>;

    /**
     * Checks if a key exists in the cache.
     * @param {string} key The key to check.
     * @returns {boolean} True if the key exists, false otherwise.
     */
    public has(key: string): boolean;

    /**
     * Deletes a key from the cache.
     * @param {string} key The key to delete.
     * @returns {boolean} True if the key was deleted, false otherwise.
     */
    public del(key: string): boolean;

    /**
     * Deletes the database file associated with the driver if it exists.
     * This method only applies to subclasses of MemoryDriver and not to the MemoryDriver itself.
     *
     * @returns {boolean} True if the database file was successfully deleted, false otherwise.
     */
    public destroy(): boolean;

    /**
     * Clears all entries in the cache.
     */
    public clear(): void;

    /**
     * Converts the cache to a JSON object.
     * @returns {Record<string, V>} The JSON representation of the cache.
     */
    public toJSON(): Record<string, V>;

    /**
     * Converts the cache to an array of key-value pairs.
     * @returns {{ key: string, value: V }[]} The array representation of the cache.
     */
    public toArray(): { key: string, value: V }[];

    /**
     * Converts the cache to a Set of key-value pairs.
     * @returns A Set containing objects with key-value pairs.
     */
    public toSet(): Set<{ key: string, value: V }>;

    /**
     * Executes a callback for each entry in the cache.
     * @param {(value: V, key: string, Driver: this) => void} callback The callback to execute.
     */
    public each(callback: (value: V, key: string, Driver: this) => void): void;

    /**
     * Creates a new MemoryDriver instance containing only the entries that satisfy the provided callback function.
     *
     * @param {(value: V, key: string, driver: this) => boolean} callback - The function to test each entry.
     * It is called with three arguments: the value of the entry, the key of the entry, and the MemoryDriver instance itself.
     *
     * @returns {MemoryDriver<V>} A new MemoryDriver instance with entries that pass the test implemented by the callback.
     */
    public map(callback: (value: V, key: string, Driver: this) => boolean): MemoryDriver<V>;

    /**
     * Validates and sets default values for the provided options.
     * @param {MemoryDriverOptions} [o={}] The options to validate.
     * @returns {MemoryDriverOptions} The validated and defaulted options.
     */
    static checkOptions(o?: MemoryDriverOptions): _MemoryDriverOptions;
  }

  /**
   * BsonDriver is a class that extends MemoryDriver to provide support for reading and writing
   * BSON data using a specialized engine.
   * @template V The type of the values stored in the driver.
   */
  export class BsonDriver<V = any> extends MemoryDriver<V> {
    /**
     * Creates an instance of BsonDriver.
     * @param options The options for configuring the BSON driver.
     */
    constructor(options?: MemoryDriverOptions);

    /**
     * Reads data from the BSON file and populates the cache.
     * Uses lodash to traverse and set nested properties.
     */
    protected read(): void;

    /**
     * Writes current cache contents to the BSON file.
     * @returns The number of bytes written.
     */
    protected write(): number;
  }

  /**
   * JsonDriver is a class that extends MemoryDriver to add support for reading and writing
   * JSON data to a file using the Bun engine.
   * @template V The type of the values stored in the cache.
   */
  export class JsonDriver<V = any> extends MemoryDriver<V> {
    public readonly options: _JsonDriverOptions;

    /**
     * Creates an instance of JsonDriver.
     * @param {JsonDriverOptions} [options={}] The options for the JSON driver.
     */
    constructor(options?: JsonDriverOptions);

    /**
     * Reads the JSON data from the file and populates the cache.
     * @protected
     */
    protected read(): void;

    /**
     * Writes the current cache to the JSON file.
     * @returns {number} The number of bytes written to the file.
     * @protected
     */
    protected write(): number;
  }

  /**
   * YamlDriver is a class that extends MemoryDriver to add support for reading and writing
   * YAML data to a file using the Bun engine.
   * @template V The type of the values stored in the cache.
   */
  export class YamlDriver<V = any> extends MemoryDriver<V> {
    public readonly options: _MemoryDriverOptions;

    /**
     * Creates an instance of YamlDriver.
     * @param {MemoryDriverOptions} [options={}] The options for the YAML driver.
     */
    constructor(options?: MemoryDriverOptions);

    /**
     * Reads data from the YAML file and populates the cache.
     * Uses lodash to traverse and set nested properties.
     * @protected
     */
    protected read(): void;

    /**
     * Writes current cache contents to the YAML file.
     * @returns {number} The number of bytes written.
     * @protected
     */
    protected write(): number;
  }

  import Shapeshift from '@sapphire/shapeshift';

/**
 * A utility class providing static validation methods and schemas for common data types.
 * Built on top of the @sapphire/shapeshift validation library.
 */
export class Validator {
  /**
   * Base validation schema for string values
   * @example
   * Validator.StringValidation.parse('hello') // Returns 'hello'
   * Validator.StringValidation.parse(123) // Throws ValidationError
   */
  static StringValidation = s.string();

  /**
   * Base validation schema for numeric values
   * @example
   * Validator.NumberValidation.parse(123) // Returns 123
   * Validator.NumberValidation.parse('123') // Throws ValidationError
   */
  static NumberValidation = s.number();

  /**
   * Base validation schema for null or undefined values
   * @example
   * Validator.NullishValidation.parse(null) // Returns null
   * Validator.NullishValidation.parse(undefined) // Returns undefined
   * Validator.NullishValidation.parse(0) // Throws ValidationError
   */
  static NullishValidation = s.nullish();

  /**
   * Base validation schema that accepts any value
   * @example
   * Validator.AnyValidation.parse('anything') // Returns 'anything'
   * Validator.AnyValidation.parse(null) // Returns null
   */
  static AnyValidation = s.any();

  /**
   * Base validation schema for object values
   * @example
   * Validator.ObjectValidation.parse({}) // Returns {}
   * Validator.ObjectValidation.parse('not an object') // Throws ValidationError
   */
  static ObjectValidation = s.object({});

  /**
   * Base validation schema for URL instances
   * @example
   * Validator.URLValidation.parse(new URL('https://example.com')) // Returns URL instance
   * Validator.URLValidation.parse('https://example.com') // Throws ValidationError
   */
  static URLValidation = s.instance(URL);

  /**
   * Base validation schema for Function instances
   * @example
   * Validator.FunctionValidation.parse(() => {}) // Returns function
   * Validator.FunctionValidation.parse({}) // Throws ValidationError
   */
  static FunctionValidation = s.instance(Function);

  /**
   * Base validation schema for boolean values
   * @example
   * Validator.BooleanValidation.parse(true) // Returns true
   * Validator.BooleanValidation.parse(1) // Throws ValidationError
   */
  static BooleanValidation = s.boolean();

  /**
   * Creates a validation schema that only accepts specific string literal values
   * @param values - The allowed string values
   * @returns A union validator that only accepts the specified string values
   * @throws {Error} If no values are provided
   * @example
   * const colorValidator = Validator.stringInput('red', 'blue', 'green')
   * colorValidator.parse('red') // Returns 'red'
   * colorValidator.parse('yellow') // Throws ValidationError
   */
  static stringInput(...values: string[]): ReturnType<typeof s.union>;

  /**
   * Generic validation method that applies a schema to a value
   * @template T The expected type of the validated value
   * @param schema - The validation schema to apply
   * @param value - The value to validate
   * @returns The validated value cast to type T
   * @throws {ValidationError} If validation fails
   */
  static validate<T>(schema: BaseValidator<T>, value: any): T;

  /**
   * Validates boolean values with optional exact matching
   * @param value - The value to validate
   * @param options - Optional validation configuration
   * @param options.exact - If provided, requires the value to exactly match true or false
   * @returns The validated boolean value
   * @throws {ValidationError} If validation fails
   * @example
   * Validator.boolean(true) // Returns true
   * Validator.boolean(1) // Throws ValidationError
   * Validator.boolean(true, { exact: false }) // Throws ValidationError
   */
  static boolean(value: any, options?: { exact?: boolean }): boolean;

  /**
   * Validates string values with optional length constraints
   * @param value - The value to validate
   * @param options - Optional validation configuration
   * @param options.minLength - Minimum required string length
   * @param options.maxLength - Maximum allowed string length
   * @returns The validated string value
   * @throws {ValidationError} If validation fails
   * @example
   * Validator.string('test') // Returns 'test'
   * Validator.string('abc', { minLength: 5 }) // Throws ValidationError
   * Validator.string('toolong', { maxLength: 5 }) // Throws ValidationError
   */
  static string(value: any, options?: { minLength?: number; maxLength?: number }): string;

  /**
   * Validates numeric values with optional range and integer constraints
   * @param value - The value to validate
   * @param options - Optional validation configuration
   * @param options.min - Minimum allowed value
   * @param options.max - Maximum allowed value
   * @param options.integer - If true, requires the value to be an integer
   * @returns The validated number value
   * @throws {ValidationError} If validation fails
   * @example
   * Validator.number(123) // Returns 123
   * Validator.number(5, { min: 10 }) // Throws ValidationError
   * Validator.number(3.14, { integer: true }) // Throws ValidationError
   */
  static number(value: any, options?: { min?: number; max?: number; integer?: boolean }): number;

  /**
   * Validates object values with optional schema validation
   * @template T The expected type of the validated object
   * @param value - The value to validate
   * @param schema - Optional object schema for validating properties
   * @returns The validated object cast to type T
   * @throws {ValidationError} If validation fails
   * @example
   * Validator.object({ name: 'test' }) // Returns { name: 'test' }
   * Validator.object({ age: '25' }, { age: Validator.NumberValidation }) // Throws ValidationError
   */
  static object<T extends Record<string, any>>(value: any, schema?: Record<string, BaseValidator<any>>): T;

  /**
   * Validates array values with optional type and length constraints
   * @template T The expected type of array elements
   * @param value - The value to validate
   * @param options - Optional validation configuration
   * @param options.itemValidation - Validation schema for array elements
   * @param options.minLength - Minimum required array length
   * @param options.maxLength - Maximum allowed array length
   * @returns The validated array of type T[]
   * @throws {ValidationError} If validation fails
   * @example
   * Validator.array([1, 2, 3]) // Returns [1, 2, 3]
   * Validator.array([1, '2'], { itemValidation: Validator.NumberValidation }) // Throws ValidationError
   */
  static array<T>(value: any, options?: { itemValidation?: BaseValidator<T>; minLength?: number; maxLength?: number }): T[];

  /**
   * Validates values against an enum type
   * @template T The enum type to validate against
   * @param enumObj - The enum object containing valid values
   * @param value - The value to validate
   * @returns The validated enum value
   * @throws {Error} If the enum object is empty
   * @throws {ValidationError} If validation fails
   * @example
   * enum Color { Red = 'red', Blue = 'blue' }
   * Validator.enum(Color, 'red') // Returns 'red'
   * Validator.enum(Color, 'yellow') // Throws ValidationError
   */
  static enum<T extends Record<string, string | number>>(enumObj: T, value: any): T[keyof T];

  /**
   * Validates that a value is an instance of a specific class
   * @template T The expected instance type
   * @param constructor - The class constructor to check against
   * @param value - The value to validate
   * @returns The validated instance of type T
   * @throws {ValidationError} If validation fails
   * @example
   * class User {}
   * Validator.instance(User, new User()) // Returns User instance
   * Validator.instance(User, {}) // Throws ValidationError
   */
  static instance<T>(constructor: new (...args: any[]) => T, value: any): T;

  /**
   * Validates function values with optional arity constraints
   * @param value - The value to validate
   * @param options - Optional validation configuration
   * @param options.arity - The exact number of parameters the function should accept
   * @returns The validated function
   * @throws {ValidationError} If validation fails or arity doesn't match
   * @example
   * Validator.function((a, b) => a + b) // Returns the function
   * Validator.function((a) => a, { arity: 2 }) // Throws Error
   */
  static function(value: any, options?: { arity?: number }): Function;
}

  export {
    Database,

    JsonDriver, YamlDriver, BsonDriver, MemoryDriver,

    Validator
  }

  export default Database;
}