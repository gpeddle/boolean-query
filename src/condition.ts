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

enum StringOperator {
  SW = "SW",
  CT = "CT",
  EW = "EW",
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

enum NotOperator {
  NOT = "NOT",
}

//  interface for base classes
interface Condition {
  evaluate(obj: any): boolean;
}

// equality classes
abstract class ComparisonCondition implements Condition {
  constructor(
    public property: string,
    public operator: EqualityOperator,
    public testValue: any
  ) {}
  abstract evaluate(obj: any): boolean;
}

class EqualCondition extends ComparisonCondition {
  constructor(property: string, testValue: any) {
    super(property, EqualityOperator.EQ, testValue);
  }
  evaluate(obj: any): boolean {
    const propertyValue = obj[this.property];
    return propertyValue == this.testValue;
  }
}

class NotEqualCondition extends ComparisonCondition {
  constructor(property: string, testValue: any) {
    super(property, EqualityOperator.NE, testValue);
  }
  evaluate(obj: any): boolean {
    const propertyValue = obj[this.property];
    return propertyValue != this.testValue;
  }
}

// numeric classes
abstract class NumericCondition implements Condition {
  // Assuming value is always treated as a number or a coercible string
  protected numericValue: number;

  constructor(
    public property: string,
    public operator: NumericOperator,
    public testValue: number | string
  ) {
    if (typeof testValue === "string" && isNaN(Number(testValue))) {
      throw new Error(`Value must be a number or a coercible string. Received: ${testValue}`);
    }
    this.numericValue = Number(testValue);
  }

  abstract evaluate(obj: any): boolean;
}

class LessThanCondition extends NumericCondition {
  constructor(property: string, testValue: number | string) {
    super(property, NumericOperator.LT, testValue);
  }

  evaluate(obj: any): boolean {
    const propertyValue: any = obj[this.property];
    return propertyValue < this.testValue;
  }
}

class LessThanOrEqualCondition extends NumericCondition {
  constructor(property: string, testValue: number | string) {
    super(property, NumericOperator.LTE, testValue);
  }

  evaluate(obj: any): boolean {
    const propertyValue = obj[this.property];
    return propertyValue <= this.testValue;
  }
}

class GreaterThanCondition extends NumericCondition {
  constructor(property: string, testValue: number | string) {
    super(property, NumericOperator.GT, testValue);
  }

  evaluate(obj: any): boolean {
    const propertyValue = obj[this.property];
    return propertyValue > this.testValue;
  }
}

class GreaterThanOrEqualCondition extends NumericCondition {
  constructor(property: string, testValue: number | string) {
    super(property, NumericOperator.GTE, testValue);
  }

  evaluate(obj: any): boolean {
    const propertyValue = obj[this.property];
    return propertyValue >= this.testValue;
  }
}

// String classes
abstract class StringValueCondition implements Condition {
  constructor(
    public property: string,
    public operator: StringOperator,
    public testValue: any
  ) {}
  abstract evaluate(obj: any): boolean;
}

class StartsWithCondition extends StringValueCondition {
  constructor(property: string, testValue: string) {
    super(property, StringOperator.SW, testValue);
  }
  evaluate(obj: any): boolean {
    const propertyValue = obj[this.property];
    return propertyValue.substring(0, this.testValue.length) == this.testValue;
  }
}

class ContainsCondition extends StringValueCondition {
  constructor(property: string, testValue: any) {
    super(property, StringOperator.CT, testValue);
  }
  evaluate(obj: any): boolean {
    const propertyValue = obj[this.property];
    return propertyValue.includes(this.testValue);
  }
}

class EndsWithCondition extends StringValueCondition {
  constructor(property: string, testValue: any) {
    super(property, StringOperator.EW, testValue);
  }
  evaluate(obj: any): boolean {
    const propertyValue = obj[this.property];
    return (
      propertyValue.substring(
        propertyValue.length - this.testValue.length,
        propertyValue.length
      ) == this.testValue
    );
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
    const propertyValue = obj[this.property];
    return propertyValue == null;
  }
}

class BlankCondition extends NonValueCondition {
  constructor(property: string) {
    super(property, NonValueOperator.BLANK);
  }
  evaluate(obj: any): boolean {
    const propertyValue = obj[this.property];
    return propertyValue == "";
  }
}

class EmptyCondition extends NonValueCondition {
  constructor(property: string) {
    super(property, NonValueOperator.EMPTY);
  }
  evaluate(obj: any): boolean {
    const propertyValue = obj[this.property];
    return propertyValue == null || propertyValue == undefined || propertyValue == "";
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

// Negation class
class NotCondition implements Condition {
  operator: NotOperator = NotOperator.NOT;
  constructor(public expression: Condition) {}
  evaluate(obj: any): boolean {
    return !this.expression.evaluate(obj);
  }
}

export {
  Condition,
  ComparisonCondition,
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
  EqualityOperator,
  NumericOperator,
  NonValueOperator,
  LogicalOperator,
  StringOperator,
  NotOperator,
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
