import MemoryDriver from './MemoryDriver';

import { readFileSync, writeFileSync } from 'graceful-fs';
import { get } from '../utils/Lodash';

let BSON: typeof import('bson');
try {
  BSON = require('bson');
} catch { }

export default class BsonDriver<V = any> extends MemoryDriver<V> {
  public constructor(options: MemoryDriverOptions = {}) {
    super({ ...options, type: 'bson' });

    if (!BSON) throw new ReferenceError('\'bson\' module is not installed.');
  }

  /**
   * Reads data from the BSON file and populates the cache.
   * Uses lodash to traverse and set nested properties.
   * @protected
   */
  protected read(): void {
    const data = BSON.deserialize(Buffer.from(readFileSync(this.options.path, { encoding: 'binary' })));

    for (const key in data) this.cache.set(key, get(data, key));
  }

  /**
   * Writes current cache contents to the BSON file.
   * @protected
   */
  protected write(): void {
    writeFileSync(this.options.path, Buffer.from(BSON.serialize(this.json())), { encoding: 'binary' });
  }
}