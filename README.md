<div align="center">
  <img src="stuff/AppIcon-readme.png" height="200" />
  <h1>diffler</h1>
  <p>
    <b>A recursive JSON comparison script for humans</b>
  </p>
  <br>
  <br>
</div>

## Motivation

To compare JSON objects containing asset metadata for a digital library. Upon change of any metadata, we'd store these changes as an audit trail and email asset stakeholders for review and approval of the changes.

## Dependencies

diffler is written with Node v12 in mind.
Tests depend on [Mocha](https://mochajs.org/).

## Usage

[![npm version](https://badge.fury.io/js/diffler.png)](https://www.npmjs.com/package/diffler)

```bash
npm install diffler
```

### Params

`obj1` and `obj2` are two JSON objects for comparison.

### Return

If same: returns `{}` _(empty object)_

If different: A JSON object with preserved path structure. The resulting values will be an object with `from` and `to` fields.

### Example

```js
const diffler = require("diffler");

const before = { name: "omgaz", location: "London" };
const after = { name: "omgaz", location: "Melbourne" };

const difference = diffler(before, after);
console.log(difference); // { location: { from: "London", to: "Melbourne" } }
```

## Options

> Experimental

```shell
npm i diffler@next
```

### `respectArrayOrder` defaults to `true`

If you don't care about the order of an array you can disable like so:

```js
const diffler = require("diffler");

const before = { name: "omgaz", locations: ["London", "Melbourne"] };
const after = { name: "omgaz", locations: ["Melbourne", "London"] };

const difference = diffler(before, after, { respectArrayOrder: false });
console.log(difference); // {}
```

However, be aware that additions and removals change the overall shape of the array and so will be seen as an entire array change AFTER the addition and removal.

```js
const diffler = require("diffler");

const before = { name: "omgaz", locations: ["London", "Hong Kong", "Melbourne"] };
const after = { name: "omgaz", locations: ["London", "Melbourne", "Hong Kong" ] };

const difference = diffler(before, after, { respectArrayOrder: false });
console.log(difference); // { locations: { 1: { from: "Hong Kong", to: "Melbourne" }, 2: { from: "Melbourne", to: "Hong Kong" }
```

My advice is to use associative arrays if you do not care about order.

```js
const diffler = require("diffler");

const before = { name: "omgaz", locations: { Melbourne: "Melbourne", London: "London" } };
const after = { name: "omgaz", locations: { London: "London", Melbourne: "Melbourne" } };

const difference = diffler(before, after, { respectArrayOrder: false });
console.log(difference); // { }
```

Maybe in the future, diffler will do this internally and be able to return array new array indexes for these values, it is still my current belief that arrays are ordered and should preserve order.

## Tests

[![Build Status](https://travis-ci.org/omgaz/diffler.svg?branch=master)](https://travis-ci.org/omgaz/diffler)

If you'd like to run tests, check out the whole project. You'll need NodeJS installed. Tests use Mocha.

```bash
  npm install
  npm test
```
