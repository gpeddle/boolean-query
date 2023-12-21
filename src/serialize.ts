import {
    Condition,
    EqualityCondition,
    NumericCondition,
    NonValueCondition,
    StringValueCondition,
    LogicalCondition,
    AndCondition,
    OrCondition,
    NotCondition,
    GreaterThanCondition,
    StartsWithCondition,
    EndsWithCondition,
    EqualCondition,
  } from "./condition";
  
  class ConditionSerializer {
    static serialize(condition: Condition): string {
      if (condition instanceof LogicalCondition) {
        const serializedConditions = condition.expressions
          .map((expr: Condition) => this.serialize(expr))
          .join(",");
        return `[${condition.operator}(${serializedConditions})]`;
      } else if (
        condition instanceof EqualityCondition ||
        condition instanceof NumericCondition ||
        condition instanceof StringValueCondition
      ) {
        return `(${condition.property}^${condition.operator}^${condition.value})`;
      } else if (condition instanceof NonValueCondition) {
        return `(${condition.property}^${condition.operator}})`;
      } else {
        throw new Error("Unknown condition type");
      }
    }
  }