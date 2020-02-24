const colors = require('./color').colors;
const getType = require('./utils').getType;
const chalk = require('chalk')

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
    // `color:${colors.???}`, ms timing adds below
    'color: inherit',
    `color:${colors.blue}`,
    'color: inherit'
  ];

  let timing = '';
  let color
  if (args && args[1] && args[1].timing) {
    //todo - use ms, account for seconds, days! etc.
    const miliseconds = parseInt(args[1].timing.replace('ms', ''), 10);

    if (miliseconds <= 30) color = 'green'
    if (miliseconds > 30 && miliseconds <= 49) color = 'orange'
    if (miliseconds >= 50) color = 'red'

    styles = [`color:${colors[color]}`, ...styles]; //browser coloring
    timing = chalk.keyword(color)(args[1].timing); //tty coloring
  }


  console.log(
    `[dlog][%c${timing}%c] %c${chalk.blue(fName)} (${chalk.blue(paramTypes)})%c (${paramsTruncated}) `,
    ...styles
  );
}

module.exports = {
  /*
  @deprecated
  */
  devToolInColor: args => {
    console.log('devToolInColor deprecated. Simply swap for colorizedSummary instead. devToolInColor targeted for removal at v0.8.0')
    colorizedSummary(args)
  },
  colorizedSummary

};
