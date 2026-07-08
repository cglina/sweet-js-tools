import { sweetType, isClearValue, isEmptyVal, isNullish, isObject, objectX } from "../basicTypes.js";

export type BaseObject = Record<string, any>
type TypesCheckReturn = Record<string, string> | string[][]

type ReturnTypes = 'object' | 'array'

/**
 * Returns the JavaScript `typeof` result for each object entry.
 *
 * Can return the result as:
 * - an object (`{ key: type }`)
 * - an array of `[key, type]` pairs
 *
 * Returns an empty object or array if the input is not a non-empty object.
 *
 * Notes:
 * - Uses JavaScript's native `typeof` on each object value
 * - If an object value is an array, its type is returned as `"object"`
 * - If an object value is `null`, its type is returned as `"object"`
 * - This function only inspects entries inside non-empty objects
 *
 * @param obj - The object to inspect
 * @param returnType - Output format (`"object"` or `"array"`)
 *
 * @returns An object map or array of `[key, type]` pairs
 *
 * @example
 * objEntryTypes({
 *   name: "Lina",
 *   age: 32,
 *   active: true
 * })
 *
 * // {
 * //   name: "string",
 * //   age: "number",
 * //   active: "boolean"
 * // }
 *
 * @example
 * objEntryTypes(
 *   { name: "Lina", age: 32 },
 *   "array"
 * )
 *
 * // [
 * //   ["name", "string"],
 * //   ["age", "number"]
 * // ]
 *
 * @example
 * objEntryTypes({})
 * // {}
 */
export function objEntryTypes(
    obj: BaseObject,
    returnType: ReturnTypes = 'object'
): TypesCheckReturn {

    // checks if obj isn't empty
    if (!objectX(obj)) {
        return returnType === 'array' ? [] : {}
    }

    const map: string[][] =
        Object.keys(obj).map(key => [key, typeof obj[key]])

    if (returnType === 'array') {
        return map
    }

    return Object.fromEntries(map)
}

type EmptyValMode =
    | "remove"
    | "false"
    | "emptyType"
    | ["replace", any]

/**
 * Cleans empty values from an object.
 *
 * Empty values are detected with `isEmptyVal`.
 *
 * Supported modes:
 * - `"remove"` → removes empty entries
 * - `"false"` → replaces empty values with `false`
 * - `"emptyType"` → replaces empty values with a label like `"empty string"`
 * - `["replace", value]` → replaces empty values with the provided value
 *
 * Does not mutate the original object.
 * Returns `{}` if the input is not a non-empty object.
 *
 * @example
 * fixEmptyVals({ name: "", age: 32 })
 * // { age: 32 }
 *
 * @example
 * fixEmptyVals({ name: "", age: 32 }, ["replace", "unknown"])
 * // { name: "unknown", age: 32 }
 *
 * @example
 * fixEmptyVals({ name: "", age: 32 }, "false")
 * // { name: false, age: 32 }
 *
 * @example
 * fixEmptyVals({ name: "", birthyear: 0 }, "emptyType")
 * // { name: "empty string", birthyear: "empty number" }
 */
export function fixEmptyVals(obj: BaseObject, mode: EmptyValMode = "remove"): BaseObject {
    if (!objectX(obj)) return {}

    const result: BaseObject = {}

    Object.entries(obj).forEach(([key, value]) => {
        if (!isEmptyVal(value)) {
            result[key] = value
            return
        }

        if (mode === "remove") return

        if (mode === "false") {
            result[key] = false
            return
        }

        if (mode === "emptyType") {
            result[key] = Number.isNaN(value)
                ? "empty number"
                : `empty ${sweetType(value)}`
            return
        }

        if (Array.isArray(mode) && mode[0] === "replace") {
            result[key] = mode[1]
        }
    })

    return result
}

/**
 * Returns the non-empty entries of an object as `[key, value]` pairs.
 *
 * Internally uses `fixEmptyVals(obj, "remove")`
 * to remove empty values before creating the entry list.
 *
 * Empty values include:
 * - `null`
 * - `undefined`
 * - empty or whitespace-only strings
 * - `0`
 * - empty arrays
 * - empty objects
 *
 * Returns `[]` if the input is nullish.
 *
 * @param obj - The object to clean and convert into entries
 *
 * @returns An array of `[key, value]` pairs containing only non-empty values
 *
 * @example
 * cleanEntries({
 *   name: "",
 *   age: 32,
 *   city: "Munich"
 * })
 *
 * // [
 * //   ["age", 32],
 * //   ["city", "Munich"]
 * // ]
 *
 * @example
 * cleanEntries(null)
 * // []
 */
export function cleanEntries(obj: BaseObject): [string, any][] {
    if (isNullish(obj)) return []
    return Object.entries(fixEmptyVals(obj, "remove"))
}

/**
 * Returns the keys of an object after removing empty values.
 *
 * Internally uses `fixEmptyVals(obj, "remove")`.
 *
 * Returns `[]` if the input is nullish.
 *
 * @example
 * cleanKeys({
 *   name: "",
 *   age: 32,
 *   city: "Munich"
 * })
 *
 * // ["age", "city"]
 *
 * @example
 * cleanKeys(null)
 * // []
 */
export function cleanKeys(obj: BaseObject): string[] {
    if (isNullish(obj)) return []

    const cleanObj = fixEmptyVals(obj, 'remove')

    return Object.keys(cleanObj)
}

/**
 * Returns the values of an object after removing empty values.
 *
 * Internally uses `fixEmptyVals(obj, "remove")`.
 *
 * Empty values are removed before the values are collected.
 *
 * Returns `[]` if the input is nullish.
 *
 * @example
 * cleanValues({
 *   name: "",
 *   age: 32,
 *   city: "Munich"
 * })
 *
 * // [32, "Munich"]
 *
 * @example
 * cleanValues(null)
 * // []
 */
export function cleanValues(obj: BaseObject): any[] {
    if (isNullish(obj)) return []

    const cleanObj = fixEmptyVals(obj, 'remove')

    return Object.values(cleanObj)
}

/**
 * Fixes unclear object values using the selected handling mode.
 *
 * Clear values are detected with `isClearValue`.
 *
 * Supported modes:
 * - `"remove"` → removes unclear entries
 * - `"false"` → replaces unclear values with `false`
 * - `"emptyType"` → replaces unclear values with a label like `"empty string"`
 * - `["replace", value]` → replaces unclear values with the provided value
 *
 * Does not mutate the original object.
 * Returns `{}` if the input is not a non-empty object.
 *
 * @example
 * fixEmptyX({ name: "", age: 32, active: true })
 * // { age: 32, active: true }
 *
 * @example
 * fixEmptyX({ name: "", active: false }, ["replace", "unknown"])
 * // { name: "unknown", active: "unknown" }
 *
 * @example
 * fixEmptyX({ name: "", active: false }, "false")
 * // { name: false, active: false }
 *
 * @example
 * fixEmptyX({ name: "", active: false }, "emptyType")
 * // { name: "empty string", active: "empty false" }
 */
export function fixEmptyX(obj: BaseObject, mode: EmptyValMode = "remove"): BaseObject {
    if (!objectX(obj)) return {}

    const result: BaseObject = {}

    Object.entries(obj).forEach(([key, value]) => {
        if (isClearValue(value)) {
            result[key] = value
            return
        }

        if (mode === "remove") return

        if (mode === "false") {
            result[key] = false
            return
        }

        if (mode === "emptyType") {
            result[key] = Number.isNaN(value)
                ? "empty number"
                : `empty ${sweetType(value)}`
            return
        }

        if (Array.isArray(mode) && mode[0] === "replace") {
            result[key] = mode[1]
        }
    })

    return result
}


/**
 * Returns the clear entries of an object as `[key, value]` pairs.
 *
 * Internally uses `fixEmptyX(obj, "remove")`
 * to remove unclear values before creating the entry list.
 *
 * Clear values are detected with `isClearValue`.
 *
 * Returns `[]` if the input is not a non-empty object.
 *
 * @param obj - The object to clean and convert into entries
 *
 * @returns An array of `[key, value]` pairs containing only clear values
 *
 * @example
 * clearObjEntries({
 *   name: "",
 *   age: 32,
 *   active: true,
 *   verified: false
 * })
 *
 * // [
 * //   ["age", 32],
 * //   ["active", true]
 * // ]
 *
 * @example
 * clearObjEntries({})
 * // []
 */
export function clearObjEntries(obj: BaseObject): [string, any][] {
    if (!objectX(obj)) return []

    const clearObj = fixEmptyX(obj, 'remove')

    return Object.entries(clearObj)
}

/**
 * Returns the keys of an object after removing unclear values.
 *
 * Internally uses `fixEmptyX(obj, "remove")`.
 *
 * Clear values are detected with `isClearValue`.
 *
 * Returns `[]` if the input is not a non-empty object.
 *
 * @param obj - The object to clean
 *
 * @returns An array containing only keys linked to clear values
 *
 * @example
 * clearObjKeys({
 *   name: "",
 *   age: 32,
 *   active: true,
 *   verified: false
 * })
 *
 * // ["age", "active"]
 *
 * @example
 * clearObjKeys({})
 * // []
 */
export function clearObjKeys(obj: BaseObject): string[] {
    if (!objectX(obj)) return []

    const clearObj = fixEmptyX(obj, 'remove')

    return Object.keys(clearObj)
}

/**
 * Returns the values of an object after removing unclear values.
 *
 * Internally uses `fixEmptyX(obj, "remove")`.
 *
 * Clear values are detected with `isClearValue`.
 *
 * Returns `[]` if the input is not a non-empty object.
 *
 * @param obj - The object to clean
 *
 * @returns An array containing only clear values
 *
 * @example
 * clearObjValues({
 *   name: "",
 *   age: 32,
 *   active: true,
 *   verified: false
 * })
 *
 * // [32, true]
 *
 * @example
 * clearObjValues({})
 * // []
 */
export function clearObjValues(obj: BaseObject): any[] {
    if (!objectX(obj)) return []

    const clearObj = fixEmptyX(obj, 'remove')

    return Object.values(clearObj)
}

/**
 * Filters object entries using a custom condition function.
 *
 * Works similarly to array `.filter()`, but for object entries.
 *
 * The filter method receives:
 * - the entry key
 * - the entry value
 *
 * Only entries returning `true` are kept.
 *
 * Returns:
 * - a new filtered object
 * - `{}` if the input is not an object.
 * - `{}` if no entries pass the filter
 *
 * Does not mutate the original object.
 *
 * @param obj - The object to filter
 * @param filterMethod - Function used to decide which entries to keep
 *
 * @returns A new object containing only matching entries
 *
 * @example
 * objFilter(
 *   { name: "Lina", age: 32, city: null },
 *   (_key, value) => value !== null
 * )
 *
 * // {
 * //   name: "Lina",
 * //   age: 32
 * // }
 *
 * @example
 * objFilter(
 *   { age: 32, score: 0, name: "Lina" },
 *   (_key, value) => typeof value === "number"
 * )
 *
 * // {
 * //   age: 32,
 * //   score: 0
 * // }
 *
 * @example
 * objFilter(
 *   { userName: "Lina", admin: true },
 *   (key) => key.startsWith("user")
 * )
 *
 * // {
 * //   userName: "Lina"
 * // }
 */
export function objFilter(
    obj: BaseObject,
    filterMethod: (key: string, value: any) => boolean =
        (_key, value) => value !== null
): BaseObject {

    if (!isObject(obj)) return {}

    const entries = Object.entries(obj)

    const result = entries.filter(
        ([key, value]) => filterMethod(key, value)
    )

    if (result.length > 0) {
        return Object.fromEntries(result)
    }

    return {}
}

/**
 * Modifies the keys of an object using a custom mapping function.
 *
 * Values are kept unchanged.
 * If the mapping function throws for an entry, the original key is kept.
 *
 * Does not mutate the original object.
 * 
 * Returns `{}` if the input is not an object.
 *
 * @example
 * objModKeys(
 *   { firstName: "Lina", age: 32 },
 *   key => key.toUpperCase()
 * )
 * // { FIRSTNAME: "Lina", AGE: 32 }
 *
 * @example
 * objModKeys(
 *   { firstName: "Lina" },
 *   key => `user_${key}`
 * )
 * // { user_firstName: "Lina" }
 */
export function objModKeys(
    obj: BaseObject,
    modMethod: (key: string, value: any) => string =
        (key) => key
): BaseObject {
    if (!isObject(obj)) return {}

    const result = Object.entries(obj).map(([key, value]) => {
        try {
            const newKey = modMethod(key, value)
            return [newKey, value]
        } catch {
            return [key, value]
        }
    })

    return Object.fromEntries(result)
}

/**
 * Modifies the values of an object using a custom mapping function.
 *
 * Keys are kept unchanged.
 * If the mapping function throws for an entry, the original value is kept.
 *
 * Does not mutate the original object.
 * Returns `{}` if the input is not an object.
 *
 * @example
 * objModVals(
 *   { age: 32, active: true },
 *   (_key, value) => String(value)
 * )
 * // { age: "32", active: "true" }
 *
 * @example
 * objModVals(
 *   { name: "  Lina  ", age: 32 },
 *   (_key, value) => typeof value === "string" ? value.trim() : value
 * )
 * // { name: "Lina", age: 32 }
 */
export function objModVals(
    obj: BaseObject,
    modMethod: (key: string, value: any) => any =
        (_key, value) => value
): BaseObject {
    if (!isObject(obj)) return {}

    const result = Object.entries(obj).map(([key, value]) => {
        try {
            return [key, modMethod(key, value)]
        } catch {
            return [key, value]
        }
    })

    return Object.fromEntries(result)
}

/**
 * Selects specific keys from an object.
 *
 * Unlike manual destructuring, missing keys are not automatically added
 * as `undefined`.
 *
 * Behavior:
 * - existing defined values are copied normally
 * - missing/undefined values are skipped by default
 * - if a fallback is provided, missing/undefined values use the fallback instead
 *
 * Does not mutate the original object.
 * Returns `{}` if the input is not an object.
 *
 * @param obj - The source object
 * @param keys - List of keys to extract
 * @param fallback - Optional fallback value for missing or undefined entries
 *
 * @returns A new object containing only the selected keys
 *
 * @example
 * objPick(
 *   { name: "La", surname: "Gos" },
 *   ["name", "surname", "age"]
 * )
 *
 * // {
 * //   name: "La",
 * //   surname: "Gos"
 * // }
 *
 * @example
 * objPick(
 *   { name: "La", surname: "Gos" },
 *   ["name", "surname", "age"],
 *   "unknown"
 * )
 *
 * // {
 * //   name: "La",
 * //   surname: "Gos",
 * //   age: "unknown"
 * // }
 */
export function objPick(
    obj: BaseObject,
    keys: string[],
    fallback?: any
): BaseObject {

    if (!isObject(obj)) return {}

    const result: BaseObject = {}

    keys.forEach(key => {

        // key exists AND value isn't undefined
        if (key in obj && obj[key] !== undefined) {
            result[key] = obj[key]
            return
        }

        // fallback provided
        if (fallback !== undefined) {
            result[key] = fallback
        }
    })

    return result
}

/**
 * Creates a new object excluding the specified keys.
 *
 * Works as the opposite of `objPick`.
 *
 * Useful for:
 * - removing sensitive fields
 * - cleaning API responses
 * - stripping internal values
 * - preparing frontend-safe objects
 *
 * Does not mutate the original object.
 * Returns {} if the input is not an object.
 *
 * @param obj - The source object
 * @param keys - List of keys to exclude
 *
 * @returns A new object without the omitted keys
 *
 * @example
 * objOmit(
 *   {
 *     name: "Lina",
 *     password: "123",
 *     token: "abc"
 *   },
 *   ["password", "token"]
 * )
 *
 * // {
 * //   name: "Lina"
 * // }
 *
 * @example
 * objOmit(
 *   { a: 1, b: 2, c: 3 },
 *   ["b"]
 * )
 *
 * // {
 * //   a: 1,
 * //   c: 3
 * // }
 */
export function objOmit(
    obj: BaseObject,
    keys: string[]
): BaseObject {

    if (!isObject(obj)) return {}

    const result: BaseObject = {}

    Object.entries(obj).forEach(([key, value]) => {

        // skip omitted keys
        if (keys.includes(key)) return

        result[key] = value
    })

    return result
}