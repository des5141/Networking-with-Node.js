# string-split
> A curried `String.prototype.split` with support for splitting by String, RegExp, or Function.

[![Build Status](http://img.shields.io/travis/wilmoore/string-split.js.svg)](https://travis-ci.org/wilmoore/string-split.js) [![Code Climate](https://codeclimate.com/github/wilmoore/string-split.js/badges/gpa.svg)](https://codeclimate.com/github/wilmoore/string-split.js) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

```shell
npm install string-split --save
```

###### npm stats

[![npm](https://img.shields.io/npm/v/string-split.svg)](https://www.npmjs.org/package/string-split) [![NPM downloads](http://img.shields.io/npm/dm/string-split.svg)](https://www.npmjs.org/package/string-split) [![Dependency Status](https://gemnasium.com/wilmoore/string-split.js.svg)](https://gemnasium.com/wilmoore/string-split.js)

## Examples

###### require

```js
var split = require('string-split');
```

###### full application

```js
split(".", "example.com");
//=> ["example", "com"]
```

###### partial application

```js
var undot = split('.')
undot('example.com');
//=> ["example", "com"]
```

###### iteratee

```js
var transform = split("::");
var foodtypes = ["Entree::Seafood", "Entree::Chicken"];

foodtypes.map(transform);
//=> [ ["Entree", "Seafood"], ["Entree", "Chicken"] ]
```

###### predicate

```js
function isNumber (chr, _) {
  return !!Number(chr)
}

split(isNumber, 'Hello1World2')
//=> ['Hello', 'World']
```

###### predicate using index

```js
function odd (chr, idx) {
  return idx % 2 !== 0
}

split(odd, 'AaBbCcDd')
//=> ['A', 'B', 'C', 'D']
```

## Features

 - Supports splitting by String, RegExp, or Function.
 - Curried.

## API

### `split(splitBy, string)`

###### arguments

 - `splitBy: (String|RegExp|Function)` String, RegExp, or Function to split by.
 - `string: (String)` String to split.

###### returns

 - `(Array)` List of split string parts.

###### splitBy function signature

> Return `true` to split by current `chr` or `idx`.

 - `chr: (String)` current character.
 - `idx: (Number)` current character index.

## License

[![GitHub license](https://img.shields.io/github/license/wilmoore/string-split.js.svg)](https://github.com/wilmoore/string-split.js/blob/master/license)
