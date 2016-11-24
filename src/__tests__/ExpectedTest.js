import Expected from "../Expected";
import { expect } from "chai";

describe("Expected", function() {
    it("compares a single value with the expected one", function() {
        const expected = Expected.of("Test", {});

        expect(expected.match("Test")).to.equal(1);
        expect(expected.match("NotTest")).to.equal(-1);
    });

    it("compares a single value with the expected one, skipping all not matching ones", function() {
        const expected = Expected.of("Test", {
            eventually: true
        });

        expect(expected.match("Test")).to.equal(1);
        expect(expected.match("NotTest")).to.equal(0);
    });

    it("compares a list of values with another list of values", function() {
        const expected = Expected.of(["Test1", "Test2", "Test3"], {});

        expect(expected.match("Test1")).to.equal(0);
        expect(expected.match("Test2")).to.equal(0);
        expect(expected.match("Test3")).to.equal(1);
    });

    it("compares a list of values with another list, skipping all non-matches", function() {
        const expected = Expected.of(["Test3", "Test4", "Test5"], {
            eventually: true
        });

        expect(expected.match("Test3")).to.equal(0);
        expect(expected.match("Test4")).to.equal(0);
        expect(expected.match("Test4")).to.equal(0);
        expect(expected.match("Test5")).to.equal(1);
    });

    it("compares a list of values with a filter", function() {
        const expected = Expected.of(["Test3", "Test4", "Test5"], {
            filter: value => value !== "Test2"
        });

        expect(expected.match("Test3")).to.equal(0);
        expect(expected.match("Test2")).to.equal(0);
        expect(expected.match("Test4")).to.equal(0);
        expect(expected.match("Test5")).to.equal(1);
    });

    it("compares a single of values with a filter", function() {
        const expected = Expected.of("Test3", {
            filter: value => value !== "Test2"
        });

        expect(expected.match("Test2")).to.equal(0);
        expect(expected.match("Test3")).to.equal(1);
    });

    it("compares with a function", function() {
        const expected = Expected.of(value => value === "Test3" ? 1 : -1, {
            filter: value => value !== "Test2"
        });

        expect(expected.match("Test1")).to.equal(-1);
        expect(expected.match("Test2")).to.equal(0);
        expect(expected.match("Test3")).to.equal(1);
    });
});
