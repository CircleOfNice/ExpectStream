import isFunction from "lodash.isfunction";
import assert from "assert";
import AssertStream from "./AssertStream";
import defaults from "set-default-value";

/**
 * this function adds the new methods to the Assertion
 * chain, where they have the following responsibilities:
 *
 * produce: sets the expected value of the stream
 * on:      gives a set of input values, if testing
 *          a transformer
 * notify:  cb for error and done notifications
 *
 * @param {object} chai  to be extended
 */
const StreamHelper = function({ Assertion }) {
    Assertion.addChainableMethod("exactly", function(expected) {
        this.expected       = defaults(expected).to(this.expected);
        this.strictEquality = true;
    }, function() {
        this.strictEquality = true;
    });

    Assertion.addChainableMethod("produce", function(expected) {
        this.expected = expected;
        this.args     = [];
    }, function() {
        this.args = [];
    });

    Assertion.addProperty("eventually", function() {
        this.checkAllResults = true;
    });

    Assertion.addMethod("filter", function(filter) {
        this.filterMethod = filter;
    });

    Assertion.addMethod("notify", function(done) {
        const sink = new AssertStream(this.expected, {
            filter:     this.filterMethod,
            tapper:     this.tapper,
            eventually: this.checkAllResults,
            strict:     this.strictEquality
        });

        this._obj.pipe(sink)     // eslint-disable-line
            .on("done", done)
            .on("error", done);

        this.args.forEach(arg => this._obj.write(arg)); // eslint-disable-line
    });

    Assertion.addMethod("tap", function(tapper) {
        this.tapper = tapper;
    });

    Assertion.addMethod("on", function(...args) {
        const { write } = this._obj; // eslint-disable-line

        assert(
            (args.length > 0 && isFunction(write)) ||
            (args.length === 0 && !isFunction(write)
        ), "You can only use arguments with a writable stream.");

        this.args = args;
    });
};

export default StreamHelper;
