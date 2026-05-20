import { isActualObj, isArray } from "../basicTypes.js";
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
export function isStructuredJSON(input) {
    const trimmed = input.trim();
    if (trimmed.length === 0)
        return false;
    try {
        const parsed = JSON.parse(trimmed);
        return isActualObj(parsed) || Array.isArray(parsed);
    }
    catch {
        return false;
    }
}
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
export function splitCSVRow(row) {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
            if (inQuotes && row[i + 1] === '"') {
                current += '"';
                i++;
            }
            else {
                inQuotes = !inQuotes;
            }
        }
        else if (char === "," && !inQuotes) {
            result.push(current.trim());
            current = "";
        }
        else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}
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
export function isCSVString(input, strictColumns = false) {
    const rows = input
        .trim()
        .split("\n")
        .map(r => r.trim())
        .filter(r => r.length > 0);
    if (rows.length < 2)
        return false;
    const parsedRows = rows.map(splitCSVRow);
    const headerColumnCount = parsedRows[0].length;
    if (headerColumnCount < 2)
        return false;
    if (!strictColumns) {
        return parsedRows.slice(1).some(row => row.length > 1);
    }
    return parsedRows
        .slice(1)
        .every(row => row.length >= headerColumnCount);
}
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
export function stringDataCheck(input) {
    const trimmed = input.trim();
    if (trimmed.length === 0)
        return "unknown";
    if (isStructuredJSON(trimmed))
        return "json";
    if (isCSVString(trimmed))
        return "csv";
    return "unknown";
}
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
export function findDataType(data) {
    if (typeof data === "string")
        return stringDataCheck(data);
    if (isArray(data)) {
        if (data.length > 0 && data.every(item => isActualObj(item))) {
            return "baseObjectArray";
        }
        return "otherArray";
    }
    if (isActualObj(data))
        return "baseObject";
    return "unknown";
}
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
export function csvObjectify(csv) {
    const rows = csv
        .trim()
        .split("\n")
        .map(row => row.trim())
        .filter(row => row.length > 0);
    if (rows.length < 2)
        return [];
    const headers = splitCSVRow(rows[0]).map(h => h.trim());
    if (headers.length === 0)
        return [];
    return rows.slice(1).map(row => {
        const values = splitCSVRow(row);
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index] ?? "";
        });
        return obj;
    });
}
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
export function parseData(data) {
    const dataType = findDataType(data);
    try {
        if (dataType === "json")
            return JSON.parse(data);
        if (dataType === "csv")
            return csvObjectify(data);
        return data;
    }
    catch {
        return data;
    }
}
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
export function csvToJSON(csv) {
    return JSON.stringify(csvObjectify(csv));
}
