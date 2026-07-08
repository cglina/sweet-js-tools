/*
 * SWEET TYPE SYSTEM OVERVIEW:
 *
 * Base      → raw categories (string, number, object, array, etc.)
 * X         → usable values (non-empty, non-zero, etc.)
 * Adapt     → type interpretation & conversion
 *
 * sweetType() → unified entry point
 */

/////////////// BASE IMPORTS ///////////////

import {
    isString,
    isBoolean,
    isObject,
    isNumber,
    isArray,
    isSymbol,
    isUndefined,
    isNull,
    isFunction,
    isBigint,
    baseLabelList,
    sweetType,
} from "sweet-type-tools"

import type {
    BaseTypeLabel,
    BaseTypeLabels,
    XTypeName,
    XTypeNames,
    SweetXLabel, /// alias SweetBaseType
    SweetXLabels /// alias SweetBaseTypes
} from "sweet-type-tools"

/////////////// BASE EXPORTS ///////////////

export {
    isString,
    isBoolean,
    isObject,
    isNumber,
    isSymbol,
    isUndefined,
    isNull,
    isArray,
    isFunction,
    isBigint,
    baseLabelList,
    sweetType,
} from "sweet-type-tools"

export type {
    BaseTypeLabel,
    BaseTypeLabels,
    XTypeName,
    XTypeNames,
    SweetXLabel, /// alias SweetBaseType
    SweetXLabels /// alias SweetBaseTypes
} from "sweet-type-tools"

/////////////// X IMPORTS ///////////////

import {
    stringX,
    numberX,
    arrayX,
    objectX,
    symbolX,
    sweetX,
    sweetXCheck,
    SweetXList
} from "sweet-type-tools"

/////////////// X EXPORTS ///////////////

export {
    stringX,
    numberX,
    arrayX,
    objectX,
    symbolX,
    sweetX,
    sweetXCheck,
    SweetXList
} from "sweet-type-tools"


/////////////// ADAPT IMPORTS ///////////////

import { isNumeric, isNullish, isEmptyVal } from "sweet-type-tools"

/////////////// ADAPT EXPORTS ///////////////

export { isNumeric, isNullish, isEmptyVal } from "sweet-type-tools"

/////////////// OTHER CHECKS ///////////////

//// TO-DO: INCLUDE IN STT!

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

//// TO-DO: consider adding to STT as the positive counterpart to isEmptyVal()

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
