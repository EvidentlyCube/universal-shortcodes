import {Options, RawToken, TreeToken} from "./common";

export function buildTokenTree(rawTokens: RawToken[], options: Options): TreeToken[] {
    const tokens: TreeToken[] = [];

    for (let i = 0; i < rawTokens.length; i++) {
        const token = rawTokens[i];
        if (token.type === "text") {
            tokens.push(convertText(token, options));
        } else if (token.type === "token") {
            tokens.push(convertToken(i, rawTokens, options));
        } else {
            // @todo throw an exception here
        }
    }

    return tokens;
}

function convertText(textToken: RawToken, options: Options): TreeToken {
    return {
        type: "text",
        text: textToken.contents
    };
}

function convertToken(index: number, rawTokens: RawToken[], options: Options): TreeToken {
    const token = rawTokens[index];
    const closingIndex = getClosingTokenIndex(index, rawTokens, options);

    if (closingIndex === null){
        return {
            type: "token",
            name: token.name,
            arguments: token.arguments,
            children: []
        };
    }

    rawTokens.splice(closingIndex, 1);

    return {
        type: "token",
        name: token.name,
        arguments: token.arguments,
        children: buildTokenTree(rawTokens.splice(index + 1, closingIndex - index - 1), options)
    };
}

function getClosingTokenIndex(startPoint: number, rawTokens: RawToken[], options: Options): number | null {
    const name = rawTokens[startPoint].name;
    let depth = 1;
    let index = startPoint;

    while (depth > 0 && ++index < rawTokens.length) {
        const token = rawTokens[index];
        if (token.type === "token" && token.name === name){
            depth += token.isClosing ? -1 : 1;
        }
    }

    return index < rawTokens.length ? index : null;
}