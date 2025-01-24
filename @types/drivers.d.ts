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