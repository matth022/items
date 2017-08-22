'use strict';

// Load modules


// Declare internals

var internals = {};

exports.serial = function (array, method, callback) {

    if (!array.length) {
        callback();
    } else {
        var i = 0;
        var iterate = function iterate() {

            var done = function done(err) {

                if (err) {
                    callback(err);
                } else {
                    i = i + 1;
                    if (i < array.length) {
                        iterate();
                    } else {
                        callback();
                    }
                }
            };

            method(array[i], done, i);
        };

        iterate();
    }
};

exports.parallel = function (array, method, callback) {

    if (!array.length) {
        callback();
    } else {
        var count = 0;
        var errored = false;

        var done = function done(err) {

            if (!errored) {
                if (err) {
                    errored = true;
                    callback(err);
                } else {
                    count = count + 1;
                    if (count === array.length) {
                        callback();
                    }
                }
            }
        };

        for (var i = 0; i < array.length; ++i) {
            method(array[i], done, i);
        }
    }
};

exports.parallel.execute = function (fnObj, callback) {

    var result = {};
    if (!fnObj) {
        return callback(null, result);
    }

    var keys = Object.keys(fnObj);
    var count = 0;
    var errored = false;

    if (!keys.length) {
        return callback(null, result);
    }

    var done = function done(key) {

        return function (err, val) {

            if (!errored) {
                if (err) {
                    errored = true;
                    callback(err);
                } else {
                    result[key] = val;
                    if (++count === keys.length) {
                        callback(null, result);
                    }
                }
            }
        };
    };

    for (var i = 0; i < keys.length; ++i) {
        if (!errored) {
            var key = keys[i];
            fnObj[key](done(key));
        }
    }
};
