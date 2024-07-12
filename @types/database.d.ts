type Drivers<V> = import('../drivers/MemoryDriver').default<V> | 
               import('../drivers/JsonDriver').default<V> |
               import('../drivers/BsonDriver').default<V> | 
               import('../drivers/YamlDriver').default<V>;

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