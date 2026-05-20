# Sweet JS Tools

A library of **practical** & **reusable** utilities designed to **streamline everyday development**, making JavaScript/TypeScript code cleaner, safer, and more consistent.

- [Overview](#overview-)
- [Installation](#installation)
- [Contents](#contents)
  - [String tools](#string-tools)
  - [Array tools](#-array-tools)
  - [Number tools](#number-tools)
  - [Object tools](#-object-tools)
  - [Data tools](#data-tools)
  - [*SweetTypes* (basic)](#-basic-sweettypes)

## Overview ✨

As a **tool set**, Sweet JS Tools focuses on:

- ease of use  
- reducing repetitive logic  
- safe defaults (no unexpected crashes)  
- improving code clarity *without adding complexity*  

The library provides a set of tools and common operations for `arrays`, `numbers`, `objects`, `strings`, and *structured data*.

> **tl;dr:** Streamline JS/TS development. Practical, simple, easy. ✨
    
## Installation

```bash
npm install sweet-js-tools
```

## Contents

<a name="string-tools"></a>
### 🔤  String Tools

Helpers for **cleaning**, **formatting**, and **transforming** text.

- capitalization and sentence formatting: `capitalize`, `capitalizeText`
- pattern matching and counting: `matchCount`, `wordCount`
- spacing and normalization: `trimExtra`, `normalizeString`, `normalizeText`
- slug and case conversion: `slugMaker`, `toSnakeCase`, `toKebabCase`
- symbol handling: `removeSymbols`, `replaceSymbols`
- regex helpers: `escapeRegex`

#### Example usage:
```js
capitalizeText("hello. how are you?")
// "Hello. How are you?"

slugMaker("Münchener Straße")
// "munchener-strasse"

wordCount("hello @you 123")
// 3
```

##
### 🏹 Array Tools

Utilities for creating, filtering, sorting & working with arrays.

- generate sequences from numbers: `arrayFromNr`, `zeroToNumber`
- map and extract object properties: `propMap`, `propMapCull`
- sorting and transformation: `sortNumbers`, `toArray`
- access and selection: `arrayLast`, `randomArrayItem`
- cleanup and structure: `removeDuplicates`, `arrayParts`, `paginationSlices`
- type-based filtering (Sweet Types): `includeType`, `excludeType`, `typeOrDefault`, `typeMatchMap`
- random selection: `randomArrayItem`
- pagination helpers: `paginationSlices`

#### Example usage:
```js
arrayFromNr(-5, 0)
// [-4, -3, -2, -1, 0]

removeDuplicates([1, 2, 2, 3])
// [1, 2, 3]
```
## 
<a name="number-tools"></a>
### 🔢  Number Tools

Consistent and predictable number behavior.

- rounding that works the same for positive and negative values: `absValueFloor`, `absValueCeil`
- safe random number generation: `randomNr`, `randomNr0`, `randomInRange`, `randomUpTo`, `randomBetween`
- decimal precision helpers: `floorDecimal`, `ceilDecimal`, `roundDecimal`
- number checks and helpers: `isOdd`, `isEven`, `evenOdd`
- range control: `clamp`
- factor utilities: `findFactors`, `findLowestCommonFactor`

#### Example usage:

```js
absValueFloor(-2.1)
// -2 (instead of -3 with Math.floor)

randomInRange(2, 5)
// 2, 3, 4, or 5

```
##
### 📦 Object Tools

Utilities for **cleaning**, **filtering**, **modifying**, and **reshaping** objects.

- inspect object entry types: `objEntryTypes`
- clean empty or unclear values: `fixEmptyVals`, `fixEmptyX`
- extract cleaned object data: `cleanEntries`, `cleanKeys`, `cleanValues`
- extract clear object data: `clearObjEntries`, `clearObjKeys`, `clearObjValues`
- filter object entries: `objFilter`
- modify object keys or values: `objModKeys`, `objModVals`
- safely select or exclude keys: `objPick`, `objOmit`

#### Example usage:

```js
fixEmptyVals({
  name: "",
  age: 32,
  city: "Munich"
})
// { age: 32, city: "Munich" }

objModKeys(
  { firstName: "Lina" },
  key => key.toUpperCase()
)
// { FIRSTNAME: "Lina" }

objPick(
  { name: "La", surname: "Gos" },
  ["name", "surname", "age"],
  "unknown"
)
// {
//   name: "La",
//   surname: "Gos",
//   age: "unknown"
// }
```

##
<a name="data-tools"></a>
### 🗂️ Data Tools

**Detect** and **parse structured data** easily & automatically.

- detect data formats: `stringDataCheck`, `findDataType`
- JSON detection: `isStructuredJSON`
- CSV parsing: `splitCSVRow`, `isCSVString`, `csvObjectify`
- conversion helpers: `csvToJSON`, `parseData`

#### Example usage:

```js
findDataType('{"name":"Lina"}')
// "json"

parseData("name,age\nLina,32")
// [{ name: "Lina", age: "32" }]

csvObjectify(
  'name,notes\nLina,"likes cats, coffee"'
)
// [
//   {
//     name: "Lina",
//     notes: "likes cats, coffee"
//   }
// ]

csvToJSON("name,age\nLina,32")
// '[{"name":"Lina","age":"32"}]'
```

##
### 🍬 Basic *SweetTypes*

A lightweight runtime type system designed for **plain JavaScript and TypeScript**.

> **Important:**  
> This is the **basic/internal** SweetTypes layer included with Sweet JS Tools.  
> It works entirely at runtime and **does NOT require TypeScript**.
>
> A more advanced standalone **Sweet Types** system is planned separately.

SweetTypes expands normal JavaScript type checks with:
- safer runtime validation
- more specific checks
- “usable value” detection
- cleaner handling of common JS edge cases

Includes:

- base type checks: `isString`, `isNumber`, `isBoolean`, `isObject`, `isNull`, `isUndefined`, `isBigInt`, `isFunction`
- precision checks: `isArray`, `isActualObj`, `isTrue`, `isFalse`, `isNumeric`
- strict/usable checks (`XTypes`): `isStringX`, `isObjectX`, `isArrayX`, `isNumberX`, `isSymbolX`
- value state helpers: `isNullish`, `isEmptyVal`, `isClearValue`
- type inspection helpers: `findSweetType`
- unified type checking: `sweetTypeCheck`

#### Example usage:
```js
isNumeric(" 12 ")
// true

isStringX("   ")
// false

findSweetType([1, 2])
// "arrayX"

isClearValue(false)
// false
```

