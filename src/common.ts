export type Dict = {
    [key: string]: string
}

export type Options = {
    shortcodeOpenCharacter?: string,
    shortcodeCloseCharacter?: string,
    [key: string]: string
};

export type RawToken = {
    type: "text" | "token",
    contents?: string,
    name?: string,
    arguments?: Dict,
    isClosing?: boolean
};

export type TreeToken = {
    type: "text" | "token",
    children?: TreeToken[],
    text?: string,
    name?: string,
    arguments?: Dict
};

export type ShortcodeCompileCallback = (shortcode: String, args: Dict, contents: string) => string;

const escapeRegexp = /[-\/\\^$*+?.()|[\]{}]/g;
export function escapeRegex(text:string): string
{
    return text.replace(escapeRegexp, '\\$&');
}