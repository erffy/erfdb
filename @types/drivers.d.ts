type DriverTypes = string | 'json' | 'bson' | 'yaml' | 'memory';

interface MemoryDriverOptions {
  /**
   * Driver path.
   * @default {process.cwd}/erx.db.{type}
   */
  path?: URL;

  /**
   * Driver type.
   */
  type?: DriverTypes;

  /**
   * Driver size.
   * @default Infinity
   */
  size?: number;
}

interface _MemoryDriverOptions extends MemoryDriverOptions {
  path: URL;
  type: DriverTypes;
  size: number;
}

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