
/*
    Demonstrates ms timing value refers
    to the time of arrival from last d.log call.
*/


counter = 10000000
longDelay = 80;
shortDelay = 10;

const short = () => {
    d.log({ short: { shortDelay } }, { arguments });
    counter--
    setTimeout(() => {
        long(longDelay);
    }, shortDelay);
};

const long = () => {
    d.log({ long: { longDelay } }, { arguments });
    counter--
    if (counter >= 1) {
        setTimeout(() => {
            short();
        }, longDelay);
    }
};

const timing = () => {
    // tick, followed tock, followed tick. 🌊
    long();
};

module.exports = timing;
