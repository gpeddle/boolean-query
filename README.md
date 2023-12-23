<img src="https://github.com/gpeddle/boolean-query/blob/main/boolean-query-logo.png" width="200" height="200" alt="Boolean Query Language Logo">

# Boolean Query Language

A Domain-Specific Language (DSL) for Conditional Logic Evaluation

## Status

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=gpeddle_boolean-query&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=gpeddle_boolean-query)
[![Node.js CI](https://github.com/gpeddle/boolean-query/actions/workflows/ci.yml/badge.svg)](https://github.com/gpeddle/boolean-query/actions/workflows/ci.yml)

## Overview

This DSL allows you to define and evaluate complex conditional logic expressions. It is designed to be both human-readable and programmatically accessible, making it suitable for various use cases where conditional evaluations are required.

For an example of how this works, consider a Javascript object:

```
let person = {
    firstName: 'John',
    lastName: 'Public',
    middleName: 'Quincy',
    TEXT1: 'Orange',
    TEXT2: null
}
```

A BooleanQuery expression can be written that will allow us to logically test this object's properties in a generic manner:

`(TEXT1^EQ^Blue)`

This expression will evaluate to `false`, because the object's `TEXT1` property is not the specified value.

## DSL Elements

There are two elements to the DSL:

- Conditions
- Conditional Operators

An expression can be composed of any set of Conditions.

### Conditions

Conditions are the building blocks of expressions. A condition evaluates and returns true or false.

### Comparison Conditions

Consist of a property, an operator, and a value. A Comparison condition evaluates whether a specific property of an object meets a criterion based on trivial value comparison. Note that Javascript type coercion is applied where necessary.

- EQ: Equal
- NE: Not Equal

### Numeric Conditions

Consist of a property, an operator, and a value. A Numeric condition evaluates whether a specific property of an object meets a criterion based upon numerical comparison.

- LT: Less Than
- LTE: Less Than or Equal
- GT: Greater Than
- GTE: Greater Than or Equal

### String Conditions

Consist of a property, an operator, and a value. A String condition evaluates whether a specific property of an object meets a criterion based upon string comparison.

- SW: Starts With
- CT: Contains
- EW: Ends With

### NonValue Conditions

Consist of a property and an operator. A NonValue condition evaluates whether a specific property of an object matches some variety of emptiness.

- NULL: Is Null
- BLANK: Is Blank
- EMPTY: Is Null OR Is Blank

### Logical Conditions

Consist of an array of Conditions. The Conditions may be simple, or complextly nested. A Logical condition evaluates it's children in order from .

- AND: Logical AND
- OR: Logical OR

### Unary Conditions

Consist of a single Condition. A Unary condition evaluates its child and then applies its operator.

- NOT: Negates a single Condition

## Expression Structure:

- Expressions are enclosed in parentheses `()` at the root level. 
- Conditions, logical operators, and groups are nested within expressions.
- Square brackets `[]` are used to enclose and array of conditions governed by a logical operator. Commas are used to delimit the array of Conditions.
- Each Condition is enclosed by parentheses, and the internal elements are delimited by '^'. This allows for trivial parsing. 


## Notes

1. The internal parts of Comparison, Numeric and String Condition expressions are structured with infix notation. This enables them to be easily spoken aloud when discussing. (e.g. `(TEXT1^SW^Z)` would be spoken *"TEXT1 starts with 'Z'"*. This an explicit design decision.

2. The value part of Comparison, Numeric and String Condition expressions do not need to be quoted, because the value will always be found following a '^' character and preceding the end parenthesis. For this reason, whitespace is significant within the parentheses of a Condition expression. This is an explicit design decision.


## Examples:

### EqualsCondition

- Expression: `(property^EQ^value)`
- Description: Property's value must equal the specified value. (Note that this is Javascript ==, and type coercion will apply).

### NotEqualsCondition

- Expression: `(property^NE^value)`
- Description: Property's value must not equal the specified value. (Note that this is Javascript !=, and type coercion will apply).

### LessThanCondition

- Expression: `(property^LT^value)`
- Description: Property's value must be less than the specified numeric value.

### LessOrEqualThanCondition

- Expression: `(property^LTE^value)`
- Description: Property's value must be lss than opr equal to the specified numeric value.

### GreaterThanCondition

- Expression: `(property^GT^value)`
- Description: Property's value must be greater than the specified numeric value.

### StartsWithCondition

- Expression: `(property^SW^substring)`
- Description: Property's value must start with the specified substring.

### ContainsCondition

- Expression: `(property^CT^substring)`
- Description: Property's value must contain the specified substring.

### EndsWithCondition

- Expression: `(property^EW^substring)`
- Description: Property's value must end with the specified substring.

### NullCondition

- Expression: `(property^NULL)`
- Description: Property's value must be Null.

### BlankCondition

- Expression: `(property^BLANK)`
- Description: Property's value must be empty string.

### EmptyCondition

- Expression: `(property^EMPTY)`
- Description: Property's value must be either Null or Empty string.

### AndCondition

- Expression: `(AND[(property1^EQ^value1), (property2^EQ^value2)])`
- Description: Both conditions must be true for the expression to evaluate as true.

### OrCondition

- Expression: `(OR[(property1^EQ^value1), (property2^EQ^value2)])`
- Description: Either condition must be true for the expression to evaluate as true.

### NotCondition

- Expression: `(NOT(AND[(property1^EQ^value1),(property2^EQ^value2)]))`
- Description: Negates the condition, resulting in the opposite evaluation.

### Complex Expression

- Expression: `(OR[(prop1^EQ^val1),(prop2^EQ^val2),(NOT(prop3^EQ^val3))])`
- Description: A combination of conditions and logical operators, demonstrating nested expressions and negations.

## Use Cases

- Provides a clear and structured way to express complex conditional logic.
- Supports logical operators and nesting for building intricate expressions.
- Can be used for filtering, validation, or any scenario requiring conditional evaluations.
- Suitable for integration with user interfaces for visual expression construction.