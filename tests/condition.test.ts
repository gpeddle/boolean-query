import {
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
} from "../src/condition";

import { describe, test, expect } from "@jest/globals";

describe("Boolean Query Language DSL", () => {
  const testPerson = {
    FirstName: "John",
    MiddleName: "Quincy",
    LastName: "Public",
    Height: 72,
    propNull: null,
    propBlank: "",
  };

  describe("Equality Expressions", () => {
    test("EQ operator should evaluate to true when property is equal to value", () => {
      const condition = new EqualCondition("FirstName", "John");
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });

    test("NE operator should evaluate to true when property is not equal to value", () => {
      const condition = new NotEqualCondition("FirstName", "William");
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });
  });

  describe("Numeric Expressions", () => {

    test("LT operator should evaluate to true when property is less than numeric value", () => {
      const condition = new LessThanCondition("Height", 73);
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });

    test("LT operator should evaluate to true when property is less than coerced string value", () => {
      const condition = new LessThanCondition("Height", "73");
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });

    test("LT operator should throw Error when value is not a number or coercible string", () => {
      expect(() => {
        new LessThanCondition("Height", "foo");
      }).toThrowError(new Error("Value must be a number or a coercible string. Received: foo"));
    });

    test("LTE operator should evaluate to true when property is less than value", () => {
      const condition = new LessThanOrEqualCondition("Height", 73);
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });
    test("LTE operator should evaluate to true when property is equal to value", () => {
      const condition = new LessThanOrEqualCondition("Height", 72);
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });

    test("LTE operator should throw Error when value is not a number or coercible string", () => {
      expect(() => {
        new LessThanOrEqualCondition("Height", "foo");
      }).toThrowError(new Error("Value must be a number or a coercible string. Received: foo"));
    });

    test("GT operator should evaluate to true when property is greater than value", () => {
      const condition = new GreaterThanCondition("Height", 71);
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });

    test("GT operator should throw Error when value is not a number or coercible string", () => {
      expect(() => {
        new GreaterThanCondition("Height", "foo");
      }).toThrowError(new Error("Value must be a number or a coercible string. Received: foo"));
    });

    test("GTE operator should evaluate to true when property is greater than value", () => {
      const condition = new GreaterThanOrEqualCondition("Height", 71);
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });

    test("GTE operator should evaluate to true when property is equal to coercible value", () => {
      const condition = new GreaterThanOrEqualCondition("Height", "72");
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });

    test("GTE operator should throw Error when value is not a number or coercible string", () => {
      expect(() => {
        new GreaterThanOrEqualCondition("Height", "foo");
      }).toThrowError(new Error("Value must be a number or a coercible string. Received: foo"));
    });


  });

  describe("String Expressions", () => {
    test("SW operator should evaluate to true when property starts with value", () => {
      const condition = new StartsWithCondition("FirstName", "Jo");
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });

    test("CT operator should evaluate to true when property contains value", () => {
      const condition = new ContainsCondition("FirstName", "oh");
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });

    test("CT operator should evaluate to true when property equals value", () => {
      const condition = new ContainsCondition("FirstName", "John");
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });

    test("EW operator should evaluate to true when property ends with value", () => {
      const condition = new EndsWithCondition("FirstName", "hn");
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });
  });

  describe("Non-Value Expressions", () => {
    test("NULL operator should evaluate to true when property is null", () => {
      const condition = new NullCondition("propNull");
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });

    test("BLANK operator should evaluate to true when property is blank", () => {
      const condition = new BlankCondition("propBlank");
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });

    test("EMPTY operator should evaluate to true when property is empty string", () => {
      const condition = new EmptyCondition("propNull");
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });

    test("EMPTY operator should evaluate to true when property is empty string", () => {
      const condition = new EmptyCondition("propBlank");
      expect(condition.evaluate(testPerson)).toBeTruthy();
    });

  });

  describe("Logical Expressions", () => {
    test("AND operator should evaluate to true when all conditions are true", () => {
      const expression = new AndCondition([
        new EqualCondition("FirstName", "John"),
        new LessThanCondition("Height", 75),
      ]);
      expect(expression.evaluate(testPerson)).toBeTruthy();
    });

    test("OR operator should evaluate to true when at least one condition is true", () => {
      const expression = new OrCondition([
        new EqualCondition("FirstName", "John"),
        new GreaterThanCondition("Height", 55),
      ]);
      expect(expression.evaluate(testPerson)).toBeTruthy();
    });

    test("NOT operator should negate the result of its expression", () => {
      const expression = new NotCondition(
        new EqualCondition("FirstName", "Wokka Wokka"),
      );
      expect(expression.evaluate(testPerson)).toBeTruthy();
    });
  });

  describe("Negation Expressions", () => {
    test("NOT operator should negate the result of its expression", () => {
      const expression = new NotCondition(
        new EqualCondition("FirstName", "Wokka Wokka"),
      );
      expect(expression.evaluate(testPerson)).toBeTruthy();
    });
  });

  describe("Complex Expressions", () => {
    test("Nested logical expressions should evaluate correctly", () => {
      const expression = new AndCondition([
        new OrCondition([
          new EqualCondition("FirstName", "John"),
          new EqualCondition("LastName", "Public"),
        ]),
        new NotCondition(new NullCondition("MiddleName")),
      ]);
      expect(expression.evaluate(testPerson)).toBeTruthy();
    });

    test("Root NOT expressions should evaluate correctly", () => {
      const expression = new NotCondition(
        new AndCondition([
          new OrCondition([
            new EqualCondition("FirstName", "John"),
            new EqualCondition("LastName", "Public"),
          ]),
          new NotCondition(new GreaterThanCondition("Height", 71)),
        ]),
      );
      expect(expression.evaluate(testPerson)).toBeTruthy();
    });
  });

  describe("Error Handling", () => {});
});
