/*
 * SWEET TYPE SYSTEM OVERVIEW:
 *
 * Base      → raw categories (string, number, object, array, etc.)
 * X         → usable values (non-empty, non-zero, etc.)
 * Adapt     → type interpretation & conversion
 *
 * sweetType() → unified entry point
 */

////// BASE EXPORTS
export {
    isString,
    isBoolean,
    isObject,
    isNumber,
    isUndefined,
    isNull,
    isArray,
    isFunction,
    isBigint,
    sweetType,
} from "sweet-type-tools"

import type {
    BaseTypeLabel,
    BaseTypeLabels,
    XName,
    XNames,
} from "sweet-type-tools"

export type { BaseTypeLabel, BaseTypeLabels }

////// X EXPORTS

export {
    stringX,
    numberX,
    arrayX,
    objectX,
    symbolX,
    sweetX,
    sweetXCheck,
    xNameList
} from "sweet-type-tools"



/**
 * Strict/non-empty Sweet type names.
 *
 * `X` means the value passes a stronger usefulness check:
 *
 * - `stringX` — string with length > 0
 * - `arrayX` — array with length > 0
 * - `objectX` — non-array object with at least one key-value pair
 * - `numberX` — valid number that is not `0` (or `NaN`)
 * - `symbolX` - symbol with description, ie: Symbol() returns false
 */
export type XTypes = 'stringX' | 'objectX' | 'arrayX' | 'numberX' | 'symbolX'



/**
 * Runtime list of supported strict/non-empty `X` type names.
 */
const xTypeArray: XTypes[] = ['stringX', 'objectX', 'numberX', 'arrayX', 'symbolX']

/**
 * Core Sweet type names used by the library.
 *
 * Includes both standard JS base types and foundational Sweet semantic types.
 */
export type SweetBaseTypes = BaseTypeLabel | PrecisionTypes | XTypes

export type SweetTypeList = SweetBaseTypes[]






///////////// PRECISION TYPE CHECKS

/**
 * Returns `true` if a string is a valid numeric representation.
 *
 * Includes:
 * - integers
 * - floats
 * - scientific notation (`"1e3"`)
 * - strings with surrounding whitespace
 *
 * Excludes:
 * - empty strings
 * - whitespace-only strings
 * - non-numeric strings
 *
 * @example
 * isNumeric("12")
 * // true
 *
 * @example
 * isNumeric("  12  ")
 * // true
 *
 * @example
 * isNumeric("1e3")
 * // true
 *
 * @example
 * isNumeric("lala")
 * // false
 */
export function isNumeric(item: any): item is string {
    if (typeof item !== "string") return false

    const trimmed = item.trim()

    if (trimmed === "") return false

    return !isNaN(Number(trimmed))
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


/////////// TYPE CHECK COMBOS

//// GENERAL





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
 * // false
 * 
 * baseTypeCheck([], "array")
 * // true
 */
function baseTypeCheck(item: any, baseType: BaseTypeLabel): boolean {
    if (baseType === 'null') return item === null
    if (baseType === "object") return isObject(item)
    if (baseType === "array") return isArray(item)
    if (baseType === 'number') return isNumber(item)
    return typeof item === baseType
}

/**
 * Checks whether a value matches any supported Sweet type.
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
 * sweetTypeCheck("12", "numeric")  
 * // true
 * 
 * sweetTypeCheck(null, "null")  
 * // true
 */
export function sweetTypeCheck(item: any, sweetType: SweetBaseTypes): boolean {
    if (baseTypeArray.includes(sweetType as BaseTypeLabel)) {
        return baseTypeCheck(item, sweetType as BaseTypeLabel)
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
    stringX: stringX,
    objectX: objectX,
    numberX: numberX,
    arrayX: arrayX,
    symbolX: symbolX
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
 * Precision types narrow Sweet/JS types further to include exact boolean values and numeric strings.
 *
 * This is used by `precisionTypeCheck` to dynamically resolve checks.
 */

const precisionChecks: Record<PrecisionTypes, (item: any) => boolean> = {
    true: isTrue, false: isFalse, numeric: isNumeric,
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
 * precisionTypeCheck(true, "true")
 * // true
 *
 * @example
 * precisionTypeCheck(false, "false")
 * // true
 *
 * @example
 * precisionTypeCheck("12", "numeric")
 * // true
 */
function precisionTypeCheck(item: any, precisionType: PrecisionTypes): boolean {
    return precisionChecks[precisionType](item)
}


/**
 * Returns `true` if a value is considered clear/meaningful by Sweet value rules.
 *
 * A clear value means:
 * - non-nullish
 * - non-empty string
 * - non-zero number
 * - non-empty array
 * - non-empty object (not array!)
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
    if (isString(value)) return stringX(value)
    if (isNumber(value)) return numberX(value)
    if (isArray(value)) return arrayX(value)
    if (isObject(value)) return objectX(value)
    if (isBoolean(value)) return value
    return false
}