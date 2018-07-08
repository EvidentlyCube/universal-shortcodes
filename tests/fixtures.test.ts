import {expect} from 'chai';
import 'mocha';
import {compileShortcodes} from "../index";
import {readdirSync, readFileSync} from 'fs';


describe('parseShortcodes - fixture tests', () => {
    const fixutresPath = __dirname + "/fixtures/";
    const files = readdirSync(fixutresPath);

    files.forEach(file => {
        it(file, () => {
            const data = readFileSync(fixutresPath + file, {encoding: "utf8"});
            const [given, expected] = data.split('~~~~').map(s => s.trim());

            const result = compileShortcodes(given, defaultCallback);
            expect(result).to.equal(expected);
        });
    });
});

function defaultCallback(shortcode: String, args: { [key: string]: string }, contents: string): string {
    const argsArray = Object.keys(args).map(key => {
        return `data-${key}="${args[key]}"`;
    });

    let argsString = argsArray.join(' ');
    argsString = argsString ? ` ${argsString}` : '';

    if (contents) {
        return `<${shortcode}${argsString}>${contents}</${shortcode}>`;
    } else {
        return `<${shortcode}${argsString}/>`;
    }
}