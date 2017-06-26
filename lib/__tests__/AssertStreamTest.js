"use strict";

var _sourceMapSupport2 = require("source-map-support");

var _AssertStream = require("../AssertStream");

var _AssertStream2 = _interopRequireDefault(_AssertStream);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _sourceMapSupport2.install)();


describe("AssertStreamTest", function () {
    it("writes to an assert stream with a value expectation, until it ends with the expected value.", function (done) {
        var tapSpy = _sinon2.default.spy();
        var onEnd = _sinon2.default.spy();
        var stream = new _AssertStream2.default({
            test: "test"
        }, {
            tapper: tapSpy,
            eventually: true
        });

        stream.on("done", onEnd);

        stream.write("bla");
        stream.write({});
        stream.write({
            test: "test"
        });

        setTimeout(function () {
            (0, _chai.expect)(onEnd.callCount).to.equal(1);
            (0, _chai.expect)(tapSpy.firstCall.args.shift()).to.equal("bla");
            (0, _chai.expect)(tapSpy.firstCall.args.shift()).to.equal(0);
            (0, _chai.expect)(tapSpy.secondCall.args.shift()).to.eql({});
            (0, _chai.expect)(tapSpy.secondCall.args.shift()).to.equal(0);
            (0, _chai.expect)(tapSpy.thirdCall.args.shift()).to.eql({
                test: "test"
            });
            (0, _chai.expect)(tapSpy.thirdCall.args.shift()).to.equal(1);
            (0, _chai.expect)(stream._writableState.ended).to.equal(false); // eslint-disable-line
            done();
        }, 20);
    });

    it("writes to an assert stream with a function expectation, until it ends with the expected value.", function (done) {
        var onEnd = _sinon2.default.spy();
        var stream = new _AssertStream2.default(function (x) {
            return x.test === "test" ? 1 : 0;
        }, {});

        stream.on("done", onEnd);

        stream.write("bla");
        stream.write({});
        stream.write({
            test: "test"
        });

        setTimeout(function () {
            (0, _chai.expect)(onEnd.callCount).to.equal(1);
            (0, _chai.expect)(stream._writableState.ended).to.equal(false); // eslint-disable-line
            done();
        }, 20);
    });

    it("writes to an assert stream with a function expectation, until it ends with the expected value.", function (done) {
        var tapSpy = _sinon2.default.spy();
        var stream = new _AssertStream2.default(function (x) {
            return x.test === "test" ? 1 : -1;
        }, {
            tapper: tapSpy
        });

        stream.on("error", function (e) {
            (0, _chai.expect)(e.message).to.equal("the messages [\"bla\"] do not match your expectations.");
            (0, _chai.expect)(tapSpy.firstCall.args.shift()).to.equal("bla");
            (0, _chai.expect)(tapSpy.firstCall.args.shift()).to.equal(-1);
            (0, _chai.expect)(stream._writableState.ended).to.equal(false); // eslint-disable-line
            done();
        });

        stream.write("bla");
    });

    it("writes to an assert stream, that expects multiple messages", function (done) {
        var tapSpy = _sinon2.default.spy();
        var stream = new _AssertStream2.default(["test1", "test2", "test3"], {
            tapper: tapSpy
        });
        var onEnd = function onEnd() {
            (0, _chai.expect)(tapSpy.firstCall.calledWith("test1", 0));
            (0, _chai.expect)(tapSpy.secondCall.calledWith("test2", 0));
            (0, _chai.expect)(tapSpy.thirdCall.calledWith("test3", 1));
            (0, _chai.expect)(stream._writableState.ended).to.equal(false); // eslint-disable-line
            done();
        };

        stream.on("done", onEnd);
        stream.write("test1");
        stream.write("test2");
        stream.write("test3");
    });

    it("writes to an assert stream, filtering some messages", function (done) {
        var tapSpy = _sinon2.default.spy();
        var stream = new _AssertStream2.default(["test1", "test2"], {
            tapper: tapSpy,
            filter: function filter(value) {
                return value !== "test4";
            }
        });

        var onEnd = function onEnd() {
            (0, _chai.expect)(tapSpy.firstCall.calledWith("test4", 0));
            (0, _chai.expect)(tapSpy.secondCall.calledWith("test1", 0));
            (0, _chai.expect)(tapSpy.thirdCall.calledWith("test2", 1));
            (0, _chai.expect)(stream._writableState.ended).to.equal(false); // eslint-disable-line
            done();
        };

        stream.on("done", onEnd);
        stream.write("test4");
        stream.write("test1");
        stream.write("test2");
    });
});

//# sourceMappingURL=AssertStreamTest.js.map