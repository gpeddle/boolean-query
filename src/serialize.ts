import {
  Condition,
  EqualCondition,
  NumericCondition,
  NonValueCondition,
  StringValueCondition,
  LogicalCondition
} from "./condition";

class ConditionSerializer {
  static serialize(condition: Condition): string {
    if (condition instanceof LogicalCondition) {
      const serializedConditions = condition.expressions
        .map((expr: Condition) => this.serialize(expr))
        .join(",");
      return `(${condition.operator}[${serializedConditions}])`;
    } else if (
      condition instanceof EqualCondition ||
      condition instanceof NumericCondition ||
      condition instanceof StringValueCondition
    ) {
      return `(${condition.property}^${condition.operator}^${condition.value})`;
    } else if (condition instanceof NonValueCondition) {
      return `(${condition.property}^${condition.operator})`;
    } else {
      throw new Error("Unknown condition type");
    }
  }
}

export { ConditionSerializer };

/* Example usage:
const complexCondition = new AndCondition([
  new GreaterThanCondition("age", 30),
  new OrCondition([
    new StartsWithCondition("name", "J"),
    new EndsWithCondition("name", "n"),
  ]),
  new NotCondition([new EqualCondition("employmentStatus", "unemployed")]),
]);

console.log(ConditionSerializer.serialize(complexCondition));

// produces: (AND[(age^GT^30),(OR[(name^SW^J),(name^EW^n)]),(NOT[(employmentStatus^EQ^unemployed)])])
*/