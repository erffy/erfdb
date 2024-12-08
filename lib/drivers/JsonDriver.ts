import Validator from '../utils/Validator';
import MemoryDriver from './MemoryDriver';

import { readFileSync, writeFileSync } from 'graceful-fs';
import { get } from '../utils/Lodash';

/**
 * JsonDriver is a class that extends MemoryDriver to add support for reading and writing
 * JSON data to a file using the Bun engine.
 * @template V The type of the values stored in the cache.
 */
export default class JsonDriver<V = any> extends MemoryDriver<V> {
  public declare readonly options: _JsonDriverOptions;

  /**
   * Creates an instance of JsonDriver.
   * @param {JsonDriverOptions} [options={}] The options for the JSON driver.
   */
  public constructor(options: JsonDriverOptions = {}) {
    options.spaces ??= 2;

    Validator.number(options.spaces);

    super({ ...options, type: 'json' });
  }

  /**
   * Reads the JSON data from the file and populates the cache.
   * @protected
   */
  protected read(): void {
    const data = JSON.parse(readFileSync(this.options.path, { encoding: 'utf-8' }));

    for (const key in data) this.cache.set(key, get(data, key) as V);
  }

  /**
   * Writes the current cache to the JSON file.
   * @protected
   */
  protected write(): void {
    const buffer = Buffer.from(JSON.stringify(this.toJSON(), null, this.options.spaces));

    writeFileSync(this.options.path, buffer, { encoding: 'utf-8' });
  }
}