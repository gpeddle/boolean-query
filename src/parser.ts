// Enums for operators
enum ConditionalOperator {
  EQ = "EQ",
  NE = "NE",
  LT = "LT",
  LTE = "LTE",
  GT = "GT",
  GTE = "GTE",
  NULL = "NULL",
  BLANK = "BLANK",
  EMPTY = "EMPTY",
  SW = "SW",
  CT = "CT",
  EW = "EW",
}

enum LogicalOperator {
  AND = "AND",
  OR = "OR",
  NOT = "NOT",
}

// Base interface for expressions
interface IExpression {
  evaluate(obj: any): boolean;
}

// Condition classes
class Condition implements IExpression {
  constructor(
    public property: string,
    public operator: ConditionalOperator,
    public value: any
  ) {}

  evaluate(obj: any): boolean {
    const targetValue = obj[this.property];
    switch (this.operator) {
      case ConditionalOperator.EQ:
        return targetValue === this.value;
      case ConditionalOperator.NE:
        return targetValue !== this.value;
      case ConditionalOperator.LT:
        return targetValue < this.value;
      case ConditionalOperator.LTE:
        return targetValue <= this.value;
      case ConditionalOperator.GT:
        return targetValue > this.value;
      case ConditionalOperator.GTE:
        return targetValue >= this.value;
      case ConditionalOperator.NULL:
        return targetValue == null;
      case ConditionalOperator.SW:
        return targetValue.startsWith(this.value);
      case ConditionalOperator.CT:
        return targetValue.includes(this.value);
      case ConditionalOperator.EW:
        return targetValue.endsWith(this.value);
      default:
        throw new Error(`Unknown conditional operator: ${this.operator}`);
    }
  }
}

abstract class ValueCondition implements IExpression {
    constructor(
        public property: string,
        public operator: ConditionalOperator,
        public value: any
    ) {}

    abstract evaluate(obj: any): boolean;
}

abstract class NonValueCondition implements IExpression {
    constructor(
        public property: string,
        public operator: ConditionalOperator
    ) {}

    abstract evaluate(obj: any): boolean;
}


class EqualCondition extends Condition {
  constructor(property: string, value: any) {
    super(property, ConditionalOperator.EQ, value);
  }
}

class NotEqualCondition extends Condition {
  constructor(property: string, value: any) {
    super(property, ConditionalOperator.NE, value);
  }
}

class LessThanCondition extends Condition {
  constructor(property: string, value: any) {
    super(property, ConditionalOperator.LT, value);
  }
}

class LessThanOrEqualCondition extends Condition {
  constructor(property: string, value: any) {
    super(property, ConditionalOperator.LTE, value);
  }
}

class GreaterThanCondition extends Condition {
  constructor(property: string, value: any) {
    super(property, ConditionalOperator.GT, value);
  }
}

class GreaterThanOrEqualCondition extends Condition {
  constructor(property: string, value: any) {
    super(property, ConditionalOperator.GTE, value);
  }
}

class NullCondition extends Condition {
  constructor(property: string) {
    super(property, ConditionalOperator.NULL);
  }
}

class BlankCondition extends Condition {
  constructor(property: string) {
    super(property, ConditionalOperator.BLANK, value);
  }
}

class EmptyCondition extends Condition {
  constructor(property: string, value: any) {
    super(property, ConditionalOperator.EMPTY, value);
  }
}

class StartsWithCondition extends Condition {
  constructor(property: string, value: any) {
    super(property, ConditionalOperator.SW, value);
  }
}

class ContainsCondition extends Condition {
  constructor(property: string, value: any) {
    super(property, ConditionalOperator.CT, value);
  }
}

class EndsWithCondition extends Condition {
  constructor(property: string, value: any) {
    super(property, ConditionalOperator.EW, value);
  }
}

// LogicalExpression classes
class LogicalExpression implements IExpression {
  constructor(
    public operator: LogicalOperator,
    public expressions: IExpression[]
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
  constructor(expressions: IExpression[]) {
    super(LogicalOperator.AND, expressions);
  }
}

class OrExpression extends LogicalExpression {
  constructor(expressions: IExpression[]) {
    super(LogicalOperator.OR, expressions);
  }
}

class NotExpression extends LogicalExpression {
  constructor(expressions: IExpression[]) {
    super(LogicalOperator.NOT, expressions);
  }
}

export {
  ConditionalOperator,
  LogicalOperator,
  Condition,
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
// Example usage
let person = {
  firstName: "John",
  lastName: "Public",
  middleName: "Quincy",
  TEXT1: "Orange",
  TEXT2: null,
};

const expression = new LogicalExpression(LogicalOperator.AND, [
  new Condition("TEXT1", ConditionalOperator.EQ, "Orange"),
]);

console.log(expression.evaluate(person)); // Should output true
