import {Options, ShortcodeCompileCallback} from './src/common';
import {buildTokenTree} from "./src/buildTokenTree";
import {tokenizeString} from "./src/tokenizeString";
import {compileTokenTree} from "./src/compileTokenTree";

const defaultOptions: Options = {};

export function compileShortcodes(content: string, renderShortcode: ShortcodeCompileCallback, options?: Options): string {
    options = mergeOptions(options || {}, defaultOptions);

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

export const _universalShortcodes = {
    buildTokenTree,
    tokenizeString,
    compileTokenTree,
    defaultOptions
};