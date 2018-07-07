import {TreeToken} from "./common";

export function compileTokenTree(tokenTree: TreeToken[], shortcodeCallback: (shortcode: String, args: {[key: string]:string}, contents: string) => string): string {
    const compiledTreeItems = tokenTree.map(token => {
        if (token.type === "text") {
            return token.text;
        }

        return shortcodeCallback(
            token.name,
            token.arguments,
            compileTokenTree(token.children, shortcodeCallback)
        );
    });

    return compiledTreeItems.join('');
}