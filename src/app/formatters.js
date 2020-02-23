const colors = require('./color').colors;
const getType = require('./utils').getType;

module.exports = {
  devToolInColor: args => {
    const fName = Object.keys(args[0])[0];
    const paramKeys = Object.keys(args[0][fName]);
    const params = args[0][fName];
    // elipse params to 30 characters
    const paramsJson = JSON.stringify(params);
    const paramsDeQuoted = paramsJson.replace(/"/g, '');
    const paramsDeCurled = paramsDeQuoted.slice(1, paramsDeQuoted.length - 1);
    const paramsTruncated =
      paramsDeCurled.length > 30
        ? paramsDeCurled.slice(0, 30) + '...'
        : paramsDeCurled;

    const paramTypes = paramKeys.map(
      key =>
        // key => `%c${key}%c + ':' + %c${getType(args[0][fName][key])}%c `
        key + ':' + getType(args[0][fName][key])
    );
    let styles = [
      // `color:${colors.???}`, ms timing adds below
      'color: inherit',
      `color:${colors.blue}`,
      'color: inherit'
    ];

    let timing = '';
    if (args && args[1] && args[1].timing) {
      //todo - use ms, account for seconds, days! etc.
      const miliseconds = parseInt(args[1].timing.replace('ms', ''), 10);
      if (miliseconds <= 30) styles = [`color:${colors.green}`, ...styles];
      if (miliseconds > 30 && miliseconds <= 49)
        styles = [`color:${colors.orange}`, ...styles];
      if (miliseconds >= 50) styles = [`color:${colors.red}`, ...styles];
      timing = args[1].timing;
    }

    //return `[dlog][${timing}] ${fName} (${paramTypes})`;

    console.log(
      `[dlog][%c${timing}%c] %c${fName}%c (${paramTypes}) (${paramsTruncated}) `,
      ...styles
    );
  }
};
