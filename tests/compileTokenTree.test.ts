import {expect} from 'chai';
import 'mocha';
import {compileShortcodes} from '../index';

describe('compileTokenTree', () => {
    it("Just text", async () => {
        runTest(
            'test',
            'test'
        );
    });
    it("Just token", async () => {
        runTest(
            '[button]',
            '<button/>'
        );
    });

    it("Token with text inside", async () => {
        runTest(
            '[button]text[/button]',
            '<button>text</button>'
        );
    });

    it("Nested tokens with text inside", async () => {
        runTest(
            '[button][a][/a][/button]',
            '<button><a/></button>'
        );
    });

    it("Nested tokens with multiple children inside", async () => {
        runTest(
            '[button][a][/a][b][/b][c][/c][/button]',
            '<button><a/><b/><c/></button>'
        );
    });

    it("Token with arguments", async () => {
        runTest(
            '[button 1 7 "duck" key="value" test="soup"]text[/button]',
            '<button data-0="1" data-1="7" data-2="duck" data-key="value" data-test="soup">text</button>'
        );
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

function runTest(shortcodedText: string, expected: string): void {
    const compiled = compileShortcodes(shortcodedText, defaultCallback);

    expect(compiled).to.equal(expected);
}