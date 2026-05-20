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
export function capitalize(str: string = ""): string {
    const trimmed = str.trimStart()

    if (trimmed.length === 0) return ""

    return trimmed.slice(0, 1).toUpperCase() + trimmed.slice(1)
}


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
export function escapeRegex(str: string = ""): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export type SweetStop = "." | "!" | "?"
export type SweetStops = SweetStop | SweetStop[]

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
export function capitalizeText(
    text: string | string[],
    punctuation: SweetStops = [".", "!", "?"],
    enforceString: boolean = false
): string | string[] {
    const stops = Array.isArray(punctuation) ? punctuation.join("") : punctuation
    const regEx = new RegExp(`([${escapeRegex(stops)}]+\\s+)(\\S)`, "g")

    function upperAfterStop(_match: string, p1: string, p2: string): string {
        return p1 + p2.toUpperCase()
    }

    function capitalizeSentences(par: string): string {
        const capPar = capitalize(par)
        return capPar.replace(regEx, upperAfterStop)
    }

    if (typeof text === "string") {
        return capitalizeSentences(text)
    }

    const result = text.map(capitalizeSentences)

    return enforceString ? result.join(" ") : result
}

export type WordCountMode = "chunk" | "word" | "split"

const regWord = /\p{L}\S*/gu
const regWordChunk = /\S+/gu
const regSplitWord = /\p{L}+/gu

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
export function matchCount(
    text: string,
    pattern: RegExp | string
): number {
    const regex =
        typeof pattern === "string"
            ? new RegExp(escapeRegex(pattern), "g")
            : new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g")

    return text.match(regex)?.length || 0
}

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
export function wordCount(
    text: string | string[],
    mode: WordCountMode = "chunk"
): number | number[] {
    const regEx =
        mode === "word"
            ? regWord
            : mode === "split"
                ? regSplitWord
                : regWordChunk

    if (Array.isArray(text)) {
        return text.map(item => matchCount(item, regEx))
    }

    return matchCount(text, regEx)
}

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
export function trimExtra(text: string = ""): string {
    return text
        .trim()
        .replace(/[ \t]+/g, " ")
        .replace(/\s*\n+\s*/g, "\n")
}


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
 * // "munchen strasse"
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
export function normalizeString(
    str: string,
    cleanSpacing: boolean = true
): string {
    function normalize(str: string): string {
        const result = str
            .normalize("NFD")
            .replace(/ß/g, "ss")
            .replace(/[\u0300-\u036f]/g, "")
        return cleanSpacing ? trimExtra(result) : result
    }
    return normalize(str)
}

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
 * // "munchen strasse"
 *
 * @example
 * normalizeText("  Olá   mundo  ")
 * // "ola mundo"
 *
 * @example
 * normalizeText(["Crème brûlée", "São Paulo"])
 * // ["creme brulee", "sao paulo"]
 */
export function normalizeText(text: string | string[]): string | string[] {
    if (Array.isArray(text)) return text.map((item) => normalizeString(item))
    return normalizeString(text)
}

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
export function slugMaker(text: string | string[]): string | string[] {
    function makeSlug(str: string): string {
        const normalized = normalizeString(str)
        return normalized
            .replace(/([a-z])([A-Z])/g, "$1-$2")
            .replace(/([A-Za-z])(\d+)/g, "$1-$2")
            .replace(/(\d+)([A-Za-z])/g, "$1-$2")
            .replace(/\s+/g, "-")
            .replace(/_/g, "-")
            .replace(/[^\w-]/g, "")
            .replace(/-+/g, "-")
            .toLowerCase()
    }

    if (Array.isArray(text)) return text.map(makeSlug)
    return makeSlug(text)
}

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
export function removeSymbols(text: string | string[]): string | string[] {
    function remove(str: string): string {
        return str.replace(/[^\p{L}\d\s]/gu, "")
    }
    if (Array.isArray(text)) return text.map(remove)
    return remove(text)
}


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
export function replaceSymbols(
    text: string | string[],
    replacement: string = " "
): string | string[] {
    function replaceSym(str: string): string {
        return str.replace(/[^\p{L}\d\s]/gu, replacement)
    }
    if (Array.isArray(text)) return text.map(replaceSym)
    return replaceSym(text)
}

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
export function toSnakeCase(
    text: string | string[],
    normalizeInput: boolean = true
): string | string[] {
    function convert(str: string): string {
        const result = normalizeInput ? normalizeString(str) : str.trim()
        return result
            .replace(/([a-z])([A-Z])/g, "$1_$2")
            // replace spaces and dashes with underscore
            .replace(/[\s-]+/g, "_")
            // collapse multiple underscores
            .replace(/_+/g, "_")
            .toLowerCase()
    }

    if (Array.isArray(text)) return text.map(convert)
    return convert(text)
}


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
export function toKebabCase(
    text: string | string[],
    normalizeInput: boolean = true
): string | string[] {
    function convert(str: string): string {
        const result = normalizeInput ? normalizeString(str) : str.trim()

        return result
            // split camelCase
            .replace(/([a-z])([A-Z])/g, "$1-$2")
            // replace spaces and underscores with dash
            .replace(/[\s_]+/g, "-")
            // collapse multiple dashes
            .replace(/-+/g, "-")
            .toLowerCase()
    }

    if (Array.isArray(text)) return text.map(convert)
    return convert(text)
}
