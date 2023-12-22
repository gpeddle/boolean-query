import {
  Condition,
  EqualCondition,
  NotEqualCondition,
  LessThanCondition,
  LessThanOrEqualCondition,
  GreaterThanCondition,
  GreaterThanOrEqualCondition,
  StartsWithCondition,
  ContainsCondition,
  EndsWithCondition,
  NullCondition,
  BlankCondition,
  EmptyCondition,
  AndCondition,
  OrCondition,
  NotCondition,
} from "../src/condition";

import { ConditionSerializer } from "../src/serialize";

describe("ConditionSerializer", () => {
  describe("Equality Expressions", () => {
    test("should serialize EqualCondition correctly", () => {
      const condition = new EqualCondition("Age", 30);
      expect(ConditionSerializer.serialize(condition)).toBe("(Age^EQ^30)");
    });

    test("should serialize NotEqualCondition correctly", () => {
      const condition = new NotEqualCondition("Age", 29);
      expect(ConditionSerializer.serialize(condition)).toBe("(Age^NE^29)");
    });
  });

  describe("Numeric Expressions", () => {
    test("should serialize LessThanCondition correctly", () => {
      const condition = new LessThanCondition("Salary", 49000);
      expect(ConditionSerializer.serialize(condition)).toBe(
        "(Salary^LT^49000)"
      );
    });

    test("should serialize LessThanOrEqualCondition correctly", () => {
      const condition = new LessThanOrEqualCondition("Salary", 50000);
      expect(ConditionSerializer.serialize(condition)).toBe(
        "(Salary^LTE^50000)"
      );
    });

    test("should serialize GreaterThanCondition correctly", () => {
      const condition = new GreaterThanCondition("Salary", 51000);
      expect(ConditionSerializer.serialize(condition)).toBe(
        "(Salary^GT^51000)"
      );
    });

    test("should serialize GreaterThanConditionOrEqual correctly", () => {
      const condition = new GreaterThanOrEqualCondition("Salary", 50000);
      expect(ConditionSerializer.serialize(condition)).toBe(
        "(Salary^GTE^50000)"
      );
    });
  });

  describe("String Expressions", () => {
    test("should serialize StartsWithCondition correctly", () => {
      const condition = new StartsWithCondition("FirstName", "J");
      expect(ConditionSerializer.serialize(condition)).toBe(
        "(FirstName^SW^J)"
      );
    });
    test("should serialize ContainsCondition correctly", () => {
      const condition = new ContainsCondition("FirstName", "oh");
      expect(ConditionSerializer.serialize(condition)).toBe(
        "(FirstName^CT^oh)"
      );
    });
    test("should serialize EndsWithCondition correctly", () => {
      const condition = new EndsWithCondition("FirstName", "ohn");
      expect(ConditionSerializer.serialize(condition)).toBe(
        "(FirstName^EW^ohn)"
      );
    });
  });

  describe("NonValue Expressions", () => {
    test("should serialize NullCondition correctly", () => {
      const condition = new NullCondition("MiddleName");
      expect(ConditionSerializer.serialize(condition)).toBe(
        "(MiddleName^NULL)"
      );
    });
    test("should serialize BlankCondition correctly", () => {
        const condition = new BlankCondition("MiddleName");
        expect(ConditionSerializer.serialize(condition)).toBe(
          "(MiddleName^BLANK)"
        );
      });
      test("should serialize EmptyCondition correctly", () => {
        const condition = new EmptyCondition("MiddleName");
        expect(ConditionSerializer.serialize(condition)).toBe(
          "(MiddleName^EMPTY)"
        );
      });
  });

  describe("Logical Expressions", () => {
    test("should serialize AndCondition correctly", () => {
        const condition = new AndCondition([
            new GreaterThanCondition("Age", 30),
            new StartsWithCondition("FirstName", "J")
        ]);
      expect(ConditionSerializer.serialize(condition)).toBe(
        "(AND[(Age^GT^30),(FirstName^SW^J)])"
      );
    });
    test("should serialize LessThanCondition correctly", () => {
        const condition = new OrCondition([
            new GreaterThanCondition("Age", 30),
            new StartsWithCondition("FirstName", "J")
        ]);
      expect(ConditionSerializer.serialize(condition)).toBe(
        "(OR[(Age^GT^30),(FirstName^SW^J)])"
      );
    });
  });

  describe("Complex Expressions", () => {
    test("should serialize nested logical conditions correctly", () => {
      const condition = new AndCondition([
        new GreaterThanCondition("Age", 30),
        new OrCondition([
          new StartsWithCondition("FirstName", "J"),
          new EndsWithCondition("FirstName", "n"),
        ]),
        new NotCondition(new EqualCondition("EmploymentStatus", "Unemployed")),
      ]);
      const expected =
        "(AND[(Age^GT^30),(OR[(FirstName^SW^J),(FirstName^EW^n)]),(NOT(EmploymentStatus^EQ^Unemployed))])";
      expect(ConditionSerializer.serialize(condition)).toBe(expected);
    });

    test("should throw an error for unknown condition types", () => {
      const fakeCondition = { evaluate: () => true } as unknown as Condition;
      expect(() => ConditionSerializer.serialize(fakeCondition)).toThrow(
        "Unknown condition type"
      );
    });
  });
});
