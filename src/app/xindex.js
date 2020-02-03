/*
    applies filtering.
    park call stack, remove callee approach completely.
*/

const colors = require('colors')

let stackHeight = 3

function logStandard(cal, config) {
    const callStack = []
    const argStack = []
    const sigStack = []

    // need try catch here too - so if hit arrow parent dont barf.
    try {
        for (let i = 0; i < stackHeight + 1; i++) {
            if (cal['caller']) {
                //console.log('cal args:', cal.arguments)
                callStack.unshift(cal.name)
                argStack.unshift(Object.values(cal.arguments))
                //todo -regx

                const firstFunc = cal.toString().split('\n')[0]

                sigStack.unshift(
                    cal.toString().split('\n')[0]
                    //  .split('function ')[1]
                    //  .split('{')[0]
                )
                cal = cal.caller
            }
        }
    } catch (e) {
        console.log('_XXX')
        console.log('Error going up stack', e)
    }
    const matched =
        config.filtrate[0] === '*'
            ? 'all'
            : config.filtrate.filter(item => {
                  return callStack.includes(item)
              })
    //console.log('_1', config.filtrate)
    if (matched.length >= 1) {
        // sigStack.push ('xxx'.blue)
        // sigStack.push ('yyy')
        // let sig = sigStack.join(': ')
        //console.log('_2')
        let args = Object.values(arguments)
        var stack = callStack.join(':')

        let coloredStack = []
        let uncoloredStack = []
        for (let i = 0; i < callStack.length; i++) {
            if (matched.includes(callStack[i])) {
                coloredStack.push(callStack[i].blue)
            } else {
                coloredStack.push(callStack[i])
            }
            coloredStack.push(':')
            uncoloredStack.push(callStack[i])
            uncoloredStack.push(':')
        }

        let res = []
        for (let i = 0; i < sigStack.length; i++) {
            res.push(sigStack[i] + '<-' + argStack[i])
        }
        //console.log('_3')
        // console.log(stack, 'match on:', matched)
        //console.log(res)

        const output = {
            stack: coloredStack.join(''),
            uncoloredStack: uncoloredStack.join(''),
            signature: res,
        }
        console.log(output.stack, output.signature)
        return output
    }
}

function logFallback(e, fnString, logParams, config) {
    // const eStackArr = e.stack.split('\n')
    //console.log('e.stack', e.stack)
    const paramValues = [...Object.values(logParams)]
    const fnCalled = e.stack
        .split('\n')[2]
        .split('at ')[1]
        .split(' (')[0]
    // .split('.')[1] //note - sometimes Object.foo - not always - like not when running jests
    // ellipsing large params - of option config : { truncateLength: 30}
    if (config.truncateLength && config.truncateLength >= 1) {
        for (let i = 0; i < paramValues.length - 1; i++) {
            if (paramValues[i].length > config.truncateLength) {
                paramValues[i] =
                    paramValues[i].substring(0, config.truncateLength) +
                    '...'.red
            }
        }
    }

    const matched =
        config.filtrate[0] === '*'
            ? 'all'
            : config.filtrate.filter(item => {
                  return item.match(fnCalled)
              })
    if (matched.length >= 1) {
        const output = {
            stack: fnCalled.yellow,
            uncoloredStack: fnCalled,
            signature: fnString.split('=>')[0],
            paramValues: paramValues,
        }

        console.log(output.stack, output.signature, output.paramValues) //, 'debuginfo:', arguments)
        return output
    }
}

const dlog = {
    logger: {
        config: {},

        log: function() {
            let callee = null
            try {
                callee = arguments.callee.caller //null if called from arrow fn or mode is strict.

                // console.log('test', test)

                if (callee['caller']) {
                    return logStandard(callee, this.config)
                } else {
                    console.log('DONT THINK THIS HAPPENS ANY MORE!!!')
                    const e = new Error()
                    return logFallback(e)
                }
            } catch (error) {
                // console.log('E', error)
                const e = new Error()
                return logFallback(
                    e,
                    callee ? callee.toString() : '', //unavailiabe in strict mode
                    arguments, //logger.log( explicit arguments sent for arrow fn's)
                    this.config
                )
                //console.log(args, this.config)}
            }
        },
    },
    // todo:
    // enforce structure
    // configurable log.
    // default log all if filtrate empty
    createLogger: function(_config) {
        this.logger.config = _config
        return this.logger
    },
}

module.exports = dlog
