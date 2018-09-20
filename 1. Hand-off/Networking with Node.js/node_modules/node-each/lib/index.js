'use strict';

/**
 *
 * Node Each
 * Description: Asynchronous for each that avoids blocking Node Event Loop using setImmediate.
 *              Event Loop jump can be triggered by iteration number or iteration process time.
 *
 * */

/** Requires */
var Promise = require('bluebird');

/** Global Stats */
var stats = {
    executing: 0
};

/**
 * Async For Each Factory
 * @param {Array} collection - Array for iteration
 * @param {(Function|Promise)} callback - Callback function or promise with collection element parameter
 * @param {Object} [options] - Callback function or promise with collection element parameter
 * @param {Boolean} [options.debug] - Debug iterator
 * @param {String} [options.on] - Pause iterator on iteration or time
 * @param {Number} [options.when] - Iteration or time interval to trigger setImmediate
 * @returns {Promise} - Resolve when loop is finished
 * */
function each(collection, callback, options) {

    /** Collection array Type validation */
    if (!Array.isArray(collection)) {
        throw new TypeError('each first argument must be the collection array for iteration');
    }

    /** Callback function Type validation */
    if (typeof callback !== 'function') {
        throw new TypeError('each second argument must be the iteration callback function');
    }

    /** Options object Type validation */
    if (typeof options !== 'undefined' && typeof options !== 'object') {
        throw new TypeError('each third argument must be the options object');
    }

    /** Time in nanoseconds */
    var ns = 0;

    /** Default options */
    if (!(options && options.when > 0 && (options.on === 'iteration' || options.on === 'time'))) {
        options = {
            debug: (options && options.debug) || false,
            on: 'iteration',
            when: 1
        };
    } else if (options.on === 'time') {
        /** Convert time milliseconds to nanoseconds */
        ns = options.when * 1000000;
    }

    /** Iteration array, iteration start number, promise resolve reference and process times */
    var cycles = 1,
        iterationArray = collection.slice(0),
        iteration = 0,
        promiseResolve,
        start = process.hrtime(),
        time = start;

    /**
     * Recursive Iterator function
     * */
    function iterator() {
        /** Take iteration element and remove it from iteration array */
        var el = iterationArray.splice(0, 1)[0];

        /** Resolve callback promise */
        Promise.resolve(callback(el, iteration)).then(function next() {

            /** Iteration array not empty, we still need to iterate */
            if (iterationArray.length > 0) {

                /** Increment iteration */
                ++iteration;

                /** Options pause on iteration */
                if (options.on === 'iteration') {

                    /** Remainder of iteration is 0 call setImmediate */
                    if (iteration % options.when === 0) {
                        /** Debug is true, increment cycles */
                        if (options.debug === true) {
                            ++cycles;
                        }
                        setImmediate(iterator);
                    } else {
                        /** Run next iteration */
                        iterator();
                    }

                } else {

                    /** Options pause on time */
                    /** Process time difference */
                    var timeDif = process.hrtime(time);

                    /** Time difference is greater than or equal to when call setImmediate */
                    if ((timeDif[0] * 1e9) + timeDif[1] >= ns) {
                        /** Debug is true, increment cycles */
                        if (options.debug === true) {
                            ++cycles;
                        }
                        /** Reset process time */
                        time = process.hrtime();
                        setImmediate(iterator);
                    } else {
                        /** Run next iteration */
                        iterator();
                    }

                }
            } else {
                /** Iteration array is empty, resolve loop promise */
                /** Resolve with debug object */
                if (options.debug === true) {
                    /** Increment last iteration */
                    if (collection.length) {
                        ++iteration;
                    }
                    var end = process.hrtime(start),
                        duration = (end[0] * 1000) + (end[1] / 1000000),
                        debugObj = {
                            average: collection.length ? duration / iteration : duration,
                            cycles: cycles,
                            duration: duration,
                            iterations: iteration,
                            on: options.on,
                            when: options.when
                        };
                    promiseResolve(debugObj);
                } else {
                    /** Resolve */
                    promiseResolve();
                }

                /** Decrement loops executing */
                --stats.executing;
            }

        });
    }

    /**
     * Iterator Promise that resolves when all iterations are finished
     * @param {Function} resolve - Promise resolve method
     * */
    function iteratorPromise(resolve) {

        /** Increment loops executing */
        ++stats.executing;

        /** Promise resolve method reference */
        promiseResolve = resolve;

        /** Start recursive iteration */
        iterator();

    }

    /** Return Iterator Promise */
    return new Promise(iteratorPromise);
}

/** Export each function and stats object */
module.exports = {
    each: each,
    stats: stats
};