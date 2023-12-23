
enum TokenType {
    OpenParenthesis = 1,
    CloseParenthesis = 2,
    OpenBracket = 3,
    CloseBracket = 4,
    Operator = 5,
    Operand = 6,
    Separator = 7,
    Delimiter = 8,
}

interface TokenObject {
    type: TokenType;
    value: string;
}

function tokenize(expression: string): TokenObject[] {
    const tokens: TokenObject[] = [];
    const tokenRegex = /\(|\)|\[|\]|\^|,|EQ|NE|LT|LTE|GT|GTE|SW|CT|EW|NULL|BLANK|EMPTY|AND|OR|NOT|[\w]+|^\^+/g;

    let match: RegExpExecArray | null;
    while ((match = tokenRegex.exec(expression)) !== null) {
        tokens.push(createTokenObject(match[0]));
    }

    return tokens;
}

function createTokenObject(token: string): TokenObject {
    let type: TokenType;

    switch (token) {
        case '(':
            type = TokenType.OpenParenthesis;
            break;
        case ')':
            type = TokenType.CloseParenthesis;
            break;
        case '[':
            type = TokenType.OpenBracket;
            break;
        case ']':
            type = TokenType.CloseBracket;
            break;
        case '^':
            type = TokenType.Separator;
            break;
        case ',':
                type = TokenType.Delimiter;
                break;
        default:
            if (token.match(/EQ|NE|LT|LTE|GT|GTE|SW|CT|EW|NULL|BLANK|EMPTY|AND|OR|NOT/)) {
                type = TokenType.Operator;
            } else {
                type = TokenType.Operand;
            }
    }

    return { type, value: token };
}

export { tokenize, TokenObject, TokenType };

/*
// Example usage
const exampleExpression = "(TEXT1^EQ^Blue)";
console.log(tokenize(exampleExpression));
*/