"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require("lodash.isfunction");

var _lodash2 = _interopRequireDefault(_lodash);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _AssertStream = require("./AssertStream");

var _AssertStream2 = _interopRequireDefault(_AssertStream);

var _setDefaultValue = require("set-default-value");

var _setDefaultValue2 = _interopRequireDefault(_setDefaultValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        this.expected = (0, _setDefaultValue2.default)(expected).to(this.expected);
        this.strictEquality = true;
    }, function () {
        this.strictEquality = true;
    });

    Assertion.addChainableMethod("produce", function (expected) {
        this.expected = expected;
        this.args = [];
    }, function () {
        this.args = [];
    });

    Assertion.addProperty("eventually", function () {
        this.checkAllResults = true;
    });

    Assertion.addMethod("filter", function (filter) {
        this.filterMethod = filter;
    });

    Assertion.addMethod("notify", function (done) {
        var _this = this;

        var sink = new _AssertStream2.default(this.expected, {
            filter: this.filterMethod,
            tapper: this.tapper,
            eventually: this.checkAllResults,
            strict: this.strictEquality
        });

        this._obj.pipe(sink) // eslint-disable-line
        .on("done", done).on("error", done);

        this.args.forEach(function (arg) {
            return _this._obj.write(arg);
        }); // eslint-disable-line
    });

    Assertion.addMethod("tap", function (tapper) {
        this.tapper = tapper;
    });

    Assertion.addMethod("on", function () {
        var write = this._obj.write; // eslint-disable-line

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        (0, _assert2.default)(args.length > 0 && (0, _lodash2.default)(write) || args.length === 0 && !(0, _lodash2.default)(write), "You can only use arguments with a writable stream.");

        this.args = args;
    });
};

exports.default = StreamHelper;

//# sourceMappingURL=StreamHelper.js.map