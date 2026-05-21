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
export function absValueFloor(nr: number = 0): number {
    if (!Number.isFinite(nr)) return 0

    return nr < 0
        ? Math.ceil(nr)
        : Math.floor(nr)
}

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
export function absValueCeil(nr: number = 0): number {
    if (!Number.isFinite(nr)) return 0

    return nr < 0
        ? Math.floor(nr)
        : Math.ceil(nr)
}

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
export function randomNr(upperLimit: number = 5): number {
    if (!Number.isFinite(upperLimit)) return 0

    const limit = absValueFloor(upperLimit)

    if (limit < 1) return 0

    const nr = Math.floor(Math.random() * limit) + 1

    return upperLimit < 0 ? -nr : nr
}

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
export function randomNr0(upperLimit: number = 10): number {
    if (!Number.isFinite(upperLimit)) return 0

    const limit = absValueFloor(upperLimit)

    if (limit === 0) return 0

    const nr = Math.floor(Math.random() * limit)

    if (upperLimit >= 0) return nr
    return nr === 0 ? 0 : -nr
}

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
export function randomInRange(firstNr: number = 2, secondNr: number = 8): number {
    if (!Number.isFinite(firstNr) || !Number.isFinite(secondNr)) return 0

    const a = absValueFloor(firstNr)
    const b = absValueFloor(secondNr)

    const lowNr = Math.min(a, b)
    const highNr = Math.max(a, b)

    if (lowNr === highNr) return lowNr

    const diff = highNr - lowNr + 1
    const random = Math.floor(Math.random() * diff)

    return lowNr + random
}

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
export function randomUpTo(firstNr: number = 2, secondNr: number = 8): number {
    const a = Number.isFinite(firstNr) ? absValueFloor(firstNr) : 0
    const b = Number.isFinite(secondNr) ? absValueFloor(secondNr) : 0

    const lowNr = Math.min(a, b)
    const highNr = Math.max(a, b)

    if (lowNr === highNr) return lowNr

    const diff = highNr - lowNr
    const random = Math.floor(Math.random() * diff)

    return lowNr + random
}

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
export function randomBetween(firstNr: number = 2, secondNr: number = 8): number {
    const a = Number.isFinite(firstNr) ? absValueFloor(firstNr) : 0
    const b = Number.isFinite(secondNr) ? absValueFloor(secondNr) : 0

    const lowNr = Math.min(a, b)
    const highNr = Math.max(a, b)

    const diff = highNr - lowNr - 1

    if (diff < 1) return lowNr

    const random = Math.floor(Math.random() * diff)

    return lowNr + 1 + random
}

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
export function floorDecimal(nr: number = 1, decimalPlaces: number = 2): number {
    if (!Number.isFinite(nr)) return 0

    const places = Number.isFinite(decimalPlaces)
        ? Math.min(14, Math.abs(Math.floor(decimalPlaces)))
        : 2

    const factor = Math.pow(10, places)

    return absValueFloor(nr * factor) / factor
}

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
export function ceilDecimal(nr: number = 1, decimalPlaces: number = 2): number {
    if (!Number.isFinite(nr)) return 0

    const places = Number.isFinite(decimalPlaces)
        ? Math.min(14, Math.abs(Math.floor(decimalPlaces)))
        : 2

    const factor = Math.pow(10, places)

    return absValueCeil(nr * factor) / factor
}

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
export function roundDecimal(nr: number = 1, decimalPlaces: number = 2): number {
    if (!Number.isFinite(nr)) return 0

    const places = Number.isFinite(decimalPlaces)
        ? Math.min(14, Math.abs(Math.floor(decimalPlaces)))
        : 2

    const factor = Math.pow(10, places)

    return Math.round((nr + Number.EPSILON) * factor) / factor
}

/**
 * Returns true if the number is an odd integer.
 */
export function isOdd(nr: number = 2): boolean {
    if (!Number.isFinite(nr) || !Number.isInteger(nr)) return false
    return Math.abs(nr % 2) === 1
}

/**
 * Returns true if the number is an even integer.
 */
export function isEven(nr: number = 2): boolean {
    if (!Number.isFinite(nr) || !Number.isInteger(nr)) return false
    return nr % 2 === 0
}

/**
 * Returns:
 * - `0` if the number is even
 * - `1` if the number is odd
 * 
 * Returns `0` for non-integer or non-finite values.
 * 
 * *Useful for simple toggles or indexing.*
 */
export function evenOdd(nr: number = 2): 0 | 1 {
    return isOdd(nr) ? 1 : 0
}


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
export function clamp(nr: number = 0, min: number = 0, max: number = 1): number {
    const value = Number.isFinite(nr) ? nr : 0
    const a = Number.isFinite(min) ? min : 0
    const b = Number.isFinite(max) ? max : 0

    const low = Math.min(a, b)
    const high = Math.max(a, b)

    if (value < low) return low
    if (value > high) return high
    return value
}

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
export function findFactors(nr: number = 1): number[] {
    if (!Number.isFinite(nr)) return []

    const value = Math.abs(absValueFloor(nr))
    if (value === 0) return []

    const smallFactors: number[] = []
    const largeFactors: number[] = []

    for (let i = 1; i <= Math.sqrt(value); i++) {
        if (value % i === 0) {
            smallFactors.push(i)

            const pair = value / i
            if (pair !== i) {
                largeFactors.unshift(pair)
            }
        }
    }

    return [...smallFactors, ...largeFactors]
}

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
export function findLowestCommonFactor(nr1: number = 2, nr2: number = 4): number {
    if (!Number.isFinite(nr1) || !Number.isFinite(nr2)) return 0

    const value1 = Math.abs(absValueFloor(nr1))
    const value2 = Math.abs(absValueFloor(nr2))

    if (value1 === 0 || value2 === 0) return 0

    if (isEven(value1) && isEven(value2)) return 2

    const factors1 = findFactors(value1)
    const factors2 = new Set(findFactors(value2))

    for (const factor of factors1) {
        if (factor > 1 && factors2.has(factor)) {
            return factor
        }
    }

    return 1
}
