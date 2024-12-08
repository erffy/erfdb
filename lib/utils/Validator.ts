import { s, BaseValidator } from '@sapphire/shapeshift';

/**
 * A utility class providing static validation methods and schemas for common data types.
 * Built on top of the @sapphire/shapeshift validation library.
 */
export default class Validator {
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
  static stringInput(...values: string[]): ReturnType<typeof s.union> {
    if (values.length === 0) {
      throw new Error('At least one value must be provided for stringInput.');
    }
    return s.union(values.map((value) => s.literal(value)));
  }

  /**
   * Generic validation method that applies a schema to a value
   * @template T The expected type of the validated value
   * @param schema - The validation schema to apply
   * @param value - The value to validate
   * @returns The validated value cast to type T
   * @throws {ValidationError} If validation fails
   */
  static validate<T>(schema: BaseValidator<T>, value: any): T {
    return schema.parse(value);
  }

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
  static boolean(value: any, options?: { exact?: boolean }): boolean {
    let validation: BaseValidator<boolean>;

    if (options?.exact !== undefined) {
      validation = s.literal(options.exact);
    } else {
      validation = this.BooleanValidation;
    }

    return this.validate(validation, value);
  }

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
  static string(value: any, options?: { minLength?: number; maxLength?: number }): string {
    let validation = this.StringValidation;

    if (options?.minLength !== undefined) validation = validation.lengthGreaterThanOrEqual(options.minLength);
    if (options?.maxLength !== undefined) validation = validation.lengthLessThanOrEqual(options.maxLength);

    return this.validate(validation, value);
  }

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
  static number(value: any, options?: { min?: number; max?: number; integer?: boolean }): number {
    let validation = this.NumberValidation;

    if (options?.min !== undefined) validation = validation.greaterThanOrEqual(options.min);
    if (options?.max !== undefined) validation = validation.lessThanOrEqual(options.max);
    if (options?.integer === true) validation = validation.int();

    return this.validate(validation, value);
  }

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
  static object<T extends Record<string, any>>(value: any, schema?: Record<string, BaseValidator<any>>): T {
    let validation = schema ? s.object(schema) : this.ObjectValidation;
    return this.validate(validation, value) as T;
  }

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
  static array<T>(value: any, options?: { itemValidation?: BaseValidator<T>; minLength?: number; maxLength?: number }): T[] {
    let validation = s.array(options?.itemValidation ?? this.AnyValidation);

    if (options?.minLength !== undefined) validation = validation.lengthGreaterThanOrEqual(options.minLength);
    if (options?.maxLength !== undefined) validation = validation.lengthLessThanOrEqual(options.maxLength);

    return this.validate(validation, value);
  }

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
  static enum<T extends Record<string, string | number>>(enumObj: T, value: any): T[keyof T] {
    const literals = Object.values(enumObj).map((v) => s.literal(v as T[keyof T]));
    if (!literals.length) throw new Error('The enum object must have at least one value.');

    return this.validate(s.union(literals), value) as T[keyof T];
  }

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
  static instance<T>(constructor: new (...args: any[]) => T, value: any): T {
    return this.validate(s.instance(constructor), value);
  }

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
  static function(value: any, options?: { arity?: number }): Function {
    const func = this.validate(this.FunctionValidation, value) as Function;
    if (options?.arity !== undefined && func.length !== options.arity) throw new Error(`Expected function to have ${options.arity} arguments, but got ${func.length}.`);
    return func;
  }
}