"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _sourceMapSupport2 = require("source-map-support");

var _stream = require("stream");

var _Expected = require("./Expected");

var _Expected2 = _interopRequireDefault(_Expected);

var _setDefaultValue = require("set-default-value");

var _setDefaultValue2 = _interopRequireDefault(_setDefaultValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _sourceMapSupport2.install)();

/**
 * this stream is used to be piped into.
 * it ends if the expected value was received.
 *
 * @author Marco Sliwa <marco@circle.ai>
 */
var AssertStream = function (_Writable) {
    (0, _inherits3.default)(AssertStream, _Writable);

    /**
     * constructor for this stream
     *
     * @constructor
     * @param       {*}      expected value
     * @param       {object} options  configuring the behaviour of AssertSream
     */
    function AssertStream(expected, options) {
        (0, _classCallCheck3.default)(this, AssertStream);

        var _this = (0, _possibleConstructorReturn3.default)(this, (AssertStream.__proto__ || (0, _getPrototypeOf2.default)(AssertStream)).call(this, {
            objectMode: true
        }));

        _this.expected = _Expected2.default.of(expected, options);
        _this.tapper = (0, _setDefaultValue2.default)(options.tapper).to(function () {});
        return _this;
    }

    /**
     * implementation of the write function. transforms data,
     * so that it can be compared, emits end on match, otherwise
     * continues.
     *
     * @param  {string|object} chunk of data
     * @param  {string}        enc   of data
     * @param  {function}      cb    when operation finished
     * @return {*}
     */


    (0, _createClass3.default)(AssertStream, [{
        key: "_write",
        value: function _write(chunk, enc, cb) {
            var _this2 = this;

            var data = Buffer.isBuffer(chunk) ? chunk.toString() : chunk;
            var result = this.expected.match(data);

            this.tapper(data, result);

            return result === -1 ? this.emit("error", this.expected.getError()) : setTimeout(function () {
                return result === 1 ? _this2.emit("done") : cb();
            }, 1);
        }
    }]);
    return AssertStream;
}(_stream.Writable);

exports.default = AssertStream;

//# sourceMappingURL=AssertStream.js.map