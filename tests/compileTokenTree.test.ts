import {expect} from 'chai';
import 'mocha';
import {compileShortcodes} from '../index';
import {Options} from "../src/common";

describe('compileShortcode', () => {
    const optionsList: Options[] = [
        {
            shortcodeOpenCharacter: '[',
            shortcodeCloseCharacter: ']'
        },
        {
            shortcodeOpenCharacter: '{',
            shortcodeCloseCharacter: '}'
        }
    ];

    optionsList.forEach(options => {
        describe(`${options.shortcodeOpenCharacter}${options.shortcodeCloseCharacter}`, () => {
            const L = options.shortcodeOpenCharacter;
            const R = options.shortcodeCloseCharacter;

            it("Just text", async () => {
                runTest(
                    'test',
                    'test',
                    options
                );
            });
            it("Just token", async () => {
                runTest(
                    `${L}button${R}`,
                    '<button/>',
                    options
                );
            });

            it("Token with text inside", async () => {
                runTest(
                    `${L}button${R}text${L}/button${R}`,
                    '<button>text</button>',
                    options
                );
            });

            it("Nested tokens with text inside", async () => {
                runTest(
                    `${L}button${R}${L}a${R}${L}/a${R}${L}/button${R}`,
                    '<button><a/></button>',
                    options
                );
            });

            it("Nested tokens with multiple children inside", async () => {
                runTest(
                    `${L}button${R}${L}a${R}${L}/a${R}${L}b${R}${L}/b${R}${L}c${R}${L}/c${R}${L}/button${R}`,
                    '<button><a/><b/><c/></button>',
                    options
                );
            });

            it("Token with arguments", async () => {
                runTest(
                    `${L}button 1 7 "duck" key="value" test="soup"${R}text${L}/button${R}`,
                    '<button data-0="1" data-1="7" data-2="duck" data-key="value" data-test="soup">text</button>',
                    options
                );
            });
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

function runTest(shortcodedText: string, expected: string, options: Options): void {
    const compiled = compileShortcodes(shortcodedText, defaultCallback, options);

    expect(compiled).to.equal(expected);
}