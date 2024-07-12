import MemoryDriver from './MemoryDriver';

import { readFileSync, writeFileSync } from 'graceful-fs';
import { get } from '../utils/Lodash';

let YAML: typeof import('yaml');
try {
  YAML = require('yaml');
} catch {
  throw new ReferenceError('\'yaml\' module is not installed.');
}

export default class YamlDriver<V = any> extends MemoryDriver<V> {
  /**
   * Creates an instance of YamlDriver.
   * @param {MemoryDriverOptions} [options={}] The options for the YAML driver.
   */
  public constructor(options: MemoryDriverOptions = {}) {
    super({ ...options, type: 'yaml' });
  }

  /**
   * Reads data from the YAML file and populates the cache.
   * Uses lodash to traverse and set nested properties.
   * @protected
   */
  protected read(): void {
    const data = YAML.parse(readFileSync(this.options.path, { encoding: 'utf-8' }));

    for (const key in data) this.cache.set(key, get(data, key));
  }

  /**
   * Writes current cache contents to the YAML file.
   * @protected
   */
  protected write(): void {
    writeFileSync(this.options.path, Buffer.from(YAML.stringify(this.json())), { encoding: 'utf-8' });
  }
}