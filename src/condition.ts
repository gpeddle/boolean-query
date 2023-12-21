// Enums for operators
enum EqualityOperator {
  EQ = "EQ",
  NE = "NE",
}
enum NumericOperator {
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

enum StringOperator {
  SW = "SW",
  CT = "CT",
  EW = "EW",
}

//  interface for base classes
interface Condition {
  evaluate(obj: any): boolean;
}

// equality classes
abstract class EqualityCondition implements Condition {
  constructor(
    public property: string,
    public operator: EqualityOperator,
    public value: any
  ) {}
  abstract evaluate(obj: any): boolean;
}

class EqualCondition extends EqualityCondition {
  constructor(property: string, value: any) {
    super(property, EqualityOperator.EQ, value);
  }
  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    return targetValue == this.value;
  }
}

class NotEqualCondition extends EqualityCondition {
  constructor(property: string, value: any) {
    super(property, EqualityOperator.NE, value);
  }
  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    return targetValue != this.value;
  }
}

// numeric classes
abstract class NumericCondition implements Condition {
  constructor(
    public property: string,
    public operator: NumericOperator,
    public value: number
  ) {}

  abstract evaluate(obj: any): boolean;

  protected checkTargetValueType(targetValue: any): void {
    if (typeof targetValue !== "number") {
      throw new Error(
        `Target value for property '${
          this.property
        }' must be a number. Received: ${typeof targetValue}`
      );
    }
  }
}

class LessThanCondition extends NumericCondition {
  constructor(property: string, value: number) {
    super(property, NumericOperator.LT, value);
  }

  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    this.checkTargetValueType(targetValue);

    return targetValue < this.value;
  }
}

class LessThanOrEqualCondition extends NumericCondition {
  constructor(property: string, value: number) {
    super(property, NumericOperator.LTE, value);
  }

  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    this.checkTargetValueType(targetValue);

    return targetValue <= this.value;
  }
}

class GreaterThanCondition extends NumericCondition {
  constructor(property: string, value: number) {
    super(property, NumericOperator.GT, value);
  }

  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    this.checkTargetValueType(targetValue);

    return targetValue > this.value;
  }
}

class GreaterThanOrEqualCondition extends NumericCondition {
  constructor(property: string, value: number) {
    super(property, NumericOperator.GTE, value);
  }

  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    this.checkTargetValueType(targetValue);

    return targetValue >= this.value;
  }
}

// non-value classes
abstract class NonValueCondition implements Condition {
  constructor(public property: string, public operator: NonValueOperator) {}
  abstract evaluate(obj: any): boolean;
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

// String classes
abstract class StringValueCondition implements Condition {
  constructor(
    public property: string,
    public operator: StringOperator,
    public value: any
  ) {}
  abstract evaluate(obj: any): boolean;
}

class StartsWithCondition extends StringValueCondition {
  constructor(property: string, value: string) {
    super(property, StringOperator.SW, value);
  }
  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    return targetValue.substring(0, this.value.length) == this.value;
  }
}

class ContainsCondition extends StringValueCondition {
  constructor(property: string, value: any) {
    super(property, StringOperator.CT, value);
  }
  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    return targetValue.includes(this.value);
  }
}

class EndsWithCondition extends StringValueCondition {
  constructor(property: string, value: any) {
    super(property, StringOperator.EW, value);
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

// Logical classes
abstract class LogicalCondition implements Condition {
  constructor(
    public operator: LogicalOperator,
    public expressions: Condition[]
  ) {}

  abstract evaluate(obj: any): boolean;
}

class AndCondition extends LogicalCondition {
  constructor(expressions: Condition[]) {
    super(LogicalOperator.AND, expressions);
  }
  evaluate(obj: any): boolean {
    return this.expressions.every((expr) => expr.evaluate(obj));
  }
}

class OrCondition extends LogicalCondition {
  constructor(expressions: Condition[]) {
    super(LogicalOperator.OR, expressions);
  }
  evaluate(obj: any): boolean {
    return this.expressions.some((expr) => expr.evaluate(obj));
  }
}

class NotCondition implements Condition {
  operator: any;
  constructor(
    public expression: Condition) {}
  evaluate(obj: any): boolean {
    return !this.expression.evaluate(obj);
  }
}

export {
  Condition,
  NumericCondition,
  NonValueCondition,
  StringValueCondition,
  LogicalCondition,
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
  AndCondition,
  OrCondition,
  NotCondition,
};

/* Example usage
let person = {
  FirstName: "John",
  MiddleName: "Quincy",
  LastName: "Public",
  TEXT1: "Orange",
  TEXT2: null,
};

const expression = new LogicalCondition(LogicalOperator.AND, [
  new Condition("TEXT1", ConditionalOperator.EQ, "Orange"),
]);

console.log(expression.evaluate(person)); // Should output true
*/
