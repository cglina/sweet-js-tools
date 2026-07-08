/// STELLA OK!

import { absValueFloor, randomNr0 } from "./numberTools.js";
import { sweetXCheck, type SweetXLabel } from "../basicTypes.js";

/**
 * Creates a number sequence from a positive or negative number.
 *
 * The first parameter `nr` defines the length of the array, ie:
 * - Both `nr: 5` and `nr: -5` create an array with length = 5.
 * 
 * Decimal values are floored (by absolute value) before building the array, ie:
 * - Both `nr: -3.8` and `nr: 3.8` create an array with length = 3 (always rounds down)
 * 
 * 
 * The second paramater `base` controls if the sequence is 1-based or 0-based (defaults to 1).
 * The array returns **numbers in ascending order**.
 * - if `nr: 3` and `base: 0` → [0, 1, 2]
 * - if `nr: 3` and `base: 1` → [1, 2, 3]
 * - if `nr: -3` and `base: 0` → [-2, -1, 0]
 * - if `nr: -3` and `base: 1` → [-3, -2, -1]
 *
 * @example
 * arrayFromNr(5) → [1, 2, 3, 4, 5]
 * arrayFromNr(5, 0) → [0, 1, 2, 3, 4]
 * arrayFromNr(3.5) → [1, 2, 3]
 * arrayFromNr(-5, 0) → [-4, -3, -2, -1, 0]
 * arrayFromNr(-5.8) → [-5, -4, -3, -2, -1]
 * arrayFromNr(0) → []
 * arrayFromNr(NaN) → []
 */
export function arrayFromNr(nr: number = 10, base: 0 | 1 = 1): number[] {
    if (!Number.isFinite(nr) || nr === 0) return []

    const floored = absValueFloor(nr)
    const length = Math.abs(floored)

    const start =
        nr > 0
            ? base
            : base === 1
                ? floored
                : floored + 1

    return Array.from({ length }, (_, i) => start + i)
}

/**
 * Creates a 0-based number sequence from a positive or negative number.
 *
 * Positive numbers count upward from `0`.
 * Negative numbers count downward from `0`.
 *
 * Decimal values are floored by absolute value before building the array.
 *
 * @example
 * zeroToNumber(5) → [0, 1, 2, 3, 4]
 * zeroToNumber(3.5) → [0, 1, 2]
 * zeroToNumber(-5) → [0, -1, -2, -3, -4]
 * zeroToNumber(-3.7) → [0, -1, -2]
 * zeroToNumber(0) → []
 * zeroToNumber(NaN) → []
 */

export function zeroToNumber(nr: number = 10): number[] {
    if (!Number.isFinite(nr) || nr === 0) return []
    if (nr > 0) return arrayFromNr(nr, 0)
    return arrayFromNr(nr, 0).reverse()
}

///////////// OBJ & PROP FILTERING

/**
 * Maps a property from each item in an array and skips falsy results.
 * 
 * **Important:** 
 * - The returned array **may be shorter** than the original.
 * - Returns an array of the available **property values**, _not_ a filtered object array.
 * 
 * @example
 * const items = [{ name: "A" }, { name: "" }, { name: "B" }]
 * propMapCull(items, "name") → ["A", "B"]
 */
export function propMapCull(array: any[] = [], prop: string = 'length'): any[] {
    return array.flatMap(item => item[`${prop}`] ? item[`${prop}`] : [])

}


/**
 * Maps a property from each item in an array.
 * 
 * If the property value is falsy, `elseVal` is returned instead (`elseVal` defaults to `false`)
 * 
 * @example
 * propMap([{ name: "A" }, { name: "" }], "name", false) → ["A", false]
 */
export function propMap(array: any[] = [], prop: string = 'length', elseVal: any = false): any[] {
    return array.map(item => item[`${prop}`] ? item[`${prop}`] : elseVal)

}



///////////// SORTING
/**
 * Sorts an array of numbers from low to high.
 * 
 * Returns an empty array if the array is empty.
 * 
 * @example
 * sortNumbers([4, 1, 7, 2]) → [1, 2, 4, 7]
 */
export function sortNumbers(numArray?: number[]): number[] {
    if (!numArray || numArray.length === 0) {
        return []
    }
    return [...numArray].sort((a, b) => a - b)
}


/**
 * Tests if an `item` is an array; if not, returns an array `[item]`.
 * 
 * 
 * @example
 * toArray('1, 2, 3') → ['1, 2, 3']
 * toArray([1, 2, 3]) → [1, 2, 3]
 */
export function toArray(item: any | any[]): any[] {
    return Array.isArray(item) ? item : [item]
}

/**
 * Returns the last item in an array.
 *
 * Returns `undefined` if the array is empty.
 *
 * @example
 * arrayLast([1, 2, 3]) → 3
 * arrayLast(["a"]) → "a"
 * arrayLast([]) → undefined
 */
export function arrayLast<T>(array: T[]): T | undefined {
    return array.slice(-1)[0]
}

/**
 * Returns a random item from an array.
 *
 * - Returns `undefined` if the array is empty
 * - Returns the only item if the array has one element
 *
 * @example
 * randomArrayItem([10, 20, 30]) → either 10 or 20 or 30
 * randomArrayItem(["a"]) → "a"
 * randomArrayItem([]) → undefined
 */
export function randomArrayItem<T>(array: T[]): T | undefined {
    if (array.length <= 1) {
        return array[0]
    }

    const randomNr = randomNr0(array.length - 1)
    return array[randomNr]
}

/**
 * Removes duplicate values from an array.
 *
 * Keeps only the first occurrence of each value.
 * Returns the original array if it has 0 or 1 items.
 *
 * @example
 * removeDuplicates([1, 2, 2, 3]) → [1, 2, 3]
 * removeDuplicates(["a", "a", "b"]) → ["a", "b"]
 * removeDuplicates([1, "a", 1, "a"]) → [1, "a"]
 */
export function removeDuplicates<T>(array: T[]): T[] {
    if (array.length <= 1) {
        return array
    }

    return Array.from(new Set(array))
}

/**
 * Splits an array into smaller parts of a given length.
 *
 * Returns an empty array if `partLength` is 0 or lower.
 *
 * Returns the original array if:
 * - the array is shorter than or equal to `partLength`
 * - `partLength` is 1
 *
 * @example
 * arrayParts([1, 2, 3, 4, 5], 2) → [[1, 2], [3, 4], [5]]
 * arrayParts([1, 2], 5) → [1, 2]
 * arrayParts([1, 2], 0) → []
 */
export function arrayParts<T>(array: T[], partLength: number = 2): T[] | T[][] {
    if (partLength <= 0) return []
    if (array.length <= partLength || partLength === 1) {
        return array
    }

    return zeroToNumber(Math.ceil(array.length / partLength))
        .map(page => array.slice(page * partLength, page * partLength + partLength))
}

/**
 * Returns start and end index pairs for slicing an array into parts.
 * 
 * Each pair represents a slice: [start, end]
 * 
 * @example
 * paginationSlices([1, 2, 3, 4, 5], 3) → [[0, 3], [3, 5]]
 * paginationSlices([1, 2], 5) → [[0, 2]]
 * paginationSlices([1, 2, 3], 1) → [[0, 1], [1, 2], [2, 3]]
 */
export function paginationSlices(array: any[], partLength: number = 3): number[][] {
    if (!Array.isArray(array) || partLength <= 0 || array.length === 0) {
        return []
    }
    const totalPages = Math.ceil(array.length / partLength)

    return zeroToNumber(totalPages).map(page => {
        const start = page * partLength
        const end = Math.min(start + partLength, array.length)
        return [start, end]
    })
}



///////////// TYPE FILTERING & REPLACING

/**
 * Returns only the items that match a given TypeTools type.
 * 
 * Returns an empty array if the array is empty.
 * 
 * @example
 * includeType([1, "hello", 0, ""], "string") → ["hello"]
 * includeType([1, "hello", 0, ""], "numberX") → [0]
 */
export function includeType<T>(arr: T[] = [], typeFilter: SweetXLabel = 'string'): T[] {
    if (arr.length === 0) return []
    return arr.filter(item => sweetXCheck(item, typeFilter))
}

/**
 * Returns only the items that do not match a given TypeTools type.
 * 
 * Returns an empty array if the array is empty.
 * 
 * @example
 * excludeType([1, "hello", 0, ""], "stringX") → [1, 0, "hello"]
 */
export function excludeType<T>(arr: T[] = [], typeFilter: SweetXLabel = 'string'): T[] {
    if (arr.length === 0) return []
    return arr.filter(item => !sweetXCheck(item, typeFilter))
}

/**
 * Returns each item if it matches a given TypeTools type.
 * 
 * If an item does not match, it is replaced with `falseDefault`.
 * Returns an empty array if the array is empty.
 * 
 * @example
 * typeOrDefault([1, "hello", 0], "number", false) → [1, false, false]
 * typeOrDefault([3, "lala"], "string", 0) → [0, "lala"]
 */
export function typeOrDefault<T, D = false>(
    arr: T[] = [],
    typeFilter: SweetXLabel = 'string',
    falseDefault: D = false as D
): (T | D)[] {
    if (arr.length === 0) return []
    return arr.map(item => sweetXCheck(item, typeFilter) ? item : falseDefault)
}

/**
 * Returns an array of booleans indicating whether each item matches a given TypeTools type.
 * 
 * Returns an empty array if the array is empty.
 * 
 * @example
 * typeMatchMap([1, "hello", 0], "number") → [true, false, false]
 * typeMatchMap([1, "hello", 0], "numberX") → [false, false, true]
 */
export function typeMatchMap<T>(arr: T[] = [], typeFilter: SweetXLabel = 'string'): boolean[] {
    if (arr.length === 0) return []
    return arr.map(item => sweetXCheck(item, typeFilter))
}