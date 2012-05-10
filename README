h1. js-diff
A basic JavaScript object comparison script that will iterate, recursivly, through two JSON objects to compare differences.

h2. Params
`obj1` and `obj2` are two objects to be compared.

h2. Return
Returns `false` if no differences are found.
Returns an `object` if differences are found. The object will maintain path structure where the value fot he changed key/value pair is highlighted by from and to fields.

h2. Example
var x = { name: "omgaz", location: "London" };
var y = { name: "omgaz", location: "Shoreditch, London" };

getDiff(x, y);

	location: Object
		from: "London"
		to: "Shoreditch, London"