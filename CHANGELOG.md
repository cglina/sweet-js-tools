# Changelog

## 0.2.0

Refined and simplified the internal SweetTypes system.

### SweetTypes changes

- `array` is now treated as a first-class base type
- `object` now refers only to non-null, non-array objects
- removed `actualObj` and related legacy semantics
- `numeric` now only represents valid numeric strings
- `number` remains aligned with JavaScript number behavior
- `numberX` now clearly represents usable non-zero numbers

### Runtime type system improvements

- improved consistency between:
  - `BaseTypes`
  - `PrecisionTypes`
  - `XTypes`
- simplified Sweet type hierarchy and terminology
- updated `sweetType` behavior to align with new object/array separation
- improved runtime type dispatching and internal type checks

### Docs & tooling

- updated README examples and SweetTypes documentation
- cleaned outdated references across:
  - `dataTools`
  - `objectTools`
  - `arrayTools`
- improved comments and IntelliSense documentation consistency

## 0.1.0

Initial public release.

### Included
- array tools
- number tools
- string tools
- object tools
- data tools
- basic Sweet Types runtime system