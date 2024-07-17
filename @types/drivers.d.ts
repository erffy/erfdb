/**
 * Available driver types
 * @enum DriverTypes
 */
type DriverTypes = 'bson' | 'json' | 'memory' | 'yaml' | 'custom' | 'auto';

/**
 * Options for MemoryDriver.
 * @interface MemoryDriverOptions
 */
interface MemoryDriverOptions {
  /**
   * Driver path.
   * @default {process.cwd}/erx.db.{type}
   */
  path?: URL;

  /**
   * Driver type.
   * @default DriverTypes.Auto
   */
  type?: DriverTypes;

  /**
   * Driver size.
   * @default Infinity
   */
  size?: number;

  /**
   * Enable debugging.
   * @default false
   */
  debugger?: boolean;
}

interface _MemoryDriverOptions extends MemoryDriverOptions {
  path: URL;
  type: DriverTypes;
  size: number;
  debugger: boolean;
}

/**
 * Options for JsonDriver.
 * @interface JsonDriverOptions
 * @extends MemoryDriverOptions
 */
interface JsonDriverOptions extends MemoryDriverOptions {
  /**
   * Indent spaces in driver file.
   * @default 2
   */
  spaces?: number;
}

interface _JsonDriverOptions extends _MemoryDriverOptions {
  spaces: number;
}

/**
 * Interface representing driver events with generic type T.
 */
interface DriverEvents<T> {
  /**
   * Triggered when data changes.
   * 
   * @param fn - The function name or identifier.
   * @param args - An array containing a string and a value of type T.
   */
  changed(args: [string, T]): void;

  /**
   * Triggered when data is fetched.
   * 
   * @param key - The key of the fetched data.
   * @param data - The fetched data, which can be undefined.
   */
  fetch(key: string, data: T | undefined): void;

  /**
   * Triggered when data is checked.
   * 
   * @param key - The key of the checked data.
   * @param data - The result of the check as a boolean.
   */
  checked(key: string, data: boolean): void;

  /**
   * Triggered when data is deleted.
   * 
   * @param key - The key of the deleted data.
   * @param data - The result of the deletion as a boolean.
   * @param content - The content of the deleted data.
   */
  deleted(key: string, data: boolean, content: T): void;

  /**
   * Triggered when a file is destroyed.
   * 
   * @param path - The URL path of the destroyed file.
   * @param status - The status of the destruction as a boolean.
   */
  destroyed(path: URL, status: boolean): void;

  /**
   * Triggered when the cache is cleared.
   */
  cleared(): void;

  /**
   * Triggered during an iteration process.
   * 
   * @param fn - The function name or identifier, either 'json' or 'array'.
   * @param data - The data being iterated, either as a record of key-value pairs or an array of key-value pairs.
   */
  iteration(fn: 'json' | 'array', data: Record<string, T> | { key: string; value: T }[]): void;
}