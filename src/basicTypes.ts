import type { BaseObject } from "./tools/objectTools.js";
/*
 * SWEET TYPE SYSTEM OVERVIEW:
 *
 * BaseTypes      → raw categories (string, number, object, etc.)
 * PrecisionTypes → refined checks (array, actualObj, numeric, true/false)
 * XTypes         → usable values (non-empty, non-zero, etc.)
 *
 * sweetTypeCheck → unified entry point
 */


/**
 * Standard base type names supported by Sweet Types.
 *
 * - These mostly follow JavaScript `typeof` behavior
 * - However, Sweet Types may apply small practical adjustments
 *   (e.g. excluding `NaN` from valid `number` checks)
 *
 * Notes:
 * - `object` includes arrays (JavaScript behavior)
 * - `null` is separated because `typeof null === "object"`
 */

export type BaseTypes = 'string' | 'object' | 'number' | 'symbol' | 'boolean' | 'function' | 'bigint' | 'undefined' | 'null'

/**
 * More specific Sweet type names used to narrow common JavaScript edge cases.
 *
 * Includes:
 * - `array` — value is an array
 * - `actualObj` — value is a non-null object and not an array
 * - `true` — value is exactly `true`
 * - `false` — value is exactly `false`
 * - `numeric` — value is a number or numeric string
 */
export type PrecisionTypes = 'array' | 'actualObj' | 'true' | 'false' | 'numeric'

/**
 * Strict/non-empty Sweet type names.
 *
 * `X` means the value passes a stronger usefulness check:
 *
 * - `stringX` — string with length > 0
 * - `arrayX` — array with length > 0
 * - `objectX` — actual object with at least one key-value pair
 * - `numberX` — valid number that is not `0` (or `NaN`)
 * - `symbolX` - symbol with description, ie: Symbol() returns false
 */
export type XTypes = 'stringX' | 'objectX' | 'arrayX' | 'numberX' | 'symbolX'

/**
 * Runtime list of supported base type names.
 */
const baseTypeArray: BaseTypes[] = ['string', 'object', 'number', 'boolean', 'bigint', 'undefined', 'null']

/**
 * Runtime list of supported precision type names.
 */
const precisionTypeArray: PrecisionTypes[] = ['array', 'actualObj', 'true', 'false', 'numeric']

/**
 * Runtime list of supported strict/non-empty `X` type names.
 */
const xTypeArray: XTypes[] = ['stringX', 'objectX', 'numberX', 'arrayX', 'symbolX']

/**
 * Core Sweet type names used by the library.
 * 
 * Includes both standard JS base types and foundational Sweet semantic types.
 */
export type SweetBaseTypes = BaseTypes | PrecisionTypes | XTypes

export type SweetTypeList = SweetBaseTypes[]




//////////// BASE TYPE CHECKS:

/**
 * Returns true if the value is a string.
 * 
 * @example
 * isString("hello")
 *  
 * // true
 */
export function isString(item: any): item is string {
    return typeof item === "string"
}

/**
 * Returns true if the value is a boolean.
 * 
 * @example
 * isBoolean(true)
 *  
 * // true
 */
export function isBoolean(item: any): item is boolean {
    return typeof item === 'boolean'
}



/**
 * Returns true if the value is a non-null object.
 * 
 * Arrays also return true.
 * 
 * @example
 * isObject({ a: 1 })
 *  
 * // true
 * 
 * isObject([1, 2])
 *  
 * // true
 */
export function isObject(item: any): item is object {
    return typeof item === "object" && item !== null
}

/**
 * Returns `true` if the value is a valid number.
 *
 * Unlike JavaScript's raw `typeof` behavior, this returns `false` for `NaN`
 * because `NaN` is not useful as a usable number value.
 *
 * @example
 * isNumber(12)
 *  
 * // true
 * 
 * isNumber(0)
 *  
 * // true
 * 
 * isNumber(NaN)
 *  
 * // false
 */
export function isNumber(item: any): item is number {
    return typeof item === 'number' && !isNaN(item)
}

/**
 * Returns true if the value is a bigint.
 * 
 * @example
 * isBigInt(10n)
 *  
 * // true
 */
export function isBigInt(item: any): item is bigint {
    return typeof item === 'bigint'
}

/**
 * Returns true if the value is `undefined`.
 * 
 * @example
 * isUndefined(undefined)
 *  
 * // true
 */
export function isUndefined(item: any): item is undefined {
    return typeof item === 'undefined'
}

/**
 * Returns `true` if the value is exactly `null`.
 *
 * Useful because JavaScript treats `null` as an object:
 * `typeof null === "object"`.
 *
 * @example
 * isNull(null)
 *  
 * // true
 * 
 * isNull(undefined)
 *  
 * // false
 * 
 * isNull({})  
 *  
 * // false
 */
export function isNull(item: any): item is null {
    return item === null
}

///////////// PRECISION TYPE CHECKS

/**
 * Returns `true` if the value is an object but not an array.
 *
 * An `actualObj` means:
 * - the value is a non-null object
 * - and it is not an array
 *
 * @example
 * isActualObj({ a: 1 })  
 * // true
 * isActualObj([1, 2])  
 * // false
 * isActualObj(null)  
 * // false
 */
export function isActualObj(item: any): item is Record<string, any> {
    return typeof item === 'object' && item !== null && !Array.isArray(item)
}

/**
 * Returns `true` if the value is an array.
 *
 * @example
 * isArray([1, 2])  
 * // true
 * 
 * isArray("hello")  
 * // false
 */
export function isArray(item: any): item is any[] {
    return Array.isArray(item)
}

/**
 * Returns `true` if the value is a function.
 *
 * Includes:
 * - standard functions
 * - arrow functions
 * - async functions
 * - class constructors
 * - generator functions
 *
 * Uses JavaScript's native:
 * `typeof item === "function"`
 *
 * @example
 * isFunction(function hello() {})
 * // true
 *
 * @example
 * isFunction(() => {})
 * // true
 *
 * @example
 * isFunction(async () => {})
 * // true
 *
 * @example
 * isFunction(class Test {})
 * // true
 *
 * @example
 * isFunction("hello")
 * // false
 *
 * @example
 * isFunction({})
 * // false
 */
export function isFunction(item: any): item is Function {
    return typeof item === 'function'
}


/**
 * Returns `true` if the value is numeric.
 *
 * A `numeric` value means:
 * - a valid number (not `NaN`)
 * - or a string that can be converted to a valid number
 *
 * Includes:
 * - integers, floats, scientific notation (`"1e3"`)
 * - strings with surrounding whitespace
 *
 * Excludes:
 * - empty strings or whitespace-only strings
 * - non-numeric strings
 *
 * @example
 * isNumeric(12)  
 * // true
 * 
 * isNumeric("12")  
 * // true
 * 
 * isNumeric("  12  ")  
 * // true
 * 
 * isNumeric("1e3")  
 * // true
 * 
 * isNumeric("lala")  
 * // false
 * 
 * isNumeric("")  
 * // false
 */
export function isNumeric(item: any): item is string | number {
    if (typeof item === "number") {
        return !isNaN(item)
    }

    if (typeof item === "string") {
        const trimmed = item.trim()
        if (trimmed === "") return false
        return !isNaN(Number(trimmed))
    }

    return false
}

/**
 * Returns `true` if the value is exactly `true`.
 *
 * @example
 * isTrue(true)  
 * // true
 * 
 * isTrue(false)  
 * // false
 */
export function isTrue(item: any): item is true {
    return item === true
}


/**
 * Returns `true` if the value is exactly `false`.
 *
 * @example
 * isFalse(false)  
 * // true
 * 
 * isFalse(true)  
 * // false
 */
export function isFalse(item: any): item is false {
    return item === false
}

////////////// X TYPE CHECKS

/**
 * Returns `true` if the value is a non-empty usable string.
 *
 * A `stringX` means:
 * - the value is a string
 * - and it contains at least one non-whitespace character
 *
 * @example
 * isStringX("hello")  
 * // true
 * 
 * isStringX(" ")  
 * // false
 * 
 * isStringX("")  
 * // false
 */
export function isStringX(item: any): item is string {
    return typeof item === 'string' && item.trim().length > 0
}


/**
 * Returns `true` if the value is a symbol with a description.
 *
 * A `symbolX` means:
 * - the value is a symbol
 * - and it has an explicit description
 *
 * This makes the symbol easier to identify/debug than an anonymous `Symbol()`.
 *
 * Notes:
 * - `Symbol("id")` returns `true`
 * - `Symbol("")` also returns `true`, because the description was explicitly provided
 * - `Symbol()` returns `false`
 *
 * @example
 * isSymbolX(Symbol("userId"))  
 * // true
 * 
 * isSymbolX(Symbol(""))  
 * // true
 * 
 * isSymbolX(Symbol())  
 * // false
 * 
 * isSymbolX("symbol")  
 * // false
 */
export function isSymbolX(item: any): item is symbol {
    return (
        typeof item === 'symbol' &&
        item.description !== undefined
    )
}


/**
 * Returns `true` if the value is a non-empty actual object.
 *
 * An `objectX` means:
 * - the value is a non-null object
 * - it is not an array
 * - and it has at least one own enumerable key
 *
 * @example
 * isObjectX({ a: 1 })  
 * // true
 * 
 * isObjectX({})  
 * // false
 * 
 * isObjectX([1, 2])  
 * // false
 * 
 * isObjectX(null)  
 * // false
 */
export function isObjectX(item: any): item is Record<string, any> {
    return typeof item === 'object' && item !== null && !Array.isArray(item) && Object.keys(item).length > 0
}

/**
 * Returns `true` if the value is a non-empty array.
 *
 * An `arrayX` means:
 * - the value is an array
 * - and it has length > 0
 *
 * @example
 * isArrayX([1, 2])  
 * // true
 * 
 * isArrayX([])  
 * // false
 */
export function isArrayX(item: any): item is any[] {
    return Array.isArray(item) && item.length > 0
}

/**
 * Returns `true` if the value is a usable non-zero number.
 *
 * A `numberX` means:
 * - the value is a valid number
 * - it is not `NaN`
 * - and it is not `0`
 *
 * @example
 * isNumberX(12)  
 * // true
 * isNumberX(-5)  
 * // true
 * 
 * isNumberX(0)  
 * // false
 * 
 * isNumberX(NaN)  
 * // false
 */
export function isNumberX(item: any): item is number {
    return typeof item === 'number' && !isNaN(item) && item !== 0
}

/////////// TYPE CHECK COMBOS

//// GENERAL

// helper for 'findSweetType'
const sweetTypeFinder = {
    string: (item: string) => isStringX(item) ? 'stringX' : 'string',
    number: (item: number) => isNumberX(item) ? 'numberX' : 'number',
    array: (item: any[]) => isArrayX(item) ? 'arrayX' : 'array',
    object: (item: Record<string, any>) => isObjectX(item) ? 'objectX' : 'object',
    boolean: (item: boolean) => item ? 'true' : 'false',
    symbol: (item: symbol) => isSymbolX(item) ? 'symbolX' : 'symbol',
    bigint: (_item: bigint) => 'bigint',
    function: (_item: Function) => 'function',
    undefined: (_item: undefined) => 'undefined',
    null: (_item: null) => 'null',
} as const

/**
 * Detects the most specific matching Sweet type for a value.
 *
 * Unlike raw JavaScript `typeof`, this function also applies
 * Sweet semantic refinements such as:
 * - `stringX`
 * - `numberX`
 * - `arrayX`
 * - `objectX`
 * - `symbolX`
 * - exact boolean types (`true` / `false`)
 *
 * This makes it useful for runtime inspection, debugging,
 * validation flows, and dynamic Sweet type handling.
 *
 * Notes:
 * - Arrays return `"array"` or `"arrayX"` instead of `"object"`
 * - `null` is handled separately from `"object"`
 * - `true` and `false` are returned as distinct Sweet types
 *
 * @param item - The value to analyze
 *
 * @returns The most specific matching Sweet type name
 *
 * @example
 * findSweetType("") // "string"
 *
 * @example
 * findSweetType("hello") // "stringX"
 *
 * @example
 * findSweetType(0) // "number"
 *
 * @example
 * findSweetType(5) // "numberX"
 *
 * @example
 * findSweetType([]) // "array"
 *
 * @example
 * findSweetType([1, 2]) // "arrayX"
 *
 * @example
 * findSweetType({}) // "object"
 *
 * @example
 * findSweetType({ a: 1 }) // "objectX"
 *
 * @example
 * findSweetType(true) // "true"
 *
 * @example
 * findSweetType(Symbol()) // "symbol"
 *
 * @example
 * findSweetType(Symbol("id")) // "symbolX"
 *
 * @example
 * findSweetType(null) // "null"
 */
export function findSweetType(item: any): SweetBaseTypes {
    const adaptType =
        item === null
            ? 'null'
            : Array.isArray(item)
                ? 'array'
                : typeof item

    return sweetTypeFinder[adaptType](item as never) as SweetBaseTypes
}

/**
 * Returns `true` if the value is `null` or `undefined`.
 *
 * This follows the standard JavaScript meaning of "nullish":
 * - `null`
 * - `undefined`
 *
 * Unlike `isUsable`, this does not treat empty strings,
 * empty arrays, empty objects, `0`, or `false` as nullish.
 *
 * @example
 * isNullish(null) // true
 *
 * @example
 * isNullish(undefined) // true
 *
 * @example
 * isNullish("") // false
 *
 * @example
 * isNullish(0) // false
 *
 * @example
 * isNullish(false) // false
 *
 * @example
 * isNullish([]) // false
 */
export function isNullish(item: any): boolean {
    return item === null || item === undefined
}

/**
 * Checks whether a value matches a given Sweet base type.
 *
 * This is the internal dispatcher for `BaseTypes`.
 *
 * Notes:
 * - Handles JavaScript quirks such as `null`
 * - `object` excludes `null`
 * - Other types follow `typeof` behavior
 *
 * @param item - The value to check
 * @param baseType - One of the supported base type names
 *
 * @example
 * baseTypeCheck("hello", "string")  
 * // true
 * 
 * baseTypeCheck(null, "null")  
 * // true
 * 
 * baseTypeCheck([], "object")  
 * // true
 * 
 * baseTypeCheck(null, "object")  
 * // false
 */
function baseTypeCheck(item: any, baseType: BaseTypes): boolean {
    if (baseType === 'null') return item === null
    if (baseType === 'object') return typeof item === 'object' && item !== null
    if (baseType === 'number') return isNumber(item)
    return typeof item === baseType
}

/**
 * Checks whether a value matches any supported Sweet base type.
 *
 * This is the main dispatcher for `SweetBaseTypes`.
 *
 * It routes the check to the correct internal checker depending on whether
 * the requested type is a:
 * - `BaseTypes`
 * - `PrecisionTypes`
 * - `XTypes`
 *
 * @param item - The value to check
 * @param sweetType - The Sweet type name to validate against
 *
 * @example
 * sweetTypeCheck("hello", "string")  
 * // true
 * 
 * sweetTypeCheck("hello", "stringX")  
 * // true
 * 
 * sweetTypeCheck("", "stringX")  
 * // false
 * 
 * sweetTypeCheck([], "array")  
 * // true
 * 
 * sweetTypeCheck({}, "actualObj")  
 * // true
 * 
 * sweetTypeCheck("12", "numeric")  
 * // true
 * 
 * sweetTypeCheck(null, "null")  
 * // true
 */
export function sweetTypeCheck(item: any, sweetType: SweetBaseTypes): boolean {
    if (baseTypeArray.includes(sweetType as BaseTypes)) {
        return baseTypeCheck(item, sweetType as BaseTypes)
    }

    if (precisionTypeArray.includes(sweetType as PrecisionTypes)) {
        return precisionTypeCheck(item, sweetType as PrecisionTypes)
    }

    if (xTypeArray.includes(sweetType as XTypes)) {
        return xTypeCheck(item, sweetType as XTypes)
    }

    return false
}

/**
 * Internal map of all `XTypes` to their corresponding check functions.
 *
 * Each key represents a strict/usable variant of a base type.
 *
 * This is used by `xTypeCheck` to dynamically resolve checks.
 */
const xChecks: Record<XTypes, (item: any) => boolean> = {
    stringX: isStringX,
    objectX: isObjectX,
    numberX: isNumberX,
    arrayX: isArrayX,
    symbolX: isSymbolX
}

/**
 * Checks whether a value satisfies a given `XType`.
 *
 * `XTypes` represent stricter, "usable" versions of base types
 * (e.g. non-empty strings, non-zero numbers, etc.).
 *
 * This function delegates to the corresponding check function
 * from the internal `xChecks` map.
 *
 * @param item - The value to check
 * @param xType - The strict Sweet type to validate against
 *
 * @example
 * xTypeCheck("hello", "stringX")  
 * // true
 * 
 * xTypeCheck("", "stringX")  
 * // false
 * 
 * xTypeCheck(0, "numberX")  
 * // false
 * 
 * xTypeCheck([1], "arrayX")  
 * // true
 */
function xTypeCheck(item: any, xType: XTypes): boolean {
    return xChecks[xType](item)
}

//////// PRECISION CHECKS

/**
 * Internal map of all `PrecisionTypes` to their corresponding check functions.
 *
 * Precision types narrow common JavaScript edge cases, such as arrays,
 * actual objects, exact boolean values, and numeric strings.
 *
 * This is used by `precisionTypeCheck` to dynamically resolve checks.
 */
const precisionChecks: Record<PrecisionTypes, (item: any) => boolean> = {
    array: isArray, actualObj: isActualObj, true: isTrue, false: isFalse, numeric: isNumeric,
}

/**
 * Checks whether a value satisfies a given `PrecisionType`.
 *
 * `PrecisionTypes` represent more specific Sweet type checks
 * than broad base types.
 *
 * @param item - The value to check
 * @param precisionType - The precision Sweet type to validate against
 *
 * @example
 * precisionTypeCheck([1, 2], "array")  
 * // true
 * 
 * precisionTypeCheck({}, "actualObj")  
 * // true
 * 
 * precisionTypeCheck(true, "true")  
 * // true
 * precisionTypeCheck("12", "numeric")  
 * // true
 */
function precisionTypeCheck(item: any, precisionType: PrecisionTypes): boolean {
    return precisionChecks[precisionType](item)
}

/**
 * Returns `true` if a value is considered empty by Sweet value rules.
 *
 * Empty values include:
 * - `null`
 * - `undefined`
 * - empty or whitespace-only strings
 * - `0`
 * - empty arrays
 * - empty actual objects
 *
 * Values like `false`, functions, symbols, and bigints are not treated as empty.
 *
 * @example
 * isEmptyVal("") // true
 * isEmptyVal("   ") // true
 * isEmptyVal("hello") // false
 *
 * @example
 * isEmptyVal(0) // true
 * isEmptyVal(5) // false
 *
 * @example
 * isEmptyVal([]) // true
 * isEmptyVal([1]) // false
 *
 * @example
 * isEmptyVal({}) // true
 * isEmptyVal({ a: 1 }) // false
 *
 * @example
 * isEmptyVal(null) // true
 * isEmptyVal(undefined) // true
 * isEmptyVal(false) // false
 */
export function isEmptyVal(value: any): boolean {
    if (isNullish(value)) return true

    if (isString(value)) return !isStringX(value)
    if (isNumber(value)) return !isNumberX(value)
    if (isArray(value)) return !isArrayX(value)
    if (isActualObj(value)) return !isObjectX(value)

    return false
}

/**
 * Returns `true` if a value is considered clear/meaningful by Sweet value rules.
 *
 * A clear value means:
 * - non-nullish
 * - non-empty string
 * - non-zero number
 * - non-empty array
 * - non-empty actual object
 * - boolean `true`
 *
 * Values like `false`, `0`, empty strings, empty arrays,
 * empty objects, `null`, and `undefined` return `false`.
 *
 * Functions, symbols, and bigints are not treated as clear values.
 *
 * @example
 * isClearValue("hello") // true
 * isClearValue("") // false
 *
 * @example
 * isClearValue(5) // true
 * isClearValue(0) // false
 *
 * @example
 * isClearValue([1]) // true
 * isClearValue([]) // false
 *
 * @example
 * isClearValue({ a: 1 }) // true
 * isClearValue({}) // false
 *
 * @example
 * isClearValue(true) // true
 * isClearValue(false) // false
 *
 * @example
 * isClearValue(null) // false
 */
export function isClearValue(value: any): boolean {
    if (isNullish(value)) return false
    if (isString(value)) return isStringX(value)
    if (isNumber(value)) return isNumberX(value)
    if (isArray(value)) return isArrayX(value)
    if (isActualObj(value)) return isObjectX(value)
    if (isBoolean(value)) return value
    return false
}