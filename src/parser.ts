// Enums for operators
enum ValueOperator {
  EQ = "EQ",
  NE = "NE",
  LT = "LT",
  LTE = "LTE",
  GT = "GT",
  GTE = "GTE",
}

enum NonValueOperator {
  NULL = "NULL",
  BLANK = "BLANK",
  EMPTY = "EMPTY",
}

enum LogicalOperator {
  AND = "AND",
  OR = "OR",
  NOT = "NOT",
}

enum StringValueOperator {
  SW = "SW",
  CT = "CT",
  EW = "EW",
}

// Base interface for conditions
interface Condition {
  evaluate(obj: any): boolean;
}

abstract class ValueCondition implements Condition {
  constructor(
    public property: string,
    public operator: ValueOperator,
    public value: any
  ) {
    let isValueOperator =
      this.operator == ValueOperator.EQ ||
      this.operator == ValueOperator.NE ||
      this.operator == ValueOperator.LT ||
      this.operator == ValueOperator.LTE ||
      this.operator == ValueOperator.GT ||
      this.operator == ValueOperator.GTE;
    if (!isValueOperator) {
      throw new Error(`Invalid ValueOperator: ${this.operator}`);
    }
  }
  abstract evaluate(obj: any): boolean;
}

abstract class NonValueCondition implements Condition {
  constructor(public property: string, public operator: NonValueOperator) {
    let isNonValueOperator =
      this.operator == NonValueOperator.NULL ||
      this.operator == NonValueOperator.BLANK ||
      this.operator == NonValueOperator.EMPTY;
    if (!isNonValueOperator) {
      throw new Error(
        `Invalid conditional non-value operator: ${this.operator}`
      );
    }
  }
  abstract evaluate(obj: any): boolean;
}

abstract class StringValueCondition implements Condition {
  constructor(
    public property: string,
    public operator: StringValueOperator,
    public value: any
  ) {
    let isStringValueOperator =
      this.operator == StringValueOperator.SW ||
      this.operator == StringValueOperator.CT ||
      this.operator == StringValueOperator.EW;
    if (!isStringValueOperator) {
      throw new Error(`Invalid isStringValueOperator: ${this.operator}`);
    }
  }
  abstract evaluate(obj: any): boolean;
}

class EqualCondition extends ValueCondition {
  constructor(property: string, value: any) {
    super(property, ValueOperator.EQ, value);
  }
  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    return targetValue == this.value;
  }
}

class NotEqualCondition extends ValueCondition {
  constructor(property: string, value: any) {
    super(property, ValueOperator.NE, value);
  }
  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    return targetValue != this.value;
  }
}

class LessThanCondition extends ValueCondition {
  constructor(property: string, value: any) {
    super(property, ValueOperator.LT, value);
  }
  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    return targetValue < this.value;
  }
}

class LessThanOrEqualCondition extends ValueCondition {
  constructor(property: string, value: any) {
    super(property, ValueOperator.LTE, value);
  }
  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    return targetValue <= this.value;
  }
}

class GreaterThanCondition extends ValueCondition {
  constructor(property: string, value: any) {
    super(property, ValueOperator.GT, value);
  }
  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    return targetValue > this.value;
  }
}

class GreaterThanOrEqualCondition extends ValueCondition {
  constructor(property: string, value: any) {
    super(property, ValueOperator.GTE, value);
  }
  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    return targetValue >= this.value;
  }
}

class NullCondition extends NonValueCondition {
  constructor(property: string) {
    super(property, NonValueOperator.NULL);
  }
  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    return targetValue == null;
  }
}

class BlankCondition extends NonValueCondition {
  constructor(property: string) {
    super(property, NonValueOperator.BLANK);
  }
  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    return targetValue == "";
  }
}

class EmptyCondition extends NonValueCondition {
  constructor(property: string, value: any) {
    super(property, NonValueOperator.EMPTY);
  }
  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    return targetValue == null || targetValue == undefined || targetValue == "";
  }
}

class StartsWithCondition extends StringValueCondition {
  constructor(property: string, value: string) {
    super(property, StringValueOperator.SW, value);
  }
  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    return targetValue.substring(0, this.value.length) == this.value;
  }
}

class ContainsCondition extends StringValueCondition {
  constructor(property: string, value: any) {
    super(property, StringValueOperator.CT, value);
  }
  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    return targetValue.includes(this.value);
  }
}

class EndsWithCondition extends StringValueCondition {
  constructor(property: string, value: any) {
    super(property, StringValueOperator.EW, value);
  }
  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    return (
      targetValue.substring(
        targetValue.length - this.value.length,
        targetValue.length
      ) == this.value
    );
  }
}

// LogicalExpression classes
class LogicalExpression implements Condition {
  constructor(
    public operator: LogicalOperator,
    public expressions: Condition[]
  ) {}

  evaluate(obj: any): boolean {
    switch (this.operator) {
      case LogicalOperator.AND:
        return this.expressions.every((expr) => expr.evaluate(obj));
      case LogicalOperator.OR:
        return this.expressions.some((expr) => expr.evaluate(obj));
      case LogicalOperator.NOT:
        return !this.expressions[0].evaluate(obj);
      default:
        throw new Error(`Unknown logical operator: ${this.operator}`);
    }
  }
}

class AndExpression extends LogicalExpression {
  constructor(expressions: Condition[]) {
    super(LogicalOperator.AND, expressions);
  }
}

class OrExpression extends LogicalExpression {
  constructor(expressions: Condition[]) {
    super(LogicalOperator.OR, expressions);
  }
}

class NotExpression extends LogicalExpression {
  constructor(expressions: Condition[]) {
    super(LogicalOperator.NOT, expressions);
  }
}

export {
  ValueOperator,
  NonValueOperator,
  StringValueOperator,
  LogicalOperator,
  Condition,
  ValueCondition,
  NonValueCondition,
  StringValueCondition,
  LogicalExpression,
  AndExpression,
  OrExpression,
  NotExpression,
  EqualCondition,
  NotEqualCondition,
  LessThanCondition,
  LessThanOrEqualCondition,
  GreaterThanCondition,
  GreaterThanOrEqualCondition,
  NullCondition,
  BlankCondition,
  EmptyCondition,
  StartsWithCondition,
  ContainsCondition,
  EndsWithCondition,
};

/* Example usage
let person = {
  FirstName: "John",
  MiddleName: "Quincy",
  LastName: "Public",
  TEXT1: "Orange",
  TEXT2: null,
};

const expression = new LogicalExpression(LogicalOperator.AND, [
  new Condition("TEXT1", ConditionalOperator.EQ, "Orange"),
]);

console.log(expression.evaluate(person)); // Should output true
*/
