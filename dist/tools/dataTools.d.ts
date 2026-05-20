import type { BaseObject } from "./objectTools.js";
type StringDataFormats = 'csv' | 'json' | 'unknown';
type DataFormats = StringDataFormats | 'baseObjectArray' | 'otherArray' | 'baseObject';
/**
 * Checks whether a string contains structured JSON data.
 *
 * Structured JSON means:
 * - the string can be parsed with `JSON.parse`
 * - and the parsed result is either an object or an array
 *
 * JSON primitives such as strings, numbers, booleans, or `null`
 * return `false`.
 *
 * @example
 * isStructuredJSON('{"name":"Lina"}') // true
 * isStructuredJSON("[1, 2, 3]") // true
 * isStructuredJSON('"hello"') // false
 * isStructuredJSON("123") // false
 * isStructuredJSON("hello") // false
 */
export declare function isStructuredJSON(input: string): boolean;
/**
 * Splits one CSV row into values.
 *
 * Commas inside quoted values are preserved.
 * Escaped quotes (`""`) inside quoted values are converted to `"`.
 *
 * This is a lightweight CSV row parser.
 * It does not handle multi-line quoted fields.
 *
 * @example
 * splitCSVRow("name,age")
 * // ["name", "age"]
 *
 * @example
 * splitCSVRow('Lina,"likes cats, coffee"')
 * // ["Lina", "likes cats, coffee"]
 *
 * @example
 * splitCSVRow('Lina,"likes ""quotes"""')
 * // ["Lina", 'likes "quotes"']
 */
export declare function splitCSVRow(row: string): string[];
/**
 * Checks whether a string looks like CSV data.
 *
 * A CSV string must have:
 * - at least 2 non-empty rows
 * - at least 2 header columns
 * - at least one data row with more than 1 column
 *
 * Quoted commas are supported through `splitCSVRow`.
 *
 * If `strictColumns` is `true`, every data row must have
 * at least as many columns as the header row.
 * Extra columns are allowed.
 *
 * @example
 * isCSVString("name,age\nLina,32") // true
 *
 * @example
 * isCSVString('name,notes\nLina,"likes cats, coffee"') // true
 *
 * @example
 * isCSVString("name,age\nLina") // false
 *
 * @example
 * isCSVString("name,age\nLina", true) // false
 *
 * @example
 * isCSVString("name,age\nLina,32,extra", true) // true
 */
export declare function isCSVString(input: string, strictColumns?: boolean): boolean;
/**
 * Detects the structured data format of a string.
 *
 * Returns:
 * - `"json"` if the string contains structured JSON data
 * - `"csv"` if the string looks like CSV data
 * - `"unknown"` if no supported data format is detected
 *
 * Notes:
 * - JSON is checked before CSV.
 * - JSON only counts as structured JSON if it parses into an object or array.
 * - Blank strings return `"unknown"`.
 *
 * @example
 * stringDataCheck('{"name":"Lina"}') // "json"
 * stringDataCheck("[1, 2, 3]") // "json"
 * stringDataCheck("name,age\nLina,32") // "csv"
 * stringDataCheck("hello") // "unknown"
 * stringDataCheck("   ") // "unknown"
 */
export declare function stringDataCheck(input: string): StringDataFormats;
/**
 * Detects the data format/type of a value.
 *
 * Returns:
 * - `"json"` | `"csv"` | `"unknown"` for string inputs (via `stringDataCheck`)
 * - `"baseObjectArray"` for arrays of objects
 * - `"otherArray"` for all other arrays
 * - `"baseObject"` for plain objects
 *
 * @example
 * findDataType('{"a":1}') // "json"
 * findDataType("name,age\nLina,32") // "csv"
 * findDataType([{ a: 1 }, { b: 2 }]) // "baseObjectArray"
 * findDataType([1, 2, 3]) // "otherArray"
 * findDataType({ a: 1 }) // "baseObject"
 * findDataType(123) // "unknown"
 */
export declare function findDataType(data: any): DataFormats;
/**
 * Converts a CSV string into an array of objects.
 *
 * The first row is used as the object keys.
 * Each following row becomes one object.
 *
 * Missing values are filled with an empty string (`""`),
 * so each returned object keeps the same keys as the header row.
 *
 * Supports:
 * - quoted values
 * - commas inside quoted values
 * - escaped quotes (`""`) inside quoted values
 *
 * Edge cases:
 * - Returns `[]` if there are fewer than 2 usable rows
 * - Returns `[]` if no headers are found
 * - Extra values without matching headers are ignored
 * - Multi-line quoted values are not supported
 *
 * @param csv - The CSV string to convert
 *
 * @returns An array of objects created from the CSV rows
 *
 * @example
 * csvObjectify("name,age\nLina,32")
 * // [{ name: "Lina", age: "32" }]
 *
 * @example
 * csvObjectify('name,notes\nLina,"likes cats, coffee"')
 * // [{ name: "Lina", notes: "likes cats, coffee" }]
 *
 * @example
 * csvObjectify("name,age\nLina")
 * // [{ name: "Lina", age: "" }]
 *
 * @example
 * csvObjectify("name,age\nLina,32,extra")
 * // [{ name: "Lina", age: "32" }]
 *
 * @example
 * csvObjectify("")
 * // []
 */
export declare function csvObjectify(csv: string): BaseObject[];
/**
 * Parses supported structured data into usable JavaScript data.
 *
 * Supported string formats:
 * - structured JSON strings → parsed object/array
 * - CSV strings → array of objects
 *
 * Non-string data is returned unchanged.
 * Unknown strings are returned unchanged.
 *
 * @example
 * parseData('{"name":"Lina"}')
 * // { name: "Lina" }
 *
 * @example
 * parseData("[1, 2, 3]")
 * // [1, 2, 3]
 *
 * @example
 * parseData("name,age\nLina,32")
 * // [{ name: "Lina", age: "32" }]
 *
 * @example
 * parseData("hello")
 * // "hello"
 *
 * @example
 * parseData({ name: "Lina" })
 * // { name: "Lina" }
 */
export declare function parseData(data: any): any;
/**
 * Converts a CSV string into a JSON string.
 *
 * Internally uses `csvObjectify` to convert the CSV into an array of objects,
 * then serializes the result using `JSON.stringify`.
 *
 * Returns `"[]"` if the CSV cannot be converted into usable data.
 *
 * @param csv - The CSV string to convert
 *
 * @returns A JSON string representation of the CSV data
 *
 * @example
 * csvToJSON("name,age\nLina,32")
 * // '[{"name":"Lina","age":"32"}]'
 *
 * @example
 * csvToJSON("")
 * // "[]"
 */
export declare function csvToJSON(csv: string): string;
export {};
