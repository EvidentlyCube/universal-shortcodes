import {expect} from 'chai';
import 'mocha';
import {_universalShortcodes} from '../index';
import {Options} from "../src/common";

describe('compileShortcode - options validation', () => {
    it('Should disallow null shortcodeOpenCharacter', () => {
        runTest({shortcodeOpenCharacter: null});
    });
    it('Should disallow non-string shortcodeOpenCharacter', () => {
        runTest(<any>{shortcodeOpenCharacter: 5});
        runTest(<any>{shortcodeOpenCharacter: []});
        runTest(<any>{shortcodeOpenCharacter: {}});
        runTest(<any>{shortcodeOpenCharacter: NaN});
    });
    it('Should disallow 0 character shortcodeOpenCharacter', () => {
        runTest(<any>{shortcodeOpenCharacter: ''});
    });
    it('Should disallow 2+ character shortcodeOpenCharacter', () => {
        runTest(<any>{shortcodeOpenCharacter: 'ab'});
        runTest(<any>{shortcodeOpenCharacter: 'abc'});
        runTest(<any>{shortcodeOpenCharacter: 'abcsadasdhas'});
    });
    it('Should disallow null shortcodeCloseCharacter', () => {
        runTest({shortcodeCloseCharacter: null});
    });
    it('Should disallow non-string shortcodeCloseCharacter', () => {
        runTest(<any>{shortcodeCloseCharacter: 5});
        runTest(<any>{shortcodeCloseCharacter: []});
        runTest(<any>{shortcodeCloseCharacter: {}});
        runTest(<any>{shortcodeCloseCharacter: NaN});
    });
    it('Should disallow 0 character shortcodeCloseCharacter', () => {
        runTest(<any>{shortcodeCloseCharacter: ''});
    });
    it('Should disallow 2+ character shortcodeCloseCharacter', () => {
        runTest(<any>{shortcodeCloseCharacter: 'ab'});
        runTest(<any>{shortcodeCloseCharacter: 'abc'});
        runTest(<any>{shortcodeCloseCharacter: 'abcsadasdhas'});
    });
});

function runTest(options: Options): void{
    options = mergeOptions(options, _universalShortcodes.defaultOptions);
    expect(() => _universalShortcodes.validateOptions(options)).to.throw(Error);
}


function mergeOptions(options: Options, defaultOptions: Options): Options {
    const mergedOptions: Options = {};
    for (const key in defaultOptions) {
        mergedOptions[key] = options.hasOwnProperty(key) ? options[key] : defaultOptions[key];
    }

    return mergedOptions;
}