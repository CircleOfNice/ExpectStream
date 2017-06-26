import isArray from "lodash.isarray";
import { expect } from "../index";
import { Readable, Transform } from "stream";
import assert from "assert";
import sinon from "sinon";

class ReadStream extends Readable {
    constructor(messages = "lala") {
        super({ objectMode: true });

        this.messages = messages;
    }

    _read() {
        const message = isArray(this.messages) ? this.messages.shift() : this.messages;

        this.push(message);
    }
}

class TransformStream extends Transform {
    _transform(chunk, enc, cb) {
        this.push(chunk);
        setTimeout(cb, 20);
    }
}


class ReadObjectStream extends Readable {
    constructor() {
        super({
            objectMode: true
        });
    }

    _read() {
        this.push({
            test: {
                test: []
            }
        });
    }
}

class TransformObjStream extends Transform {
    constructor() {
        super({
            objectMode: true
        });
    }

    _transform(obj, enc, cb) {
        this.push(obj);
        setTimeout(cb, 20);
    }
}


describe("ExpectStreamTest", function() { // eslint-disable-line
    it("uses the produce assertion with a readstream, matching exactly", function(done) {
        expect(new ReadStream(["lala1", "lala2", "lala3"]))
            .to.produce(["lala1", "lala2", "lala3"])
            .notify(done);
    });

    it("uses the produce assertion with a readstream, matching on strict equality", function(done) {
        expect(new ReadStream({ test: "lala" }))
            .to.exactly.produce({ test: "lala" })
            .notify(done);
    });

    it("uses the produce assertion with a readstream, matching on strict equality - part2", function(done) {
        expect(new ReadStream({ test: "lala" }))
            .to.produce.exactly({ test: "lala" })
            .notify(done);
    });

    it("uses the produce assertion with a readstream, containing at least key test", function(done) {
        expect(new ReadStream({ test: "lala", another: "lulu" }))
            .to.produce({ test: "lala" })
            .notify(done);
    });

    it("uses the produce assertion with a readstream, containing at least key test", function(done) {
        expect(new ReadStream({ test: "lala" }))
            .to.produce({ test: "lala", another: "lulu" })
            .notify(e => e ? done() : done(new Error("Shouldn't end up here.")));
    });

    it("uses the produce assertion with a readstream, matching exactly and fails", function(done) {
        const stream = new ReadStream(["lala1", "lala", "lala3"]);

        expect(stream)
            .to.produce(["lala1", "lala2", "lala3"])
            .notify(e => {
                if(!e) return done(new Error("Should fail"));

                try {
                    expect(stream._readableState.ended).to.equal(false); // eslint-disable-line

                    return done();
                } catch(e2) {
                    return done(e2);
                }
            });
    });

    it("uses the produce assertion with a readstream, matching not exactly", function(done) {
        const stream = new ReadStream(["lala1", "lala", "lala2", "lala3"]);

        expect(stream)
            .to.eventually.produce(["lala1", "lala2", "lala3"])
            .notify(e => {
                if(e) return done(e);

                try {
                    expect(stream._readableState.ended).to.equal(false); // eslint-disable-line

                    return done();
                } catch(e2) {
                    return done(e2);
                }
            });
    });

    it("uses the produce assertion with a readstream, matching exactly, but filtering some messages", function(done) {
        expect(new ReadStream(["lala1", "lala", "lala2", "lala3"]))
            .filter(value => value !== "lala")
            .to.produce(["lala1", "lala2", "lala3"])
            .notify(done);
    });

    it("uses the eventually produce assertion with a readstream, producing buffers.", function(done) {
        expect(new ReadStream()).to.eventually.produce("lala").notify(done);
    });

    it("uses the produce assertion with a readstream, producing objects.", function(done) {
        expect(new ReadObjectStream()).to.eventually.produce({
            test: {
                test: []
            }
        }).notify(done);
    });

    it("fails the produce assertion on the readstream with buffers.", function(done) {
        expect(new ReadStream()).to.eventually.produce("lulu").notify(() => done(new Error("should not finish")));
        setTimeout(() => done(), 20);
    });

    it("fails the produce assertion on the readstream with objects.", function(done) {
        expect(new ReadStream()).to.eventually.produce({
            test: "test2"
        }).notify(() => done(new Error("should not finish")));

        setTimeout(() => done(), 20);
    });

    it("uses the produce assertion with a transformstream, producing buffers.", function(done) {
        expect(new TransformStream()).to.eventually.produce("huhu").on("lala", "test", "huhu").notify(done);
    });

    it("uses the produce assertion with a transformstream, producing objects.", function(done) {
        expect(new TransformObjStream()).to.eventually.produce({
            test: {
                test: []
            }
        }).on("lala", "test", "huhu", {
            test: {
                test: []
            }
        }).notify(done);
    });

    it("fails the produce assertion with a transformstream, producing buffers.", function(done) {
        expect(new TransformStream())
            .to.eventually.produce("huhu")
            .on("lala", "test")
            .notify(() => done(new Error("should not finish")));

        setTimeout(() => done(), 70);
    });

    it("fails the produce assertion with a transformstream, producing objects.", function(done) {
        expect(new TransformObjStream())
            .to.eventually.produce({
                test: {
                    test: []
                }
            })
            .on("lala", "test", {
                test: {
                    test: 1
                }
            })
            .notify(() => done(new Error("should not finish")));

        setTimeout(() => done(), 70);
    });

    it("tries to test a readstream with input", function(done) {
        try {
            expect(new ReadStream()).to.eventually.produce("test").on("bla").notify(done);
        } catch(e) {
            assert.equal(e.message, "You can only use arguments with a writable stream.");
            done();
        }
    });

    it("tries to test a transformstream without input", function(done) {
        try {
            expect(new TransformStream()).to.eventually.produce("test").on().notify(done);
        } catch(e) {
            assert.equal(e.message, "You can only use arguments with a writable stream.");
            done();
        }
    });

    it("uses the produce assertion with a transformstream, producing buffers.", function(done) {
        expect(new TransformStream())
            .to.produce(x => x === "huhu" ? 1 : -1)
            .on("lala", "test", "huhu")
            .notify(e => e instanceof Error ? done() : done(new Error("should throw")));
    });

    it("taps a stream under test.", function(done) {
        const spy = sinon.spy();

        expect(new TransformStream())
            .to.eventually.produce("huhu")
            .on("lala", "test", "huhu")
            .tap(spy)
            .notify(() => {
                try {
                    expect(spy.callCount).to.equal(3);
                    expect(spy.firstCall.args.shift()).to.equal("lala");
                    expect(spy.firstCall.args.shift()).to.equal(0);
                    expect(spy.secondCall.args.shift()).to.equal("test");
                    expect(spy.secondCall.args.shift()).to.equal(0);
                    expect(spy.thirdCall.args.shift()).to.equal("huhu");
                    expect(spy.thirdCall.args.shift()).to.equal(1);
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });
});
