# Universal Shortcodes

A universal parser for wordpress shortcodes, BBCode and related markup languages. It is (going to be) highly customizable but for now it should support out of the box everything that wordpress does.

# How to use

1. Install the library `npm i --save universal-shortcodes`
2. Import the library: 
	1. In Node.js with `var compileShortcodes = require('universal-shortcodes).compileShortcodes`
	2. In ES6 with `import {compileShortcodes} from 'universal-shortcodes';`
3. Call `compileShortcodes` passing your text and a callback handler for transforming shortcodes. The callback is defined below.

## `compileShortcodes` callback

The second argument of `compileShortcodes` is a callback that takes three arguments:
1. the name of the shortcode;
2. an object of arguments; named arguments have the key as specified; unnamed arguments are declared as keys 0, 1, 2... from the left;
3. contents of the shortcode, in case of self-closed shortcodes it's an empty string.

For example, given shortcode `[test "first" "second" value="val1" other="val2"]Inner text[/test]` the following arguments would be passed:

```javascript
shortcode = 'test'
args = {
  0: 'first',
  1: 'second',
  value: 'val1',
  other: 'val2'
}
contents = 'Inner text'
```

## Example usage

```javascript
import {compileShortcodes} from 'universal-shortcodes';

const text = 'Before anything [strong key="value"]inside strong[/duck] After everything';
const result = compileShortcodes(text, (shortcode, args, contents) => {
	const argsArray = Object.keys(args).map(key => {
		return `data-${key}="${args[key]}"`;
	});
	
	let argsString = argsArray.join(' ');
	argsString = argsString ? ` ${argsString}` : '';
	
	if (contents){
		return `<${shortcode}${argsString}>${contents}</${shortcode}>`;
	} else {
		return `<${shortcode}${argsString}/>`;
	}
});

console.log(result);
// Before anything <strong data-key="value"/>inside strong<duck/> After everything
```

## Internals

Internal methods are exposed via property `_universalShortcodes` - their APIs are unlikely to change should be safe to use if you ever feel a need to do it.

# Options

1. `shortcodeOpenCharacter (string 1 character)`, default `[` - specifies the character used as the opening of a shortcode.
1. `shortcodeCloseCharacter (string 1 character)`, default `]` - specifies the character used as the closing of a shortcode.

Currently the options object does not change anything.

# Todo:

1. Specifying delimiter characters for shortcodes
2. Specifying how to handle incorrectly nested shortcodes (crash)