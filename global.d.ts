/// <reference path="./@types">

declare module 'erf.db' {
  /**
   * A class representing a key-value database.
   * @template V The type of values stored in the database.
   */
  class Database<V = any> {
    protected readonly options: _DatabaseOptions<V>;

    /**
     * Creates an instance of Database.
     * @param options The options for configuring the database.
     */
    constructor(options: DatabaseOptions<V>);

    /**
     * Iterator for the database entries.
     */
    [Symbol.iterator](): Iterator<[string, V]>;

    /**
     * Gets the number of entries in the database.
     */
    public get size(): number;

    /**
     * Retrieves all entries in the database.
     * @param amount The number of entries to retrieve.
     * @returns An array of key-value pairs.
     */
    public all(amount?: number): { key: string, value: V }[];

    /**
     * Retrieves the keys and values as separate arrays.
     * @returns An object containing keys and values arrays.
     */
    public array(): { keys: string[], values: V[] };

    /**
     * Retrieves a value or key based on a pattern.
     * @param pattern The pattern specifying whether to retrieve a key or value.
     * @returns The key or value, or undefined if not found.
     */
    public at(pattern: string): string | V | undefined;

    /**
     * Creates a clone of the database.
     * @returns A new instance of the Database with the same entries.
     */
    public clone(): Database<V>;

    /**
     * Concatenates multiple databases into one.
     * @param databases The databases to concatenate.
     * @returns A new instance of the Database with concatenated entries.
     */
    public concat(...databases: Database<V>[]): Database<V>;

    /**
     * Deletes an entry by key.
     * @param key The key of the entry to delete.
     * @returns True if the entry was deleted, false otherwise.
     */
    public del(key: string): boolean;

    /**
     * Iterates over each entry in the database.
     * @param callback The function to execute for each entry.
     * @returns The database instance.
     */
    public each(callback: (value: V, index: number, key: string, Database: this) => void): this;

    /**
     * Checks if all entries pass the provided test.
     * @param callback The function to test each entry.
     * @returns True if all entries pass the test, false otherwise.
     */
    public every(callback: (value: V, key: string, Database: this) => boolean): boolean;

    /**
     * Filters the entries based on a test function.
     * @param callback The function to test each entry.
     * @returns A new instance of the Database with filtered entries.
     */
    public filter(callback: (value: V, index: number, key: string, Database: this) => boolean): Database<V>;

    /**
     * Finds an entry based on a test function.
     * @param callback The function to test each entry.
     * @returns The key-value pair of the found entry, or undefined if not found.
     */
    public find(callback: (value: V, index: number, key: string, Database: this) => boolean): { key: string, value: V } | undefined;

    /**
     * Retrieves a value by key.
     * @param key The key of the value to retrieve.
     * @returns The value associated with the key, or undefined if not found.
     */
    public get(key: string): V | undefined;

    /**
     * Checks if an entry exists by key.
     * @param key The key to check.
     * @returns True if the entry exists, false otherwise.
     */
    public has(key: string): boolean;

    /**
     * Creates a new database with entries that exist in both databases.
     * @param other The other database to intersect with.
     * @returns A new instance of the Database with intersected entries.
     */
    public intersection(other: Database<V>): Database<V>;

    /**
     * Retrieves all entries as a JSON object.
     * @returns A JSON object representing the database entries.
     */
    public json(): Record<string, V>;

    /**
     * Finds the key of an entry by value.
     * @param value The value to find the key for.
     * @returns The key of the entry, or undefined if not found.
     */
    public keyOf(value: V): string | undefined;

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
    public math(key: string, operator: MathOperators, count: number = 1, negative: boolean = false): number;

    /**
     * Maps entries to a new database based on a callback function.
     * @param callback The function to execute for each entry.
     * @returns A new instance of the Database with mapped entries.
     */
    public map(callback: (value: V, index: number, key: string, Database: this) => boolean): Database<V>;

    /**
     * Merges another database into this one.
     * @param other The other database to merge.
     * @returns The database instance.
     */
    public merge(other: Database<V>): this;

    /**
     * Partitions the entries into two databases based on a test function.
     * @param callback The function to test each entry.
     * @returns An array containing two new instances of the Database.
     */
    public partition(callback: (value: V, index: number, key: string, Database: this) => boolean): [Database<V>, Database<V>];

    /**
     * Picks specific entries by keys.
     * @param keys The keys of the entries to pick.
     * @returns A new instance of the Database with picked entries.
     */
    public pick(...keys: string[]): Database<V>;

    /**
     * Plucks values of a specific key from all entries.
     * @param keyName The key of the values to pluck.
     * @returns An array of plucked values.
     */
    public pluck<T>(keyName: string): T[];

    /**
     * Reduces the entries to a single value based on a callback function.
     * @param callback The function to execute for each entry.
     * @param initialValue The initial value for the reduction.
     * @returns The reduced value.
     */
    public reduce<R>(callback: (accumulator: R, value: V, index: number, key: string, Database: this) => R, initialValue: R): R;

    /**
     * Sets a value for a key in the database.
     * @param key The key to set.
     * @param value The value to set.
     * @returns The set value.
     */
    public set(key: string, value: V): V;

    /**
     * Slices entries from the database.
     * @param start The starting index.
     * @param end The ending index.
     * @returns A new instance of the Database with sliced entries.
     */
    public slice(start?: number, end?: number): Database<V>;

    /**
     * Checks if some entries pass the provided test.
     * @param callback The function to test each entry.
     * @returns True if some entries pass the test, false otherwise.
     */
    public some(callback: (value: V, index: number, key: string, Database: this) => boolean): boolean;

    /**
     * Removes entries that pass the provided test.
     * @param callback The function to test each entry.
     * @returns The number of removed entries.
     */
    public sweep(callback: (value: V, key: string, Database: this) => boolean): number;

    /**
     * Retrieves the value associated with the specified key.
     * 
     * Alternative to get() function. Only difference is this function uses find() function.
     * @param key - The key of the entry to retrieve.
     * @returns The value associated with the specified key, or undefined if the key is not found.
     */
    public valueOf(key: string): V | undefined;

    /**
     * Checks the options for the database.
     * @param options The options to check.
     * @returns The checked options.
     */
    static checkOptions<T>(options?: DatabaseOptions<T>): _DatabaseOptions<T>;
  }

  /**
   * MemoryDriver is a class that manages an in-memory cache with support for various operations
   * such as setting, getting, deleting, and iterating over key-value pairs.
   * @template V The type of the values stored in the cache.
   */
  class MemoryDriver<V = any> {
    protected readonly _cache: Map<string, V>;
    protected readonly file!: import('bun').BunFile;
    protected readonly writer!: import('bun').FileSink;
    public readonly options: _MemoryDriverOptions;

    /**
     * Creates an instance of MemoryDriver.
     * @param {MemoryDriverOptions} [options={}] The options for the memory driver.
     */
    constructor(options?: MemoryDriverOptions);

    /**
     * Gets the in-memory cache.
     * @returns The in-memory cache.
     */
    public get cache(): typeof this._cache;

    /**
     * Iterator for the driver entries.
     */
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
     * Gets a value from the cache.
     * @param {string} key The key to get.
     * @returns {V | undefined} The value associated with the key, or undefined if the key does not exist.
     */
    public get(key: string): V | undefined;

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
     * Clears all entries in the cache.
     */
    public clear(): void;

    /**
     * Converts the cache to a JSON object.
     * @returns {Record<string, V>} The JSON representation of the cache.
     */
    public json(): Record<string, V>;

    /**
     * Converts the cache to an array of key-value pairs.
     * @returns {{ key: string, value: V }[]} The array representation of the cache.
     */
    public array(): { key: string, value: V }[];

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
     * @returns {_MemoryDriverOptions} The validated and defaulted options.
     */
    static checkOptions(o?: MemoryDriverOptions): _MemoryDriverOptions;
  }

  /**
   * BsonDriver is a class that extends MemoryDriver to provide support for reading and writing
   * BSON data using a specialized engine.
   * @template V The type of the values stored in the driver.
   */
  class BsonDriver<V = any> extends MemoryDriver<V> {
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
  class JsonDriver<V = any> extends MemoryDriver<V> {
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
  class YamlDriver<V = any> extends MemoryDriver<V> {
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
   * Utility class for validating various data types using Sapphire's validation schemas.
   */
  class Validator {
    /**
     * Validation schema for strings.
     */
    static readonly StringValidation: Shapeshift.StringValidator<string>;

    /**
     * Validation schema for integers.
     */
    static readonly NumberValidation: Shapeshift.NumberValidator<number>;

    /**
     * Validation schema for nullish values (null or undefined).
     */
    static readonly NullishValidation: Shapeshift.NullishValidator;

    /**
     * Validation schema for any type of value.
     */
    static readonly AnyValidation: Shapeshift.PassthroughValidator<any>;

    /**
     * Validation schema for objects.
     */
    static readonly ObjectValidation: <T extends object>(shape: Shapeshift.MappedObjectValidator<T>, options?: Shapeshift.ValidatorOptions) => Shapeshift.ObjectValidator<T, Shapeshift.UndefinedToOptional<T>>;

    /**
     * Validation schema for URLs.
     */
    static readonly URLValidation: Shapeshift.InstanceValidator<URL>;

    /**
     * Validation schema for functions.
     */
    static readonly FunctionValidation: Shapeshift.InstanceValidator<Function>;

    /**
     * Validation schema for input against a list of string literals.
     */
    static readonly StringInputValidation: Shapeshift.UnionValidator<any> = (...values: any[]) => any;

    /**
     * Validation schema for instances.
     */
    static readonly InstanceValidation: <T>(expected: Shapeshift.Constructor<T>, options?: Shapeshift.ValidatorOptions) => Shapeshift.InstanceValidator<T>;

    /**
     * Validates a string.
     * @param value The input to validate.
     * @returns The validated string.
     */
    static string(value: any): any;

    /**
     * Validates a number.
     * @param value The input to validate.
     * @returns The validated number.
     */
    static number(value: any): any;

    /**
     * Validates nullish values (null or undefined).
     * @param value The input to validate.
     * @returns The validated nullish value.
     */
    static nullish(value: any): any;

    /**
     * Validates any type of value.
     * @param value The input to validate.
     * @returns The validated value.
     */
    static any(value: any): any;

    /**
     * Validates an object.
     * @param value The input to validate.
     * @returns The validated object.
     */
    static object(value: any): any;

    /**
     * Validates a URL instance.
     * @param value The input to validate.
     * @returns The validated URL instance.
     */
    static url(value: any): any;

    /**
     * Validates a function instance.
     * @param value The input to validate.
     * @returns The validated function instance.
     */
    static function(value: any): any;

    /**
     * Validates input against a list of string literals.
     * @param value The input to validate.
     * @returns The validated input against the list of string literals.
     */
    static stringInput(...value: any[]): any;

    /**
     * Validates an instance against a given class or constructor.
     * @param i The class or constructor function.
     * @param value The instance to validate.
     * @returns The validated instance.
     */
    static instance(i: any, value: any): any;
  }

  export {
    Database,

    JsonDriver, YamlDriver, BsonDriver, MemoryDriver,

    Validator
  }

  export default Database;
}