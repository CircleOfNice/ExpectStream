"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _sourceMapSupport2 = require("source-map-support");

var _lodash = require("lodash.isarray");

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require("lodash.isequal");

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require("lodash.isfunction");

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require("lodash.isnil");

var _lodash8 = _interopRequireDefault(_lodash7);

var _lodash9 = require("lodash.ismatch");

var _lodash10 = _interopRequireDefault(_lodash9);

var _chai = require("chai");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _sourceMapSupport2.install)();

var Expected = function () {
    (0, _createClass3.default)(Expected, null, [{
        key: "of",


        /**
         * Creates an ExpectationClass, that checks,
         * whether an incoming value matches the
         * expectations
         *
         * @param  {*}        args needed for creation
         * @return {Expected}
         */
        value: function of() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return new (Function.prototype.bind.apply(Expected, [null].concat(args)))();
        }

        /**
         * Constructor of Expected
         *
         * @constructor
         * @param       {*}      expected   compared with input
         * @param       {object} options    for custom matcning behaviour
         */

    }]);

    function Expected(expected, _ref) {
        var filter = _ref.filter,
            eventually = _ref.eventually,
            strict = _ref.strict;
        (0, _classCallCheck3.default)(this, Expected);

        this.messages = [];
        this.expection = (0, _lodash2.default)(expected) ? expected.slice(0) : expected;
        this.expected = expected;
        this.matcher = (0, _lodash8.default)(strict) ? _lodash10.default : _lodash4.default;
        this.onMisMatch = (0, _lodash8.default)(eventually) ? -1 : 0;
        this.filter = (0, _lodash8.default)(filter) ? function () {
            return true;
        } : filter;
    }

    /**
     * Checks if next value in list matches the input
     *
     * @param  {*}      value to be compared
     * @return {Number}
     */


    (0, _createClass3.default)(Expected, [{
        key: "includes",
        value: function includes(value) {
            var expected = this.expected.shift();
            var matches = this.matcher(value, expected);
            var onMatch = this.expected.length === 0 ? 1 : 0;

            this.expected = matches ? this.expected : [expected].concat(this.expected);

            return matches ? onMatch : this.onMisMatch;
        }

        /**
         * Compares input with expectations
         *
         * @param  {*}      value to be compared
         * @return {Number}
         */

    }, {
        key: "match",
        value: function match(value) {
            // eslint-disable-line
            this.messages.push(value);

            if (!this.filter(value)) return 0;
            if ((0, _lodash6.default)(this.expected)) return this.expected(value);
            if ((0, _lodash2.default)(this.expected)) return this.includes(value);

            return this.matcher(value, this.expected) ? 1 : this.onMisMatch;
        }

        /**
         * produces the error containing the expected vs actual results
         *
         * @return {Error}
         */

    }, {
        key: "getError",
        value: function getError() {
            if ((0, _lodash6.default)(this.expection)) return new Error("the messages " + (0, _stringify2.default)(this.messages) + " do not match your expectations.");

            try {
                (0, _chai.expect)(this.messages).to.eql(this.expection);

                return null;
            } catch (e) {
                return e;
            }
        }
    }]);
    return Expected;
}();

exports.default = Expected;

//# sourceMappingURL=Expected.js.map