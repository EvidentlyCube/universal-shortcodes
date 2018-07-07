import {Options, ShortcodeCompileCallback} from './src/common';
import {buildTokenTree} from "./src/buildTokenTree";
import {tokenizeString} from "./src/tokenizeString";
import {compileTokenTree} from "./src/compileTokenTree";

const defaultOptions: Options = {
    shortcodeOpenCharacter: '[',
    shortcodeCloseCharacter: ']'
};

export function compileShortcodes(content: string, renderShortcode: ShortcodeCompileCallback, options?: Options): string {
    options = mergeOptions(options || {}, defaultOptions);

    validateOptions(options);

    const rawTokens = tokenizeString(content, options);
    const tokenTree = buildTokenTree(rawTokens, options);

    return compileTokenTree(tokenTree, renderShortcode);
}

function mergeOptions(options: Options, defaultOptions: Options): Options {
    const mergedOptions: Options = {};
    for (const key in defaultOptions) {
        mergedOptions[key] = options[key] || defaultOptions[key];
    }

    return mergedOptions;
}

function validateOptions(options: Options): void{
    if (typeof options.shortcodeOpenCharacter !== 'string'){
        throw new Error(`'shortcodeOpenCharacter' is of type '${typeof options.shortcodeOpenCharacter}' but it must be a string.`);
    } else if (options.shortcodeOpenCharacter.length !== 1){
        throw new Error(`'shortcodeOpenCharacter' is '${options.shortcodeOpenCharacter.length}' characters long but it must be exactly one character long. `);
    }
    if (typeof options.shortcodeCloseCharacter !== 'string'){
        throw new Error(`'shortcodeCloseCharacter' is of type '${typeof options.shortcodeCloseCharacter}' but it must be a string.`);
    } else if (options.shortcodeCloseCharacter.length !== 1){
        throw new Error(`'shortcodeCloseCharacter' is '${options.shortcodeCloseCharacter.length}' characters long but it must be exactly one character long. `);
    }
}

export const _universalShortcodes = {
    buildTokenTree,
    tokenizeString,
    compileTokenTree,
    validateOptions,
    defaultOptions
};