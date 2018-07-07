export type Dict = {
    [key: string]: string
}

export type Options = {
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