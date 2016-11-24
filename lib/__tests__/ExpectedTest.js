"use strict";

var _Expected = require("../Expected");

var _Expected2 = _interopRequireDefault(_Expected);

var _chai = require("chai");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("Expected", function () {
    it("compares a single value with the expected one", function () {
        var expected = _Expected2.default.of("Test", {});

        (0, _chai.expect)(expected.match("Test")).to.equal(1);
        (0, _chai.expect)(expected.match("NotTest")).to.equal(-1);
    });

    it("compares a single value with the expected one, skipping all not matching ones", function () {
        var expected = _Expected2.default.of("Test", {
            eventually: true
        });

        (0, _chai.expect)(expected.match("Test")).to.equal(1);
        (0, _chai.expect)(expected.match("NotTest")).to.equal(0);
    });

    it("compares a list of values with another list of values", function () {
        var expected = _Expected2.default.of(["Test1", "Test2", "Test3"], {});

        (0, _chai.expect)(expected.match("Test1")).to.equal(0);
        (0, _chai.expect)(expected.match("Test2")).to.equal(0);
        (0, _chai.expect)(expected.match("Test3")).to.equal(1);
    });

    it("compares a list of values with another list, skipping all non-matches", function () {
        var expected = _Expected2.default.of(["Test3", "Test4", "Test5"], {
            eventually: true
        });

        (0, _chai.expect)(expected.match("Test3")).to.equal(0);
        (0, _chai.expect)(expected.match("Test4")).to.equal(0);
        (0, _chai.expect)(expected.match("Test4")).to.equal(0);
        (0, _chai.expect)(expected.match("Test5")).to.equal(1);
    });

    it("compares a list of values with a filter", function () {
        var expected = _Expected2.default.of(["Test3", "Test4", "Test5"], {
            filter: function filter(value) {
                return value !== "Test2";
            }
        });

        (0, _chai.expect)(expected.match("Test3")).to.equal(0);
        (0, _chai.expect)(expected.match("Test2")).to.equal(0);
        (0, _chai.expect)(expected.match("Test4")).to.equal(0);
        (0, _chai.expect)(expected.match("Test5")).to.equal(1);
    });

    it("compares a single of values with a filter", function () {
        var expected = _Expected2.default.of("Test3", {
            filter: function filter(value) {
                return value !== "Test2";
            }
        });

        (0, _chai.expect)(expected.match("Test2")).to.equal(0);
        (0, _chai.expect)(expected.match("Test3")).to.equal(1);
    });

    it("compares with a function", function () {
        var expected = _Expected2.default.of(function (value) {
            return value === "Test3" ? 1 : -1;
        }, {
            filter: function filter(value) {
                return value !== "Test2";
            }
        });

        (0, _chai.expect)(expected.match("Test1")).to.equal(-1);
        (0, _chai.expect)(expected.match("Test2")).to.equal(0);
        (0, _chai.expect)(expected.match("Test3")).to.equal(1);
    });
});

//# sourceMappingURL=ExpectedTest.js.map