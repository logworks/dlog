const dlog = require ('./dlog.js');

/*
    Demonstrates ms timing value refers
    to the time of arrival from last d.log call.
*/


counter = 10
longDelay = 80;
shortDelay = 10;

const short = () => {
    dlog.log( { 'short' : {} }, { arguments } )

    d.log({ short: { shortDelay } }, { arguments });
    counter--
    setTimeout(() => {
        dlog.log( { 'setTimeout' : {} }, { arguments } )

        long(longDelay);
    }, shortDelay);
};

const long = () => {
    dlog.log( { 'long' : {} }, { arguments } )

    d.log({ long: { longDelay } }, { arguments });
    counter--
    if (counter >= 1) {
        setTimeout(() => {
            dlog.log( { 'setTimeout' : {} }, { arguments } )

            short();
        }, longDelay);
    }
};

const timing = () => {
    dlog.log( { 'timing' : {} }, { arguments } )

    // tick, followed tock, followed tick. 🌊
    long();
};

module.exports = timing;
