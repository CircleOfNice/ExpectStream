"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _weakMap = require("babel-runtime/core-js/weak-map");

var _weakMap2 = _interopRequireDefault(_weakMap);

var _sourceMapSupport2 = require("source-map-support");

var _lodash = require("lodash.isfunction");

var _lodash2 = _interopRequireDefault(_lodash);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _AssertStream = require("./AssertStream");

var _AssertStream2 = _interopRequireDefault(_AssertStream);

var _setDefaultValue = require("set-default-value");

var _setDefaultValue2 = _interopRequireDefault(_setDefaultValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _sourceMapSupport2.install)();


var states = new _weakMap2.default();
var get = function get(ctx) {
    return states.has(ctx) ? states.get(ctx) : {};
};
var set = function set(ctx, x) {
    return states.set(ctx, (0, _assign2.default)(get(ctx), x));
};

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
var StreamHelper = function StreamHelper(_ref) {
    var Assertion = _ref.Assertion;

    Assertion.addChainableMethod("exactly", function (expected) {
        set(this._obj, {
            expected: (0, _setDefaultValue2.default)(expected).to(get(this._obj).expected),
            strictEquality: true
        });
    }, function () {
        set(this._obj, {
            strictEquality: true
        });
    });

    Assertion.addChainableMethod("produce", function (expected) {
        set(this._obj, {
            expected: expected,
            args: []
        });
    }, function () {
        set(this._obj, {
            args: []
        });
    });

    Assertion.addProperty("eventually", function () {
        set(this._obj, {
            checkAllResults: true
        });
    });

    Assertion.addMethod("filter", function (filter) {
        set(this._obj, {
            filterMethod: filter
        });
    });

    Assertion.addMethod("notify", function (done) {
        var _this = this;

        var sink = new _AssertStream2.default(get(this._obj).expected, {
            filter: get(this._obj).filterMethod,
            tapper: get(this._obj).tapper,
            eventually: get(this._obj).checkAllResults,
            strict: get(this._obj).strictEquality
        });

        this._obj.pipe(sink) // eslint-disable-line
        .on("done", done).on("error", done);

        get(this._obj).args.forEach(function (arg) {
            return _this._obj.write(arg);
        }); // eslint-disable-line
    });

    Assertion.addMethod("tap", function (tapper) {
        set(this._obj, { tapper: tapper });
    });

    Assertion.addMethod("on", function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var write = this._obj.write; // eslint-disable-line

        (0, _assert2.default)(args.length > 0 && (0, _lodash2.default)(write) || args.length === 0 && !(0, _lodash2.default)(write), "You can only use arguments with a writable stream.");

        set(this._obj, { args: args });
    });
};

exports.default = StreamHelper;

//# sourceMappingURL=StreamHelper.js.map