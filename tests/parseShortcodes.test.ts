import {expect} from 'chai';
import 'mocha';
import {_universalShortcodes} from "../index";

describe('parseShortcodes', () => {
    it("Just text", async () => {
        const result = parseShortcodes('Here is some text');
        isArray(result, 1);
        isTextNode(result[0], 'Here is some text');
    });

    it("One token", async () => {
        const result = parseShortcodes('[button]');
        isArray(result, 1);
        isTokenNode(result[0], 'button', {});
    });

    it("Two tokens", async () => {
        const result = parseShortcodes('[button][ravioli]');
        isArray(result, 2);
        isTokenNode(result[0], 'button', {});
        isTokenNode(result[1], 'ravioli', {});
    });

    it("Token surrounded by content", async () => {
        const result = parseShortcodes('Text [tok] letter');
        isArray(result, 3);
        isTextNode(result[0], 'Text ');
        isTokenNode(result[1], 'tok', {});
        isTextNode(result[2], ' letter');
    });

    it("Token that is closed", async () => {
        const result = parseShortcodes('[token][/token]');
        isArray(result, 1);
        isTokenNode(result[0], 'token', {});
        isArray(result[0].children, 0);
    });

    it("Token with text inside", async () => {
        const result = parseShortcodes('[token]text[/token]');
        isArray(result, 1);
        isTokenNode(result[0], 'token', {});
        isArray(result[0].children, 1);
        isTextNode(result[0].children[0], 'text');
    });

    it("Nested different token", async () => {
        const result = parseShortcodes('[a][b][/b][/a]');
        isArray(result, 1);
        isTokenNode(result[0], 'a', {});
        isArray(result[0].children, 1);
        isTokenNode(result[0].children[0], 'b', {});
        isArray(result[0].children[0].children, 0);
    });

    it("Nested same token", async () => {
        const result = parseShortcodes('[a][a][/a][/a]');
        isArray(result, 1);
        isTokenNode(result[0], 'a', {});
        isArray(result[0].children, 1);
        isTokenNode(result[0].children[0], 'a', {});
        isArray(result[0].children[0].children, 0);
    });

    it("One token with numeric argument", async () => {
        const result = parseShortcodes('[button 1]');
        isArray(result, 1);
        isTokenNode(result[0], 'button', {0: '1'});
    });

    it("One token with two numeric arguments", async () => {
        const result = parseShortcodes('[button 7 16]');
        isArray(result, 1);
        isTokenNode(result[0], 'button', {0: '7', 1: '16'});
    });

    it("One token with many numeric arguments", async () => {
        const result = parseShortcodes('[button 7 16 3 14 1]');
        isArray(result, 1);
        isTokenNode(result[0], 'button', {0: '7', 1: '16', 2: '3', 3: '14', 4: '1'});
    });

    it("One token with one string arguments", async () => {
        const result = parseShortcodes('[button "test"]');
        isArray(result, 1);
        isTokenNode(result[0], 'button', {0: 'test'});
    });

    it("One token with many string arguments", async () => {
        const result = parseShortcodes('[button "test" "duck" "pap"]');
        isArray(result, 1);
        isTokenNode(result[0], 'button', {0: 'test', 1: 'duck', 2: 'pap'});
    });

    it("One token with named argument", async () => {
        const result = parseShortcodes('[button test="value"]');
        isArray(result, 1);
        isTokenNode(result[0], 'button', {test: "value"});
    });

    it("One token with many named arguments", async () => {
        const result = parseShortcodes('[button test="value" luck="7" rock="712"]');
        isArray(result, 1);
        isTokenNode(result[0], 'button', {test: "value", luck: "7", rock: "712"});
    });

    it("One token with many named arguments and content inside", async () => {
        const result = parseShortcodes('[button test="value" luck="7" rock="712"]random text[/button]');
        isArray(result, 1);
        isTokenNode(result[0], 'button', {test: "value", luck: "7", rock: "712"});
        isArray(result[0].children, 1);
        isTextNode(result[0].children[0], 'random text');
    });
});

function parseShortcodes(content: string) {
    const rawTokens = _universalShortcodes.tokenizeString(content, _universalShortcodes.defaultOptions);
    return _universalShortcodes.buildTokenTree(rawTokens, _universalShortcodes.defaultOptions);
}

function isArray(token: any, length: number): void {
    expect(token).to.be.an('array').of.length(length);
}

function isTextNode(token: any, value: string): void {
    expect(token).to.be.an('object');
    expect(token).to.have.property('type', 'text');
    expect(token).to.have.property('text', value);
}

function isTokenNode(token: any, name: string, args: object,): void {
    expect(token).to.be.an('object');
    expect(token).to.have.property('type', 'token');
    expect(token).to.have.property('name', name);
    expect(token).to.have.property('arguments').to.deep.equal(args);
}