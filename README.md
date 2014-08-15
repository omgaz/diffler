js-diff
=======
A basic JavaScript object comparison script that will iterate, recursivly, through two JSON objects to compare differences.

Code
----
Code can be found under `src` at [src/diff.js](src/diff.js). That's all you need to worry about. All the other files are for tests.

Params
------
`obj1` and `obj2` are two objects to be compared.

Return
------
Returns `false` if no differences are found.
Returns an `object` if differences are found. The object will maintain path structure where the value fot he changed key/value pair is highlighted by from and to fields.

Example
-------
	var x = { name: "omgaz", location: "London" };
	var y = { name: "omgaz", location: "Shoreditch, London" };

	getDiff(x, y);

	// Returns
	location: Object
		from: "London"
		to: "Shoreditch, London"

Tests
-----

[![Build Status](https://travis-ci.org/omgaz/js-diff.svg?branch=master)](https://travis-ci.org/omgaz/js-diff)

If you'd like to run tests, check out the whole project. You'll need NodeJS installed. Tests use Karma and PhantomJS.

	npm install
	npm test 
