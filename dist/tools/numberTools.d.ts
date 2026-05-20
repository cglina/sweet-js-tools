/**
 * **Rounds a number toward zero** using floor logic.
 *
 * Useful when you want **consistent rounding regardless of sign**, so that:
 * - for positive numbers → `Math.floor(nr)`
 * - for negative numbers → `Math.ceil(nr)`
 *
 * Returns `0` for non-finite values (`NaN`, `Infinity`, `-Infinity`)
 * to ensure a usable numeric result.
 *
 * @example
 * Math.floor(5.3) → 5
 * absValueFloor(5.3) → 5
 *
 * Math.floor(-2.1) → -3
 * absValueFloor(-2.1) → -2
 *
 * absValueFloor(NaN) → 0
 * absValueFloor(Infinity) → 0
 */
export declare function absValueFloor(nr?: number): number;
/**
 * **Rounds a number away from zero** using ceil logic.
 *
 * Useful when you want **consistent rounding regardless of sign**, so that:
 * - positive numbers → `Math.ceil(nr)`
 * - negative numbers → `Math.floor(nr)`
 *
 * Returns `0` for non-finite values (`NaN`, `Infinity`, `-Infinity`)
 * to ensure a usable numeric result.
 *
 * @example
 * Math.ceil(5.3) → 6
 * absValueCeil(5.3) → 6
 *
 * Math.ceil(-2.1) → -2
 * absValueCeil(-2.1) → -3
 *
 * absValueCeil(NaN) → 0
 * absValueCeil(Infinity) → 0
 */
export declare function absValueCeil(nr?: number): number;
/**
 * Returns a random whole number between 1 and upperLimit.
 *
 * The upper limit is included in the range.
 * Negative upper limits return negative values.
 *
 * Returns `0` for non-finite values or limits smaller than 1.
 *
 * @example
 * randomNr(5) → 1, 2, 3, 4, or 5
 *
 * @example
 * randomNr(-5) → -1, -2, -3, -4, or -5
 *
 * randomNr(0) → 0
 * randomNr(NaN) → 0
 */
export declare function randomNr(upperLimit?: number): number;
/**
 * Returns a random whole number starting at 0, up to (but not including) upperLimit.
 *
 * Negative upper limits return negative values (mirrored from 0).
 *
 * Returns `0` for non-finite values or when the limit resolves to 0.
 *
 * @example
 * randomNr0(5) → 0, 1, 2, 3, or 4
 * randomNr0(-5) → 0, -1, -2, -3, or -4
 *
 * randomNr0(0) → 0
 * randomNr0(NaN) → 0
 */
export declare function randomNr0(upperLimit?: number): number;
/**
 * Returns a random whole number between two values.
 *
 * Both the lowest and highest values are included.
 *
 * Values are rounded toward zero using Sweet number rules.
 *
 * Returns `0` if either value is non-finite.
 *
 * @example
 * randomInRange(2, 5) → 2, 3, 4, or 5
 * randomInRange(-2, 3) → -2, -1, 0, 1, 2, or 3
 * randomInRange(2.9, 5.1) → 2, 3, 4, or 5
 * randomInRange(NaN, 5) → 0
 */
export declare function randomInRange(firstNr?: number, secondNr?: number): number;
/**
 * Returns a random whole number between two values.
 *
 * The lowest value is included, but the highest value is excluded.
 *
 * Values are rounded toward zero using Sweet number rules.
 *
 * Invalid inputs default to `0` individually.
 * If both values resolve to the same number, that value is returned.
 *
 * @example
 * randomUpTo(2, 5) → 2, 3, or 4
 * randomUpTo(5, 2) → 2, 3, or 4
 * randomUpTo(NaN, 5) → 0, 1, 2, 3, or 4
 * randomUpTo(3, NaN) → 0, 1, or 2
 * randomUpTo(4, 4) → 4
 */
export declare function randomUpTo(firstNr?: number, secondNr?: number): number;
/**
 * Returns a random whole number strictly between two values.
 *
 * Neither the lowest nor highest value is included.
 *
 * Values are rounded toward zero using Sweet number rules.
 * Invalid inputs default to `0` individually.
 *
 * If there is no valid whole number between the values, the lowest value is returned.
 *
 * @example
 * randomBetween(2, 6) → 3, 4, or 5
 * randomBetween(6, 2) → 3, 4, or 5
 * randomBetween(-2, 3) → -1, 0, 1, or 2
 * randomBetween(2, 3) → 2
 * randomBetween(NaN, 5) → 1, 2, 3, or 4
 */
export declare function randomBetween(firstNr?: number, secondNr?: number): number;
/**
 * Rounds a number **down toward zero** to a set number of decimal places.
 *
 * Uses Sweet rounding rules:
 * - positive → floor
 * - negative → ceil
 *
 * Returns `0` for non-finite values.
 * Invalid `decimalPlaces` defaults to `2`.
 *
 * @example
 * floorDecimal(5.369124, 2) → 5.36
 * floorDecimal(-5.369124, 2) → -5.36
 */
export declare function floorDecimal(nr?: number, decimalPlaces?: number): number;
/**
 * Rounds a number **up away from zero** to a set number of decimal places.
 *
 * Uses Sweet rounding rules:
 * - positive → ceil
 * - negative → floor
 *
 * Returns `0` for non-finite values.
 * Invalid `decimalPlaces` defaults to `2`.
 *
 * @example
 * ceilDecimal(5.363124, 2) → 5.37
 * ceilDecimal(-5.363124, 2) → -5.37
 */
export declare function ceilDecimal(nr?: number, decimalPlaces?: number): number;
/**
 * A 'safer' alternative to JS's .toFixed().
 *
 * Rounds a number to a set number of decimal places.
 *
 * Uses standard rounding:
 * - values at 5 round up
 *
 * Returns `0` for non-finite values.
 * Invalid `decimalPlaces` defaults to `2`.
 *
 * @example
 * roundDecimal(5.367, 2) → 5.37
 * roundDecimal(1.005, 2) → 1.01
 */
export declare function roundDecimal(nr?: number, decimalPlaces?: number): number;
/**
 * Returns true if the number is an odd integer.
 */
export declare function isOdd(nr?: number): boolean;
/**
 * Returns true if the number is an even integer.
 */
export declare function isEven(nr?: number): boolean;
/**
 * Returns:
 * - `0` if the number is even
 * - `1` if the number is odd
 *
 * Returns `0` for non-integer or non-finite values.
 *
 * *Useful for simple toggles or indexing.*
 */
export declare function evenOdd(nr?: number): 0 | 1;
/**
 * Keeps a number within a set range.
 *
 * If the number is lower than the minimum, the minimum is returned.
 * If the number is higher than the maximum, the maximum is returned.
 *
 * Invalid inputs default to `0` individually.
 *
 * @example
 * clamp(5, 0, 10) → 5
 * clamp(12, 0, 10) → 10
 * clamp(-3, 0, 10) → 0
 * clamp(NaN, 0, 10) → 0
 * clamp(5, NaN, 10) → 5 (range becomes 0–10)
 */
export declare function clamp(nr?: number, min?: number, max?: number): number;
/**
 * Returns the positive whole-number factors of a number.
 *
 * Values are rounded toward zero using Sweet number rules.
 * Negative numbers are treated by absolute value.
 *
 * Returns an empty array for non-finite values or `0`.
 *
 * @example
 * findFactors(12) → [1, 2, 3, 4, 6, 12]
 * findFactors(-12) → [1, 2, 3, 4, 6, 12]
 * findFactors(12.8) → [1, 2, 3, 4, 6, 12]
 * findFactors(0) → []
 */
export declare function findFactors(nr?: number): number[];
/**
 * Returns the lowest shared factor greater than `1`.
 *
 * Values are rounded toward zero using Sweet number rules.
 * Negative numbers are treated by absolute value.
 *
 * Returns:
 * - `0` if either value is non-finite or resolves to `0`
 * - `1` if there is no shared factor greater than `1`
 *
 * @example
 * findLowestCommonFactor(6, 10) → 2
 * findLowestCommonFactor(9, 15) → 3
 * findLowestCommonFactor(7, 11) → 1
 */
export declare function findLowestCommonFactor(nr1?: number, nr2?: number): number;
