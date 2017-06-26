import isFunction from "lodash.isfunction";
import assert from "assert";
import AssertStream from "./AssertStream";
import defaults from "set-default-value";

const states = new WeakMap();
const get    = ctx => states.has(ctx) ? states.get(ctx) : {};
const set    = (ctx, x) => states.set(ctx, Object.assign(get(ctx), x));

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
        set(this._obj, {
            expected:       defaults(expected).to(get(this._obj).expected),
            strictEquality: true
        });
    }, function() {
        set(this._obj, {
            strictEquality: true
        });
    });

    Assertion.addChainableMethod("produce", function(expected) {
        set(this._obj, {
            expected: expected,
            args:     []
        });
    }, function() {
        set(this._obj, {
            args: []
        });
    });

    Assertion.addProperty("eventually", function() {
        set(this._obj, {
            checkAllResults: true
        });
    });

    Assertion.addMethod("filter", function(filter) {
        set(this._obj, {
            filterMethod: filter
        });
    });

    Assertion.addMethod("notify", function(done) {
        const sink = new AssertStream(get(this._obj).expected, {
            filter:     get(this._obj).filterMethod,
            tapper:     get(this._obj).tapper,
            eventually: get(this._obj).checkAllResults,
            strict:     get(this._obj).strictEquality
        });

        this._obj.pipe(sink)     // eslint-disable-line
            .on("done", done)
            .on("error", done);

        get(this._obj).args.forEach(arg => this._obj.write(arg)); // eslint-disable-line
    });

    Assertion.addMethod("tap", function(tapper) {
        set(this._obj, { tapper });
    });

    Assertion.addMethod("on", function(...args) {
        const { write } = this._obj; // eslint-disable-line

        assert((
            (args.length > 0 && isFunction(write)) ||
            (args.length === 0 && !isFunction(write))
        ), "You can only use arguments with a writable stream.");

        set(this._obj, { args });
    });
};

export default StreamHelper;
