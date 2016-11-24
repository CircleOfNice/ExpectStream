import AssertStream from "../AssertStream";
import sinon from "sinon";
import { expect } from "chai";

describe("AssertStreamTest", function() {
    it("writes to an assert stream with a value expectation, until it ends with the expected value.", function(done) {
        const tapSpy = sinon.spy();
        const onEnd  = sinon.spy();
        const stream = new AssertStream({
            test: "test"
        }, {
            tapper:     tapSpy,
            eventually: true
        });

        stream.on("done", onEnd);

        stream.write("bla");
        stream.write({});
        stream.write({
            test: "test"
        });

        setTimeout(function() {
            expect(onEnd.callCount).to.equal(1);
            expect(tapSpy.firstCall.args.shift()).to.equal("bla");
            expect(tapSpy.firstCall.args.shift()).to.equal(0);
            expect(tapSpy.secondCall.args.shift()).to.eql({});
            expect(tapSpy.secondCall.args.shift()).to.equal(0);
            expect(tapSpy.thirdCall.args.shift()).to.eql({
                test: "test"
            });
            expect(tapSpy.thirdCall.args.shift()).to.equal(1);
            expect(stream._writableState.ended).to.equal(false); // eslint-disable-line
            done();
        }, 20);
    });

    it("writes to an assert stream with a function expectation, until it ends with the expected value.", function(done) {
        const onEnd  = sinon.spy();
        const stream = new AssertStream(x => x.test === "test" ? 1 : 0, {});

        stream.on("done", onEnd);

        stream.write("bla");
        stream.write({});
        stream.write({
            test: "test"
        });

        setTimeout(function() {
            expect(onEnd.callCount).to.equal(1);
            expect(stream._writableState.ended).to.equal(false); // eslint-disable-line
            done();
        }, 20);
    });

    it("writes to an assert stream with a function expectation, until it ends with the expected value.", function(done) {
        const tapSpy = sinon.spy();
        const stream = new AssertStream(x => x.test === "test" ? 1 : -1, {
            tapper: tapSpy
        });

        stream.on("error", e => {
            expect(e.message).to.equal("the messages [\"bla\"] do not match your expectations.");
            expect(tapSpy.firstCall.args.shift()).to.equal("bla");
            expect(tapSpy.firstCall.args.shift()).to.equal(-1);
            expect(stream._writableState.ended).to.equal(false); // eslint-disable-line
            done();
        });

        stream.write("bla");
    });

    it("writes to an assert stream, that expects multiple messages", function(done) {
        const tapSpy = sinon.spy();
        const stream = new AssertStream(["test1", "test2", "test3"], {
            tapper: tapSpy
        });
        const onEnd = function() {
            expect(tapSpy.firstCall.calledWith("test1", 0));
            expect(tapSpy.secondCall.calledWith("test2", 0));
            expect(tapSpy.thirdCall.calledWith("test3", 1));
            expect(stream._writableState.ended).to.equal(false); // eslint-disable-line
            done();
        };

        stream.on("done", onEnd);
        stream.write("test1");
        stream.write("test2");
        stream.write("test3");
    });

    it("writes to an assert stream, filtering some messages", function(done) {
        const tapSpy = sinon.spy();
        const stream = new AssertStream(["test1", "test2"], {
            tapper: tapSpy,
            filter: value => value !== "test4"
        });

        const onEnd = function() {
            expect(tapSpy.firstCall.calledWith("test4", 0));
            expect(tapSpy.secondCall.calledWith("test1", 0));
            expect(tapSpy.thirdCall.calledWith("test2", 1));
            expect(stream._writableState.ended).to.equal(false); // eslint-disable-line
            done();
        };

        stream.on("done", onEnd);
        stream.write("test4");
        stream.write("test1");
        stream.write("test2");
    });
});
