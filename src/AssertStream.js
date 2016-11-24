import { Writable } from "stream";
import Expected from "./Expected";
import defaults from "set-default-value";

/**
 * this stream is used to be piped into.
 * it ends if the expected value was received.
 *
 * @author Marco Sliwa <marco@circle.ai>
 */
export default class AssertStream extends Writable {

    /**
     * constructor for this stream
     *
     * @constructor
     * @param       {*}      expected value
     * @param       {object} options  configuring the behaviour of AssertSream
     */
    constructor(expected, options) {
        super({
            objectMode: true
        });

        this.expected = Expected.of(expected, options);
        this.tapper   = defaults(options.tapper).to(() => {});
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
    _write(chunk, enc, cb) {
        const data   = Buffer.isBuffer(chunk) ? chunk.toString() : chunk;
        const result = this.expected.match(data);

        this.tapper(data, result);

        return result === -1 ? this.emit("error", this.expected.getError()) : setTimeout(() => result === 1 ? this.emit("done") : cb(), 1);
    }
}
