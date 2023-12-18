import {
    ConditionalOperator,
    LogicalOperator,
    //IExpression,
    Condition,
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
    LogicalExpression,
    AndExpression,
    OrExpression,
    NotExpression,
} from "../src/parser"; // Replace with the path to your DSL file

describe("Boolean Query Language DSL", () => {
    const testObject = {
        propA: "Hello World",
        propB: 10,
        propC: null,
        propD: "World",
    };

    describe("Conditional Operators", () => {

        test("EQ operator should evaluate to true when values are equal", () => {
            const condition = new EqualCondition("propA", "Hello World");
            expect(condition.evaluate(testObject)).toBeTruthy();
        });

        test("NE operator should evaluate to true when values are not equal", () => {
            const condition = new NotEqualCondition("propA", "Hello");
            expect(condition.evaluate(testObject)).toBeTruthy();
        });

        test("LT operator should evaluate to true when value is less than", () => {
            const condition = new LessThanCondition("propB", 20);
            expect(condition.evaluate(testObject)).toBeTruthy();
        });

        test("LTE operator should evaluate to true when value is less than or equal to", () => {
            const condition = new LessThanOrEqualCondition("propB", 10);
            expect(condition.evaluate(testObject)).toBeTruthy();
        });

        test("GT operator should evaluate to true when value is greater than", () => {
            const condition = new GreaterThanCondition("propB", 5);
            expect(condition.evaluate(testObject)).toBeTruthy();
        });

        test("GTE operator should evaluate to true when value is greater than or equal to", () => {
            const condition = new GreaterThanOrEqualCondition("propB", 10);
            expect(condition.evaluate(testObject)).toBeTruthy();
        });

        test("SW operator should evaluate to true when value starts with", () => {
            const condition = new StartsWithCondition("propA", "Hello");
            expect(condition.evaluate(testObject)).toBeTruthy();
        });

        test("CT operator should evaluate to true when value contains", () => {
            const condition = new ContainsCondition("propA", "World");
            expect(condition.evaluate(testObject)).toBeTruthy();
        });

        test("EW operator should evaluate to true when value ends with", () => {
            const condition = new EndsWithCondition("propA", "World");
            expect(condition.evaluate(testObject)).toBeTruthy();
        });

        test("NULL operator should evaluate to true when value is null", () => {
            const condition = new NullCondition("propC", null);
            expect(condition.evaluate(testObject)).toBeTruthy();
        });

        test("BLANK operator should evaluate to true when value is blank", () => {
            const condition = new BlankCondition("propC", null);
            expect(condition.evaluate(testObject)).toBeTruthy();
        });

        test("EMPTY operator should evaluate to true when value is empty", () => {
            const condition = new EmptyCondition("propC", null);
            expect(condition.evaluate(testObject)).toBeTruthy();
        });
    });

    describe("Logical Operators", () => {
        test("AND operator should evaluate to true when all conditions are true", () => {
            const expression = new LogicalExpression(LogicalOperator.AND, [
                new Condition("propA", ConditionalOperator.EQ, "Hello World"),
                new Condition("propB", ConditionalOperator.LT, 20),
            ]);
            expect(expression.evaluate(testObject)).toBeTruthy();
        });

        test("OR operator should evaluate to true when at least one condition is true", () => {
            const expression = new LogicalExpression(LogicalOperator.OR, [
                new Condition("propA", ConditionalOperator.EQ, "Goodbye"),
                new Condition("propB", ConditionalOperator.GT, 5),
            ]);
            expect(expression.evaluate(testObject)).toBeTruthy();
        });

        test("NOT operator should negate the result of its expression", () => {
            const expression = new LogicalExpression(LogicalOperator.NOT, [
                new Condition("propA", ConditionalOperator.EQ, "Goodbye"),
            ]);
            expect(expression.evaluate(testObject)).toBeTruthy();
        });
    });

    describe("Complex Expressions", () => {
        test("Nested logical expressions should evaluate correctly", () => {
            const expression = new AndExpression([
                new OrExpression([
                    new EqualCondition("propA", "Hello World"),
                    new EqualCondition("propD", "Universe"),
                ]),
                new NotExpression([
                    new NullCondition("propC"),
                ]),
            ]);
            expect(expression.evaluate(testObject)).toBeTruthy();
        });
    });

    describe("Error Handling", () => {
        test("Should throw error for unknown conditional operator", () => {
            const condition = new Condition(
                "propA",
                "UNKNOWN" as ConditionalOperator,
                "Value"
            );
            expect(() => condition.evaluate(testObject)).toThrow(
                "Unknown conditional operator"
            );
        });

        test("Should throw error for unknown logical operator", () => {
            const expression = new LogicalExpression(
                "UNKNOWN" as LogicalOperator,
                []
            );
            expect(() => expression.evaluate(testObject)).toThrow(
                "Unknown logical operator"
            );
        });
    });
});
