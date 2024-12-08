import { s } from '@sapphire/shapeshift';

export default class Validator {
  /**
   * Validation schema for strings
   */
  static StringValidation = s.string();

  /**
   * Validation schema for numbers
   */
  static NumberValidation = s.number();

  /**
   * Validation schema for nullish values (null or undefined)
   */
  static NullishValidation = s.nullish();

  /**
   * Validation schema for any type of value
   */
  static AnyValidation = s.any();

  /**
   * Validation schema for objects
   */
  static ObjectValidation = s.object({});

  /**
   * Validation schema for URL instances
   */
  static URLValidation = s.instance(URL);

  /**
   * Validation schema for function instances
   */
  static FunctionValidation = s.instance(Function);

  /**
   * Validation schema for boolean values
   */
  static BooleanValidation = s.boolean();

  /**
   * Creates a validation schema for a specific set of string literals
   */
  static stringInput(...values: string[]): ReturnType<typeof s['union']> {
    if (values.length === 0) {
      throw new Error('At least one value must be provided for stringInput.');
    }
    return s.union(values.map((value) => s.literal(value)));
  }

  /**
   * Generic validation method for parsing and validating values against a schema
   */
  static validate<T>(schema: ReturnType<typeof s[keyof typeof s]>, value: any): T {
    // @ts-ignore
    return schema.parse(value);
  }

  static boolean(value: any, options?: { exact?: boolean }): boolean {
    let validation = this.BooleanValidation;

    if (options?.exact !== undefined) validation = s.literal(options.exact);

    return this.validate(validation, value);
  }

  /**
   * Validates a string with optional length constraints
   */
  static string(value: any, options?: { minLength?: number; maxLength?: number }): string {
    let validation = this.StringValidation;

    if (options?.minLength !== undefined) validation = validation.lengthGreaterThanOrEqual(options.minLength);
    if (options?.maxLength !== undefined) validation = validation.lengthLessThanOrEqual(options.maxLength);

    return this.validate(validation, value);
  }

  /**
   * Validates a number with optional range and integer constraints
   */
  static number(value: any, options?: { min?: number; max?: number; integer?: boolean }): number {
    let validation = this.NumberValidation;

    if (options?.min !== undefined) validation = validation.greaterThanOrEqual(options.min);
    if (options?.max !== undefined) validation = validation.lessThanOrEqual(options.max);
    if (options?.integer === true) validation = validation.int();

    return this.validate(validation, value);
  }

  /**
   * Validates an object with optional schema validation
   */
  static object<T extends Record<string, any>>(value: any, schema?: Record<string, ReturnType<typeof s[keyof typeof s]>>): T {
    let validation = this.ObjectValidation;

    if (schema) validation = s.object(schema);

    return this.validate(validation, value);
  }

  /**
   * Validates an array with optional type and length constraints
   */
  static array<T>(value: any, options?: { itemValidation?: ReturnType<typeof s[keyof typeof s]>; minLength?: number; maxLength?: number }): T[] {
    let validation = s.array(options?.itemValidation ?? s.any());

    if (options?.minLength !== undefined) validation = validation.lengthGreaterThanOrEqual(options.minLength);
    if (options?.maxLength !== undefined) validation = validation.lengthLessThanOrEqual(options.maxLength);

    return this.validate(validation, value);
  }

  /**
   * Validates a value against an enum type
   */
  static enum<T extends Record<string, string | number>>(enumObj: T, value: any): T[keyof T] {
    const literals = Object.values(enumObj).map((v) => s.literal(v));
    if (!literals.length) throw new Error('The enum object must have at least one value.');

    return this.validate(s.union(literals), value);
  }

  /**
   * Validates an instance of a specific class or constructor
   */
  static instance<T>(constructor: new (...args: any[]) => T, value: any): T {
    return this.validate(s.instance(constructor), value);
  }

  /**
   * Validates a function with optional arity constraints
   * @param value - The value to validate
   * @param options - Optional configuration for function validation
   * @param options.arity - The exact number of expected arguments for the function
   * @returns The validated function
   * @throws {ValidationError} If validation fails
   */
  static function(value: any, options?: { arity?: number }): Function {
    const func = this.validate(this.FunctionValidation, value);
    // @ts-ignore
    if (options?.arity !== undefined && func.length !== options.arity) throw new Error(`Expected function to have ${options.arity} arguments, but got ${func.length}.`);
    // @ts-ignore
    return func;
  }
}