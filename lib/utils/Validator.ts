import { s } from '@sapphire/shapeshift';

/**
 * Utility class for validating various data types
 */
export default class Validator {
  /**
   * Validation schema for strings.
   */
  static StringValidation = s.string();

  /**
   * Validation schema for integers.
   */
  static NumberValidation = s.number();

  /**
   * Validation schema for nullish values (null or undefined).
   */
  static NullishValidation = s.nullish();

  /**
   * Validation schema for any type of value.
   */
  static AnyValidation = s.any();

  /**
   * Validation schema for objects.
   */
  static ObjectValidation = s.object;

  /**
   * Validation schema for URLs.
   */
  static URLValidation = s.instance(URL);

  /**
   * Validation schema for functions.
   */
  static FunctionValidation = s.instance(Function);

  /**
   * Validation schema for input against a list of string literals.
   */
  static StringInputValidation = (...values: any[]) => s.union(values.map((value) => s.literal(value)));

  /**
   * Validation schema for instances.
   */
  static InstanceValidation = s.instance;

  /**
   * Validates a string.
   * @param {any} value - The input to validate.
   * @returns {any} The validated string.
   */
  static string(value: any): any {
    return this.StringValidation.parse(value);
  }

  /**
   * Validates a number.
   * @param {any} i - The input to validate.
   * @returns {any} The validated number.
   */
  static number(value: any): any {
    return this.NumberValidation.int().parse(value);
  }

  /**
   * Validates nullish values (null or undefined).
   * @param {any} i - The input to validate.
   * @returns {any} The validated nullish value.
   */
  static nullish(value: any): any {
    return this.NullishValidation.parse(value);
  }

  /**
   * Validates any type of value.
   * @param {any} i - The input to validate.
   * @returns {any} The validated value.
   */
  static any(value: any): any {
    return this.AnyValidation.parse(value);
  }

  /**
   * Validates an object.
   * @param {any} i - The input to validate.
   * @returns {any} The validated object.
   */
  static object(value: any): any {
    return this.ObjectValidation(value);
  }

  /**
   * Validates a URL instance.
   * @param {any} i - The input to validate.
   * @returns {any} The validated URL instance.
   */
  static url(value: any): any {
    return this.URLValidation.parse(value);
  }

  /**
   * Validates a function instance.
   * @param {any} i - The input to validate.
   * @returns {any} The validated function instance.
   */
  static function(value: any): any {
    return this.FunctionValidation.parse(value);
  }

  /**
   * Validates input against a list of string literals.
   * @param {...any[]} i - The input to validate.
   * @returns {any} The validated input against the list of string literals.
   */
  static stringInput(...value: any[]): any {
    return this.StringInputValidation(value);
  }

  /**
   * Validates an instance against a given class or constructor.
   * @param i The class or constructor function.
   * @param value The instance to validate.
   * @returns The validated instance.
   */
  static instance(i: any, value: any): any {
    return this.InstanceValidation(i).parse(value);
  }
}