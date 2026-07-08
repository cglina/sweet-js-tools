/*
 * SWEET TYPE SYSTEM OVERVIEW:
 *
 * Base      → raw categories (string, number, object, array, etc.)
 * X         → usable values (non-empty, non-zero, etc.)
 * Adapt     → type interpretation & conversion
 *
 * sweetType() → unified entry point
 */

/////////////// BASE EXPORTS ///////////////

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
    SweetXLabel,
    SweetXLabels
} from "sweet-type-tools"

export type { BaseTypeLabel, BaseTypeLabels }

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

