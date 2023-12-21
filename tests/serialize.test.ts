import {
  Condition,
  EqualCondition,
  GreaterThanCondition,
  StartsWithCondition,
  EndsWithCondition,
  NotCondition,
  AndCondition,
  OrCondition,
} from "../src/condition";

import { ConditionSerializer } from "../src/serialize";

describe("ConditionSerializer", () => {
  test("should serialize EqualCondition correctly", () => {
    const condition = new EqualCondition("age", 30);
    expect(ConditionSerializer.serialize(condition)).toBe("(age^EQ^30)");
  });

  test("should serialize GreaterThanCondition correctly", () => {
    const condition = new GreaterThanCondition("salary", 50000);
    expect(ConditionSerializer.serialize(condition)).toBe("(salary^GT^50000)");
  });

  test("should serialize nested logical conditions correctly", () => {
    const condition = new AndCondition([
      new GreaterThanCondition("age", 30),
      new OrCondition([
        new StartsWithCondition("name", "J"),
        new EndsWithCondition("name", "n"),
      ]),
      new NotCondition(new EqualCondition("employmentStatus", "unemployed")),
    ]);
    const expected =
        "(AND[(age^GT^30),(OR[(name^SW^J),(name^EW^n)]),(NOT(employmentStatus^EQ^unemployed))])";
    expect(ConditionSerializer.serialize(condition)).toBe(expected);
  });

  test("should throw an error for unknown condition types", () => {
    const fakeCondition = { evaluate: () => true } as unknown as Condition;
    expect(() => ConditionSerializer.serialize(fakeCondition)).toThrow(
      "Unknown condition type"
    );
  });

  // Additional tests can be written for other condition types and edge cases
});
