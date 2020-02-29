// initialise logging early in app bootup
const basic = require('./basic.js');
const argChecking = require('./argChecking');
const timing = require('./timing');
const timingLongShort = require('./timingLongShort')
const typeChecking = require('./typeChecking');
const indentDetect = require('./indentDetect');
const ClassName = require('./only')


const className = new ClassName()
className.memberArrowFunctionName()
className.memberFunctionName()

// basic();
timing();
indentDetect();
//timingLongShort();
// argChecking();
//typeChecking();

//d.config.file = true;
// basic();
