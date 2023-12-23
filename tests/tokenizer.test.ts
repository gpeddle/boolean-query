import { tokenize, TokenObject, TokenType } from "../src/tokenizer";

describe("Tokenizer", () => {
  it("should tokenize an empty string into an empty array", () => {
    expect(tokenize("")).toEqual([]);
  });

  it("should tokenize a simple comparison condition", () => {
    const expression = "(TEXT1^EQ^Blue)";
    const expected: TokenObject[] = [
      { type: TokenType.OpenParenthesis, value: "(" },
      { type: TokenType.Operand, value: "TEXT1" },
      { type: TokenType.Separator, value: "^" },
      { type: TokenType.Operator, value: "EQ" },
      { type: TokenType.Separator, value: "^" },
      { type: TokenType.Operand, value: "Blue" },
      { type: TokenType.CloseParenthesis, value: ")" },
    ];
    const received: TokenObject[] = tokenize(expression);
    expect(received).toEqual(expected);
  });

  it("should tokenize a complex expression with logical operators", () => {
    const expression =
      "(AND[(age^GT^30),(OR[(name^SW^J),(name^EW^n)]),(NOT(employmentStatus^EQ^unemployed))])";
    const expected: TokenObject[] = [
      { type: TokenType.OpenParenthesis, value: "(" },
      { type: TokenType.Operator, value: "AND" },
      { type: TokenType.OpenBracket, value: "[" },
      { type: TokenType.OpenParenthesis, value: "(" },
      { type: TokenType.Operand, value: "age" },
      { type: TokenType.Separator, value: "^" },
      { type: TokenType.Operator, value: "GT" },
      { type: TokenType.Separator, value: "^" },
      { type: TokenType.Operand, value: "30" },
      { type: TokenType.CloseParenthesis, value: ")" },
      { type: TokenType.Delimiter, value: "," },
      { type: TokenType.OpenParenthesis, value: "(" },
      { type: TokenType.Operator, value: "OR" },
      { type: TokenType.OpenBracket, value: "[" },
      { type: TokenType.OpenParenthesis, value: "(" },
      { type: TokenType.Operand, value: "name" },
      { type: TokenType.Separator, value: "^" },
      { type: TokenType.Operator, value: "SW" },
      { type: TokenType.Separator, value: "^" },
      { type: TokenType.Operand, value: "J" },
      { type: TokenType.CloseParenthesis, value: ")" },
      { type: TokenType.Delimiter, value: "," },
      { type: TokenType.OpenParenthesis, value: "(" },
      { type: TokenType.Operand, value: "name" },
      { type: TokenType.Separator, value: "^" },
      { type: TokenType.Operator, value: "EW" },
      { type: TokenType.Separator, value: "^" },
      { type: TokenType.Operand, value: "n" },
      { type: TokenType.CloseParenthesis, value: ")" },
      { type: TokenType.CloseBracket, value: "]" },
      { type: TokenType.CloseParenthesis, value: ")" },
      { type: TokenType.Delimiter, value: "," },
      { type: TokenType.OpenParenthesis, value: "(" },
      { type: TokenType.Operator, value: "NOT" },
      { type: TokenType.OpenParenthesis, value: "(" },
      { type: TokenType.Operand, value: "employmentStatus" },
      { type: TokenType.Separator, value: "^" },
      { type: TokenType.Operator, value: "EQ" },
      { type: TokenType.Separator, value: "^" },
      { type: TokenType.Operand, value: "unemployed" },
      { type: TokenType.CloseParenthesis, value: ")" },
      { type: TokenType.CloseParenthesis, value: ")" },
      { type: TokenType.CloseBracket, value: "]" },
      { type: TokenType.CloseParenthesis, value: ")" },
    ];
    const received: TokenObject[] = tokenize(expression);
    console.log(received);
    expect(received).toEqual(expected);
  });

  it("should tokenize incorrect syntax as-is", () => {
    const expression = "(age^GT30)";
    const expected: TokenObject[] = [
      { type: TokenType.OpenParenthesis, value: "(" },
      { type: TokenType.Operand, value: "age" },
      { type: TokenType.Separator, value: "^" },
      { type: TokenType.Operator, value: "GT" },
      { type: TokenType.Operand, value: "30" },
      { type: TokenType.CloseParenthesis, value: ")" },
    ];
    const received: TokenObject[] = tokenize(expression);
    expect(received).toEqual(expected);
  });

});
