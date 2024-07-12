type Drivers<V> = import('../lib/drivers/MemoryDriver').default<V> | 
                  import('../lib/drivers/JsonDriver').default<V> |
                  import('../lib/drivers/BsonDriver').default<V> | 
                  import('../lib/drivers/YamlDriver').default<V>;

type MathOperators = '+' | '-' | '*' | '**' | '%' | '/';

interface _DatabaseOptions<V = any> extends _MemoryDriverOptions, _JsonDriverOptions {
  driver: Drivers<V>;
}

interface DatabaseOptions<V> extends MemoryDriverOptions, JsonDriverOptions {
  /**
   * Database driver.
   * @default MemoryDriver
   */
  driver?: Drivers<V>;
}