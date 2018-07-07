import {Options, RawToken} from "./common";

export function tokenizeString(text: string, options: Options): RawToken[] {
    const tokenSplitRegex = /(\[\/?.+?])/g;

    const segments: Array<string> = text.split(tokenSplitRegex);
    const tokens: RawToken[] = [];

    for (const segment of segments) {
        if (segment.length === 0) {
            continue;
        }

        tokens.push(convertSegment(segment, options));
    }

    return tokens;
}

function convertSegment(segment: string, options: Options): RawToken {
    if (segment.charAt(0) === '[' && segment.charAt(segment.length - 1) === ']') {
        return extractToken(segment, options);
    } else {
        return {
            type: "text",
            contents: segment
        };
    }
}

function extractToken(segment: string, options: Options): RawToken {
    const isClosing = segment.charAt(1) === '/';
    const name = extractTokenName(segment.substring(isClosing ? 2 : 1), options);
    const argumentsString = segment.substring((isClosing ? 2 : 1) + name.length + 1, segment.length - 1).replace(/]$/, '');

    return {
        type: "token",
        name: name,
        arguments: extractArguments(argumentsString, options),
        isClosing: isClosing

    };
}

function extractTokenName(segment: string, options: Options): string {
    const spaceIndex = segment.indexOf(' ');
    const closeIndex = segment.indexOf(']');

    return spaceIndex === -1
        ? segment.substr(0, closeIndex)
        : segment.substr(0, spaceIndex);
}

function extractArguments(argumentsString: string, options: Options): {[key: string]:string} {
    let [encodedArgsString, encodedQuotes] = encodeQuotesInArgumentsList(argumentsString, options);

    const args: any = {};
    let numericArgumentsCount = 0;

    const splitElements = encodedArgsString.split(' ');
    for (let element of splitElements) {
        const [key, value] = extractArgument(element, options);

        if (key === null && value !== null) {
            args[numericArgumentsCount++] = decodeArgument(value, encodedQuotes, options);
        } else if (value !== null){
            args[key] = decodeArgument(value, encodedQuotes, options);
        }
    }

    return args;
}

function encodeQuotesInArgumentsList(argumentsString: string, options: Options): [string, { [key: string]: string }] {
    const matchQuotesRegex = /"(.+?)"/g;
    const encodesList: any = {};
    let count = 0;

    argumentsString = argumentsString.replace(matchQuotesRegex, (match, group) => {
        const encoded = `<${count++}>`;
        encodesList[encoded] = group;
        return encoded;
    });

    return [argumentsString, encodesList];
}

function decodeArgument(key: string, list: { [key: string]: string }, options: Options): string {
    return list.hasOwnProperty(key)
        ? list[key]
        :key;
}

function extractArgument(argument: string, options: Options): [string | null, string] {
    if (argument === '') {
        return [null, null];
    }

    const split = argument.split('=');

    if (split.length === 1){
        return [null, split[0]];

    } else if (split.length === 2){
        return [split[0], split[1]];

    } else {
        // @todo handle incorrect argument
        return [null, null];
    }
}
