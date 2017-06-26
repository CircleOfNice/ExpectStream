"use strict";

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

var _lodash = require("lodash.isarray");

var _lodash2 = _interopRequireDefault(_lodash);

var _index = require("../index");

var _stream = require("stream");

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _sourceMapSupport2.install)();

var ReadStream = function (_Readable) {
    (0, _inherits3.default)(ReadStream, _Readable);

    function ReadStream() {
        var messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "lala";
        var objectMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        (0, _classCallCheck3.default)(this, ReadStream);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ReadStream.__proto__ || (0, _getPrototypeOf2.default)(ReadStream)).call(this, { objectMode: objectMode }));

        _this.messages = messages;
        return _this;
    }

    (0, _createClass3.default)(ReadStream, [{
        key: "_read",
        value: function _read() {
            var message = (0, _lodash2.default)(this.messages) ? this.messages.shift() : this.messages;

            this.push(message);
        }
    }]);
    return ReadStream;
}(_stream.Readable);

var TransformStream = function (_Transform) {
    (0, _inherits3.default)(TransformStream, _Transform);

    function TransformStream() {
        (0, _classCallCheck3.default)(this, TransformStream);
        return (0, _possibleConstructorReturn3.default)(this, (TransformStream.__proto__ || (0, _getPrototypeOf2.default)(TransformStream)).apply(this, arguments));
    }

    (0, _createClass3.default)(TransformStream, [{
        key: "_transform",
        value: function _transform(chunk, enc, cb) {
            this.push(chunk);
            setTimeout(cb, 20);
        }
    }]);
    return TransformStream;
}(_stream.Transform);

var ReadObjectStream = function (_Readable2) {
    (0, _inherits3.default)(ReadObjectStream, _Readable2);

    function ReadObjectStream() {
        (0, _classCallCheck3.default)(this, ReadObjectStream);
        return (0, _possibleConstructorReturn3.default)(this, (ReadObjectStream.__proto__ || (0, _getPrototypeOf2.default)(ReadObjectStream)).call(this, {
            objectMode: true
        }));
    }

    (0, _createClass3.default)(ReadObjectStream, [{
        key: "_read",
        value: function _read() {
            this.push({
                test: {
                    test: []
                }
            });
        }
    }]);
    return ReadObjectStream;
}(_stream.Readable);

var TransformObjStream = function (_Transform2) {
    (0, _inherits3.default)(TransformObjStream, _Transform2);

    function TransformObjStream() {
        (0, _classCallCheck3.default)(this, TransformObjStream);
        return (0, _possibleConstructorReturn3.default)(this, (TransformObjStream.__proto__ || (0, _getPrototypeOf2.default)(TransformObjStream)).call(this, {
            objectMode: true
        }));
    }

    (0, _createClass3.default)(TransformObjStream, [{
        key: "_transform",
        value: function _transform(obj, enc, cb) {
            this.push(obj);
            setTimeout(cb, 20);
        }
    }]);
    return TransformObjStream;
}(_stream.Transform);

describe("ExpectStreamTest", function () {
    // eslint-disable-line
    it("uses the produce assertion with a readstream, matching exactly", function (done) {
        (0, _index.expect)(new ReadStream(["lala1", "lala2", "lala3"], false)).to.produce(["lala1", "lala2", "lala3"]).notify(done);
    });

    it("uses the produce assertion with a readstream, matching on strict equality", function (done) {
        (0, _index.expect)(new ReadStream({ test: "lala" })).to.exactly.produce({ test: "lala" }).notify(done);
    });

    it("uses the produce assertion with a readstream, matching on strict equality - part2", function (done) {
        (0, _index.expect)(new ReadStream({ test: "lala" })).to.produce.exactly({ test: "lala" }).notify(done);
    });

    it("uses the produce assertion with a readstream, containing at least key test", function (done) {
        (0, _index.expect)(new ReadStream({ test: "lala", another: "lulu" })).to.produce({ test: "lala" }).notify(done);
    });

    it("uses the produce assertion with a readstream, containing at least key test", function (done) {
        (0, _index.expect)(new ReadStream({ test: "lala" })).to.produce({ test: "lala", another: "lulu" }).notify(function (e) {
            return e ? done() : done(new Error("Shouldn't end up here."));
        });
    });

    it("uses the produce assertion with a readstream, matching exactly and fails", function (done) {
        var stream = new ReadStream(["lala1", "lala", "lala3"], false);

        (0, _index.expect)(stream).to.produce(["lala1", "lala2", "lala3"]).notify(function (e) {
            if (!e) return done(new Error("Should fail"));

            try {
                (0, _index.expect)(stream._readableState.ended).to.equal(false); // eslint-disable-line

                return done();
            } catch (e2) {
                return done(e2);
            }
        });
    });

    it("uses the produce assertion with a readstream, matching not exactly", function (done) {
        var stream = new ReadStream(["lala1", "lala", "lala2", "lala3"], false);

        (0, _index.expect)(stream).to.eventually.produce(["lala1", "lala2", "lala3"]).notify(function (e) {
            if (e) return done(e);

            try {
                (0, _index.expect)(stream._readableState.ended).to.equal(false); // eslint-disable-line

                return done();
            } catch (e2) {
                return done(e2);
            }
        });
    });

    it("uses the produce assertion with a readstream, matching exactly, but filtering some messages", function (done) {
        (0, _index.expect)(new ReadStream(["lala1", "lala", "lala2", "lala3"], false)).filter(function (value) {
            return value !== "lala";
        }).to.produce(["lala1", "lala2", "lala3"]).notify(done);
    });

    it("uses the eventually produce assertion with a readstream, producing buffers.", function (done) {
        (0, _index.expect)(new ReadStream()).to.eventually.produce("lala").notify(done);
    });

    it("uses the produce assertion with a readstream, producing objects.", function (done) {
        (0, _index.expect)(new ReadObjectStream()).to.eventually.produce({
            test: {
                test: []
            }
        }).notify(done);
    });

    it("fails the produce assertion on the readstream with buffers.", function (done) {
        (0, _index.expect)(new ReadStream()).to.eventually.produce("lulu").notify(function () {
            return done(new Error("should not finish"));
        });
        setTimeout(function () {
            return done();
        }, 20);
    });

    it("fails the produce assertion on the readstream with objects.", function (done) {
        (0, _index.expect)(new ReadStream()).to.eventually.produce({
            test: "test2"
        }).notify(function () {
            return done(new Error("should not finish"));
        });

        setTimeout(function () {
            return done();
        }, 20);
    });

    it("uses the produce assertion with a transformstream, producing buffers.", function (done) {
        (0, _index.expect)(new TransformStream()).to.eventually.produce("huhu").on("lala", "test", "huhu").notify(done);
    });

    it("uses the produce assertion with a transformstream, producing objects.", function (done) {
        (0, _index.expect)(new TransformObjStream()).to.eventually.produce({
            test: {
                test: []
            }
        }).on("lala", "test", "huhu", {
            test: {
                test: []
            }
        }).notify(done);
    });

    it("fails the produce assertion with a transformstream, producing buffers.", function (done) {
        (0, _index.expect)(new TransformStream()).to.eventually.produce("huhu").on("lala", "test").notify(function () {
            return done(new Error("should not finish"));
        });

        setTimeout(function () {
            return done();
        }, 70);
    });

    it("fails the produce assertion with a transformstream, producing objects.", function (done) {
        (0, _index.expect)(new TransformObjStream()).to.eventually.produce({
            test: {
                test: []
            }
        }).on("lala", "test", {
            test: {
                test: 1
            }
        }).notify(function () {
            return done(new Error("should not finish"));
        });

        setTimeout(function () {
            return done();
        }, 70);
    });

    it("tries to test a readstream with input", function (done) {
        try {
            (0, _index.expect)(new ReadStream()).to.eventually.produce("test").on("bla").notify(done);
        } catch (e) {
            _assert2.default.equal(e.message, "You can only use arguments with a writable stream.");
            done();
        }
    });

    it("tries to test a transformstream without input", function (done) {
        try {
            (0, _index.expect)(new TransformStream()).to.eventually.produce("test").on().notify(done);
        } catch (e) {
            _assert2.default.equal(e.message, "You can only use arguments with a writable stream.");
            done();
        }
    });

    it("uses the produce assertion with a transformstream, producing buffers.", function (done) {
        (0, _index.expect)(new TransformStream()).to.produce(function (x) {
            return x === "huhu" ? 1 : -1;
        }).on("lala", "test", "huhu").notify(function (e) {
            return e instanceof Error ? done() : done(new Error("should throw"));
        });
    });

    it("taps a stream under test.", function (done) {
        var spy = _sinon2.default.spy();

        (0, _index.expect)(new TransformStream()).to.eventually.produce("huhu").on("lala", "test", "huhu").tap(spy).notify(function () {
            try {
                (0, _index.expect)(spy.callCount).to.equal(3);
                (0, _index.expect)(spy.firstCall.args.shift()).to.equal("lala");
                (0, _index.expect)(spy.firstCall.args.shift()).to.equal(0);
                (0, _index.expect)(spy.secondCall.args.shift()).to.equal("test");
                (0, _index.expect)(spy.secondCall.args.shift()).to.equal(0);
                (0, _index.expect)(spy.thirdCall.args.shift()).to.equal("huhu");
                (0, _index.expect)(spy.thirdCall.args.shift()).to.equal(1);
                done();
            } catch (e) {
                done(e);
            }
        });
    });
});

//# sourceMappingURL=ExpectStreamTest.js.map