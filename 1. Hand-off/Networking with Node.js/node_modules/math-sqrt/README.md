Square Root
===
[![NPM version][npm-image]][npm-url] [![Build Status][build-image]][build-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependencies][dependencies-image]][dependencies-url]

> Computes the principal [square root][square-root].

The principal [square root][square-root] is defined as

<div class="equation" align="center" data-raw-text="\sqrt{x^2} = \begin{matrix} x, &amp; \textrm{if}\ x \geq 0\end{matrix}" data-equation="eq:principal_square_root">
	<img src="https://cdn.rawgit.com/math-io/sqrt/8e7861b1a304c4589279000f58c7f044c9dfedde/docs/img/eqn.svg" alt="Principal square root definition.">
	<br>
</div>


## Installation

``` bash
$ npm install math-sqrt
```


## Usage

``` javascript
var sqrt = require( 'math-sqrt' );
```

#### sqrt( x )

Computes the principal [square root][square-root].

``` javascript
var val = sqrt( 4 );
// returns 2

val = sqrt( 9 );
// returns 3

val = sqrt( 0 );
// returns 0
```

For negative numbers, the principal [square root][square-root] is __not__ defined.

``` javascript
var val = sqrt( -4 );
// returns NaN
```


## Examples

``` javascript
var sqrt = require( 'math-sqrt' );

var x;
var i;

for ( i = 0; i < 100; i++ ) {
	x = Math.round( Math.random() * 100 );
	console.log( sqrt( x ) );
}
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


---
## Tests

### Unit

This repository uses [tape][tape] for unit tests. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul][istanbul] as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


### Browser Support

This repository uses [Testling][testling] for browser testing. To run the tests in a (headless) local web browser, execute the following command in the top-level application directory:

``` bash
$ make test-browsers
```

To view the tests in a local web browser,

``` bash
$ make view-browser-tests
```

<!-- [![browser support][browsers-image]][browsers-url] -->


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2016. The [Compute.io][compute-io] Authors.


[npm-image]: http://img.shields.io/npm/v/math-sqrt.svg
[npm-url]: https://npmjs.org/package/math-sqrt

[build-image]: http://img.shields.io/travis/math-io/sqrt/master.svg
[build-url]: https://travis-ci.org/math-io/sqrt

[coverage-image]: https://img.shields.io/codecov/c/github/math-io/sqrt/master.svg
[coverage-url]: https://codecov.io/github/math-io/sqrt?branch=master

[dependencies-image]: http://img.shields.io/david/math-io/sqrt.svg
[dependencies-url]: https://david-dm.org/math-io/sqrt

[dev-dependencies-image]: http://img.shields.io/david/dev/math-io/sqrt.svg
[dev-dependencies-url]: https://david-dm.org/dev/math-io/sqrt

[github-issues-image]: http://img.shields.io/github/issues/math-io/sqrt.svg
[github-issues-url]: https://github.com/math-io/sqrt/issues

[tape]: https://github.com/substack/tape
[istanbul]: https://github.com/gotwarlost/istanbul
[testling]: https://ci.testling.com

[compute-io]: https://github.com/compute-io/
[square-root]: https://en.wikipedia.org/wiki/Square_root
