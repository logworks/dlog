const colors = require('./color').colors;
const getType = require('./utils').getType;
const style = require('ansi-styles');
const ms = require('ms');
const supportsColor = require('supports-color');

const useTty = (supportsColor.stdout)

let config;

const setConfig = _config => {
  config = _config
}
/*
  provides detail of params data.
  todo: check stack=true
*/
const details = args => {

  const fName = Object.keys(args[0])[0];
  if (config.includeDetails.includes(fName)) {

    const stack = args[1].stack
    let stackBreadcrumbs = 'details: '
    const stackDetails = []
    //for (item of args[1].stack) {
    for (let i = stack.length - 1; i > 1; i--) {
      if (!stack[i].fileName.match('internal')) {
        stackDetails.push(stack[i].fileName + ':' + stack[i].lineNumber)
        if (stack[i].functionName.match("Object.<anonymous>")) {
          stackBreadcrumbs += ' >> '
        } else {
          stackBreadcrumbs += stack[i].functionName + ' > '
        }
      }
    }
    stackBreadcrumbs += fName
    //console.log(args[1].stack)
    const params = args[0][fName];
    return [params, stackBreadcrumbs, stackDetails]
  } else {
    return null
  }
}

/*
@param logObj
@param meta
@returns  array of parameters for output to console.log.
e.g.  ['%cred %cblue', 'color:red',color:blue']
use example console.log(...colorizedSummary())
*/
const colorizedSummary = args => {

  const fName = Object.keys(args[0])[0];
  const paramKeys = Object.keys(args[0][fName]);
  const params = args[0][fName];
  // elipse params to 30 characters
  const paramsJson = JSON.stringify(params);
  const paramsDeQuoted = paramsJson.replace(/"/g, '');
  const paramsDeCurled = paramsDeQuoted.slice(1, paramsDeQuoted.length - 1);
  const paramsSpaced = paramsDeCurled.replace(/:/g, ' : ');
  const paramsTruncated =
    paramsSpaced.length > 30
      ? paramsSpaced.slice(0, 30) + '...'
      : paramsSpaced;

  const paramTypes = paramKeys.map(
    key => key + ' : ' + getType(args[0][fName][key])
  );
  let styles = [
    // `color:${colors.???}`, ms timing pre-pends below
    'color: inherit',
    `color:${colors.blue}`,
    'color: inherit'
  ];

  let timing = args[1].timing;
  let color = 'white'
  if (args && args[1] && args[1].timing) {

    if (timing <= 30) color = 'green'
    if (timing > 30 && timing <= 49) color = 'yellow'
    if (timing >= 50) color = 'red'

    styles = [`color:${colors[color]}`, ...styles]; //browser coloring
  }

  if (useTty) {
    const ttyFormat =
      [`\n[dlog][${style[color].open}${ms(timing)}${style[color].close}] ${style.blue.open}${fName} (${paramTypes})${style.blue.close} (${paramsTruncated}) `]
    return ttyFormat
  } else {
    const webFormat = [
      `[dlog][%c${ms(timing)}%c] %c${fName} (${paramTypes})%c (${paramsTruncated}) `,
      ...styles]
    return webFormat
  }

}
module.exports = {
  /*
  @deprecated
  */
  devToolInColor: args => {
    console.log('devToolInColor deprecated. Simply swap for colorizedSummary instead. devToolInColor targeted for removal at v0.8.0')
    colorizedSummary(args)
  },
  colorizedSummary,
  details,
  setConfig

};
