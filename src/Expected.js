import isArray from "lodash.isarray";
import isEqual from "lodash.isequal";
import isFunction from "lodash.isfunction";
import isNil from "lodash.isnil";
import isMatch from "lodash.ismatch";
import { expect } from "chai";

export default class Expected {

    /**
     * Creates an ExpectationClass, that checks,
     * whether an incoming value matches the
     * expectations
     *
     * @param  {*}        args needed for creation
     * @return {Expected}
     */
    static of(...args) {
        return new Expected(...args);
    }

    /**
     * Constructor of Expected
     *
     * @constructor
     * @param       {*}      expected   compared with input
     * @param       {object} options    for custom matcning behaviour
     */
    constructor(expected, { filter, eventually, strict }) {
        this.messages   = [];
        this.expection  = isArray(expected) ? expected.slice(0) : expected;
        this.expected   = expected;
        this.matcher    = isNil(strict) ? isMatch : isEqual;
        this.onMisMatch = isNil(eventually) ? -1 : 0;
        this.filter     = isNil(filter) ? () => true : filter;
    }

    /**
     * Checks if next value in list matches the input
     *
     * @param  {*}      value to be compared
     * @return {Number}
     */
    includes(value) {
        const expected = this.expected.shift();
        const matches  = this.matcher(value, expected);
        const onMatch  = this.expected.length === 0 ? 1 : 0;

        this.expected = matches ? this.expected : [expected].concat(this.expected);

        return matches ? onMatch : this.onMisMatch;
    }

    /**
     * Compares input with expectations
     *
     * @param  {*}      value to be compared
     * @return {Number}
     */
    match(value) { // eslint-disable-line
        this.messages.push(value);

        if(!this.filter(value))       return 0;
        if(isFunction(this.expected)) return this.expected(value);
        if(isArray(this.expected))    return this.includes(value);

        return this.matcher(value, this.expected) ? 1 : this.onMisMatch;
    }

    /**
     * produces the error containing the expected vs actual results
     *
     * @return {Error}
     */
    getError() {
        if(isFunction(this.expection)) return new Error(`the messages ${JSON.stringify(this.messages)} do not match your expectations.`);

        try {
            expect(this.messages).to.eql(this.expection);

            return null;
        } catch(e) {
            return e;
        }
    }
}
