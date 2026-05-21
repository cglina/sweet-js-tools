/**
 * Capitalizes the first non-space character of a string.
 *
 * Leading spaces are removed.
 * Returns an empty string for empty or whitespace-only strings.
 *
 * @example
 * capitalize("hello") → "Hello"
 * capitalize("  hello") → "Hello"
 * capitalize("   ") → ""
 */
export declare function capitalize(str?: string): string;
/**
 * Escapes special RegExp characters in a string.
 *
 * Useful when turning plain text into a safe literal RegExp pattern.
 *
 * @example
 * escapeRegex("hello.world")
 * // "hello\\.world"
 *
 * @example
 * escapeRegex("[test]?")
 * // "\\[test\\]\\?"
 */
export declare function escapeRegex(str?: string): string;
export type SweetStop = "." | "!" | "?";
export type SweetStops = SweetStop | SweetStop[];
/**
 * Capitalizes sentence-like text.
 *
 * - Capitalizes the first non-space character of each string
 * - Removes leading spaces from each string
 * - Capitalizes letters after selected punctuation marks
 * - Only capitalizes after punctuation when the punctuation is followed by whitespace
 *
 * This avoids changing compact text like emails, URLs, or abbreviations without spaces.
 *
 * If an array is passed:
 * - each string is capitalized separately
 * - the array is returned by default
 * - if `enforceString` is `true`, the result is joined into one string
 *
 * @param text - A string or array of strings to capitalize
 * @param punctuation - Sentence-ending punctuation to use as capitalization stops
 * @param enforceString - If `true`, joins array results into one string
 *
 * @example
 * capitalizeText("hello. how are you?")
 * // "Hello. How are you?"
 *
 * @example
 * capitalizeText("  hello! nice to meet you.")
 * // "Hello! Nice to meet you."
 *
 * @example
 * capitalizeText("email me at test@example.com. thanks")
 * // "Email me at test@example.com. Thanks"
 *
 * @example
 * capitalizeText(["hello. hi!", "  another one? yes"])
 * // ["Hello. Hi!", "Another one? Yes"]
 *
 * @example
 * capitalizeText(["hello.", "nice."], [".", "!", "?"], true)
 * // "Hello. Nice."
 */
export declare function capitalizeText(text: string | string[], punctuation?: SweetStops, enforceString?: boolean): string | string[];
export type WordCountMode = "chunk" | "word" | "split";
/**
 * Counts how many matches a pattern produces in a string.
 *
 * Accepts either a RegExp or a string pattern.
 *
 * - String patterns are treated as literal matches (auto-escaped)
 * - Matching is non-overlapping
 * - Always uses global matching
 * - Returns `0` if no matches are found
 *
 * @param text - The string to search within
 * @param pattern - A RegExp or string to match
 *
 * @returns The number of matches found
 *
 * @example
 * matchCount("hello world", /\w+/g) // 2
 *
 * @example
 * matchCount("a1b2c3", /\d/g) // 3
 *
 * @example
 * matchCount("banana", "na") // 2
 *
 * @example
 * matchCount("aaa", "aa") // 1
 */
export declare function matchCount(text: string, pattern: RegExp | string): number;
/**
 * Counts words or word-like segments in a string or array of strings.
 *
 * Supports multiple counting modes:
 *
 * - `"chunk"` → counts all non-whitespace segments
 * - `"word"` → counts segments that start with a letter (Unicode-aware)
 * - `"split"` → counts letter-only groups (splits on punctuation/symbols)
 *
 * If an array is passed:
 * - returns an array of counts (one per string)
 *
 * @param text - A string or array of strings to analyze
 * @param mode - The word counting mode
 *
 * @returns The word count, or an array of counts if input is an array
 *
 * @example
 * wordCount("hello @you 123")
 * // 3
 *
 * @example
 * wordCount("hello @you 123", "word")
 * // 1
 *
 * @example
 * wordCount("hello-world test", "split")
 * // 3
 *
 * @example
 * wordCount(["hello world", "another test"])
 * // [2, 2]
 */
export declare function wordCount(text: string | string[], mode?: WordCountMode): number | number[];
/**
 * Removes extra internal spacing while preserving line breaks.
 *
 * - Trims leading and trailing whitespace
 * - Replaces repeated spaces/tabs inside a line with one space
 * - Replaces repeated blank lines with one line break
 *
 * @example
 * trimExtra("  hello   world  ")
 * // "hello world"
 *
 * @example
 * trimExtra("hello\n\n\nworld")
 * // "hello\nworld"
 *
 * @example
 * trimExtra("hello   world\n\n  nice   day")
 * // "hello world\nnice day"
 */
export declare function trimExtra(text?: string): string;
/**
 * Normalizes strings for consistent, language-friendly processing.
 *
 * - Converts accented characters (e.g. `ü`, `é`, `ã`) to their base forms (`u`, `e`, `a`)
 * - Converts German `ß` to `ss`
 * - Optionally cleans spacing using `trimExtra`
 *
 * @param str - A string to normalize
 * @param cleanSpacing - If `true`, applies `trimExtra` to normalize spacing (default: `true`)
 *
 * @returns A normalized string
 *
 * @example
 * normalizeString("München Straße")
 * // "Munchen Strasse"
 *
 * @example
 * normalizeString("  Olá   mundo  ")
 * // "ola mundo"
 *
 * @example
 * normalizeString("  Olá   mundo  ", false)
 * // "  Ola   mundo  "
 *
 */
export declare function normalizeString(str: string, cleanSpacing?: boolean): string;
/**
 * Normalizes text for consistent, language-friendly processing.
 *
 * - Converts accented characters (e.g. `ü`, `é`, `ã`) to their base forms (`u`, `e`, `a`)
 * - Converts German `ß` to `ss`
 * - Cleans spacing using `trimExtra`
 *
 * @param text - A string or array of strings to normalize
 *
 * If an array is passed, each string is normalized separately.
 *
 * @returns A normalized string, or an array of normalized strings if input is an array
 *
 * @example
 * normalizeText("München Straße")
 * // "Munchen Strasse"
 *
 * @example
 * normalizeText("  Olá   mundo  ")
 * // "ola mundo"
 *
 * @example
 * normalizeText(["Crème brûlée", "São Paulo"])
 * // ["creme brulee", "sao paulo"]
 */
export declare function normalizeText(text: string | string[]): string | string[];
/**
 * Creates a URL/file-name friendly slug from a string or array of strings.
 *
 * - Trims leading and trailing whitespace
 * - Normalizes accented letters, such as `ü` → `u` and `é` → `e`
 * - Converts German `ß` to `ss`
 * - Splits camelCase words
 * - Splits letters and numbers
 * - Replaces whitespace with dashes
 * - Converts underscores to dashes
 * - Removes non-slug-safe symbols
 * - Collapses repeated dashes
 * - Converts the result to lowercase
 *
 * If an array is passed, each string is converted separately.
 *
 * @param text - A string or array of strings to convert into slug form
 *
 * @returns A slug string, or an array of slug strings if input is an array
 *
 * @example
 * slugMaker("Hello World")
 * // "hello-world"
 *
 * @example
 * slugMaker("helloWorld123")
 * // "hello-world-123"
 *
 * @example
 * slugMaker("München Straße")
 * // "munchen-strasse"
 *
 * @example
 * slugMaker("Olá_mundo!")
 * // "ola-mundo"
 *
 * @example
 * slugMaker(["Hello World", "Crème brûlée"])
 * // ["hello-world", "creme-brulee"]
 */
export declare function slugMaker(text: string | string[]): string | string[];
/**
 * Removes symbols from a string or array of strings.
 *
 * Keeps letters, numbers, and whitespace.
 * Supports accented/non-English letters.
 *
 * @example
 * removeSymbols("hello@world!")
 * // "helloworld"
 *
 * @example
 * removeSymbols("Olá, München!")
 * // "Olá München"
 */
export declare function removeSymbols(text: string | string[]): string | string[];
/**
 * Replaces symbols in a string or array of strings.
 *
 * Keeps letters, numbers, and whitespace.
 * Any other character is replaced with the given replacement.
 * Supports accented/non-English letters.
 *
 * @param text - A string or array of strings to clean
 * @param replacement - The value used to replace symbols
 *
 * @returns A cleaned string, or an array of cleaned strings if input is an array
 *
 * @example
 * replaceSymbols("hello@world!")
 * // "hello world "
 *
 * @example
 * replaceSymbols("Olá, München!", "")
 * // "Olá München"
 *
 * @example
 * replaceSymbols(["hi!", "a+b"], "_")
 * // ["hi_", "a_b"]
 */
export declare function replaceSymbols(text: string | string[], replacement?: string): string | string[];
/**
 * Converts a string or array of strings into snake_case.
 *
 * - Splits camelCase words
 * - Replaces spaces and dashes with underscores
 * - Collapses repeated underscores
 * - Converts the result to lowercase
 *
 * Optionally normalizes text before conversion:
 * - removes accents (e.g. `ü` → `u`)
 * - converts `ß` → `ss`
 * - cleans spacing using `trimExtra`
 *
 * @param text - A string or array of strings to convert
 * @param normalizeInput - If `true`, applies `normalizeString` before conversion (default: `true`)
 *
 * @returns A snake_case string, or an array of snake_case strings if input is an array
 *
 * @example
 * toSnakeCase("helloWorld")
 * // "hello_world"
 *
 * @example
 * toSnakeCase("Hello world-test")
 * // "hello_world_test"
 *
 * @example
 * toSnakeCase("München Straße")
 * // "munchen_strasse"
 *
 * @example
 * toSnakeCase("Crème brûlée!", false)
 * // "crème_brûlée!"
 */
export declare function toSnakeCase(text: string | string[], normalizeInput?: boolean): string | string[];
/**
 * Converts a string or array of strings into kebab-case.
 *
 * - Splits camelCase words
 * - Replaces spaces and underscores with dashes
 * - Collapses repeated dashes
 * - Converts the result to lowercase
 *
 * Does not remove symbols or normalize accents.
 *
 * @example
 * toKebabCase("helloWorld")
 * // "hello-world"
 *
 * @example
 * toKebabCase("Hello world_test")
 * // "hello-world-test"
 */
export declare function toKebabCase(text: string | string[], normalizeInput?: boolean): string | string[];
