# ExpectStream

Testing streams sucks. So we built this extension to chai to reduce the suck-factor of testing node streams.
Now, let's forget about all the drama and call it a victory:

![victory](http://www.quotesmeme.com/wp-content/uploads/2015/06/f60752b4481e83013217fa3d82f616bd.jpg "victory")

# API

As this module extends [chai](http://chaijs.com) most of the documentation can be found at their website. ExpectStream extends it with new methods for asserting streams asynchronously:

##### .produce
This method takes either one or multiple values, which are expected to be the only outputs produced by the stream under test or a function that takes the value and checks if it is the expected one. In the latter case, there are three values your callback should return to signal its state:

* If the function returns `0`, the input value is not the expected value, but does not represent an error case either. The test will go on (or timeout).

* If the function returns `1`, it's the signal that the correct value has finally arrived. The assertion will notify the test, that it is successful.

* If the function returns `-1`, it signals that the given input value is erroneous. We will be notified of the error via `notify`.

##### .eventually
This property allows ExpectStream to ignore mismatches until the correct values are produced.

#### .exactly
Using this chainable method will adjust the assertion configuration to strict equality. Otherwise ```ExpectStream``` validates, if the produced output contains the expected value. 

##### .filter
This method accepts a function, that can be used to ignore some outputs, which is signalled by returning ```false``` in this callback.

##### .on
This method takes the values the stream under test should use to produce its output, if it isn't only a readable stream.

##### .notify
This method is used to notify the testrunner if an error occurs or if the streams ended and have produced the expected message

##### .tap
With this method you can tap into the stream under test and inspect whats going on, if an error happens

# Usage

Suppose we have a transform stream, that adds a Mr. to the start of every value, that enters it:

```js
// src/Misterizer
import { Transform } from "stream";

export default class Misterizer extends Transform {
	_transform(name, enc, cb) {
		this.push(`Mr. ${name}`);
		cb();
	}
}
```

Now we'd like to test it, using mocha with ExpectStream:

```js
// src/__tests__/MisterizerTest
import { expect } from "core-assert";
import Misterizer from "../Misterizer"

describe("MisterizerTest", function() {
	// this test passes
	it("Misterizes Circle", function(done) {
		expect(new Misterizer())
			.to.exactly.produce("Mr. Circle")
			.on("Circle")
			.notify(done);
	});

	// this test will trigger a timeout
	it("Misterizes Square", function(done) {
		expect(new Misterizer())
			.to.eventually.produce("Mr. Circle")
			.on("Square")
			.tap(::console.log) // will print "Square, 0)"
			.notify(done);
	});
});
```
But the mighty power of ```ExpectStream``` offers much more functionality, which will be presented by FunnyBot: 
```js
// src/FunnyBot
import { Readable } from "stream";

export default class FunnyBot extends Readable {
	constructor(jokes) {
		super({ objectMode: true });
		
		this.jokes = jokes;
	}
	
	_read() {
		return this.push(this.jokes.shift());
	}
}
```
All that is missing now are some funny jokes:
```js
// src/__tests__/FunnyBotTest
import { expect } from "@circle/core-assert";
import FunnyBot from "../FunnyBot";

describe("FunnyBot", function() {
	it("tells multiple really funny jokes", function() {
		expect(new FunnyBot([{
			date: Date.now(),
			joke: "Hello, I am FunnyBot!"
		}, {
			date: Date.now(),
			joke: "I am not a joke"
		}, {
			date: Date.now(),
			joke: "What do you see when the Pillsbury Dough Boy bends over? Dough nuts"
		}]).filter(x => x.joke !== "I am not a joke").to.produce([{
			joke: "Hello, I am FunnyBot!" 
		}, {
			joke: "What do you see when the Pillsbury Dough Boy bends over? Dough nuts"
		}]).notify(done);
	});
	
	it("thinks about complex problems", function() {
		expect(new FunnyBot([{
			date: Date.now(),
			joke: "Hello, I am FunnyBot!"
		}, {
			date: Date.now(),
			joke: "I am not a joke"
		}, {
			date: Date.now(),
			joke: "The line is an imaginary invention of imperfect biological life forms."
		}]).to.eventually.produce([{
			joke: "Hello, I am FunnyBot!" 
		}, {
			joke: "The line is an imaginary invention of imperfect biological life forms."
		}]).notify(done);
	});
	
	it("writes up some new material", function() {
		expect(new FunnyBot([{
			firstTry: "Error. Error. Banal."
		}, {
			secondTry: "That has been done before."
		}, {
			lastTry: "Funnybot is now finished with final joke."
		}]).to.produce.exactly([{
			firstTry: "Error. Error. Banal."
		}, {
			secondTry: "That has been done before."
		}, {
			lastTry: "Funnybot is now finished with final joke."
		}]).notify(done);	
	});
});
```
# <a name="testing"></a>Testing

ExpectStream is tested with mocha by executing ```make test``` in the root directory of the project.

# Contributing

If you want to contribute to this repository, please ensure ...
  - to use ```make``` for development (it validates the source code and transpiles it to ```/lib```).
  - to follow the existing coding style.
  - to use the linting tools that are listed in the ```package.json``` (which you get for free when using ```make```).
  - to add and/or customize unit tests for any changed code.
  - to reference the corresponding issue in your pull request with a small description of your changes.

All contributors are listed in the ```AUTHORS``` file, sorted by the time of their first contribution.
