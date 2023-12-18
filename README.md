# Boolean Query Language

A Domain-Specific Language (DSL) for Conditional Logic Evaluation

## Overview

This DSL allows you to define and evaluate complex conditional logic expressions. It is designed to be both human-readable and programmatically accessible, making it suitable for various use cases where conditional evaluations are required.

For a trivial example of how this works, consider a Javascript object:

```
let person = {
    firstName: 'John',
    lastNAme: 'Public',
    middleName: 'Quincy',
    TEXT1: 'Orange',
    TEXT2: null
}
```

A BooleanQuery expression can be written that will allow us to logically test this object's properties in a generic manner:

`[AND(TEXT1^EQ^Blue)]`

This expression will evaluate to `false`, because the object's `TEXT1` property is not the specified value.

## DSL Elements

There are three elements to the DSL:

- Conditions
- Conditional Operators
- Logical Operators

### Conditions

Conditions are the building blocks of expressions. They consist of a property, an operator, and a value. A condition evaluates whether a specific property of an object meets a certain criterion.

### Conditional Operators

- EQ: Equal
- NE: Not Equal
- LT: Less Than
- LTE: Less Than or Equal
- GT: Greater Than
- GTE: Greater Than or Equal
- NULL: Is Empty
- SW: Starts With
- CT: Contains
- EW: Ends With

### Logical Operators

- AND: Logical AND
- OR: Logical OR
- NOT: Logical NOT

## Expression Structure:

- Expressions are enclosed in square brackets [] at the root level. 
- Conditions, logical operators, and groups can be nested within expressions.
- Parentheses () can be used to define logical groupings and control precedence.

Each Condition is enclosed by parentheses, and the internal elements are delimited by '^'. This allows for trivial parsing. 

Note:
The value part of the expression does not need to be quoted, because it will always be found following a'^' and preceding the end parenthesis. For this reason, whitespace i significant within the parentheses of a Condition expression. This is an explicit design decision.

The internal parts of a Condition expression are structured with infix notation. This an explicit design decision that enables them to be easily spoken aloud when discussing. (e.g. `[AND(TEXT1^SW^O)])` would be spoken *"TEXT1 starts with 'O'"*.


## Examples:

### StartsWith

Expression: `[AND(property^SW^substring)]`
Description: Property's value must start with the specified substring.

### Contains

Expression: `[AND(property^CT^substring)]`
Description: Property's value must contain the specified substring.

### EndsWith

Expression: `[AND(property^EW^substring)]`
Description: Property's value must end with the specified substring.

### Logical AND

Expression: `[AND(property1^EQ^value1), EQ(property2^EQ^value2)]`
Description: Both conditions must be true for the expression to evaluate as true.

### Logical OR

Expression: `[OR(property1^EQ^value1), (property2^EQ^value2)]`
Description: Either condition must be true for the expression to evaluate as true.

### Logical NOT

Expression: `[NOT(property^EQ^value)]`
Description: Negates the condition, resulting in the opposite evaluation.

### Complex Expression

Expression: `[OR(prop1^EQ^val1), (AND(prop2^EQ^val2), NOT(EQ(prop3^EQ^val3))))]`
Description: A combination of conditions and logical operators, demonstrating nested expressions and negations.

## Usage

- Provides a clear and structured way to express complex conditional logic.
- Supports logical operators and nesting for building intricate expressions.
- Can be used for filtering, validation, or any scenario requiring conditional evaluations.
- Suitable for integration with user interfaces for visual expression construction.