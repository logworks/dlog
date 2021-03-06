#!/usr/bin/env node
const parser = require('./parser');
const path = require('path');

const install = require('./install');
const gitCheck = require('./gitCheck');
const readConfig = require('./readConfig');

const cmd = process.argv[process.argv.length - 1];
const helpMessage = `help:
dlog
     v      version.  
     i      installs ./.dlogrc and ./dlog.js. 
     +      add logging to source files according to .dlogrc settngs
     -      remove logging .
     ++     force add logging (skip's git status check)
     ?      checks for dlog statements in code. (useful for CI).
         `;

const boot = async function () {
  let config;
  try {
    switch (cmd) {
      case '-': {
        process.stdout.write('\n- removing logs\n');
        config = await readConfig();
        parser.execute(config, false, true);
        break;
      }
      //case "--": "remove global convenience logging d.log TODO"
      case '?': {
        process.stdout.write(
          '\ndlog ? checking for dlog statements in source code...\n'
        );
        config = await readConfig();
        parser.execute(config, false, false, true);
        break;
      }
      case '++': {
        process.stdout.write('\n++  Add logging, skip git status check.\n');
        config = await readConfig();
        parser.execute(config, true);
        break;
      }
      case '+': {
        const proceed = await gitCheck();
        if (proceed) {
          config = await readConfig();
          process.stdout.write(`\nconfig: ${config}\n`);
          process.stdout.write('+ adding logs\n');
          parser.execute(config, true);
        }
        break;
      }
      case 'v': {
        const packagePath = path.resolve(__dirname) + '/../../package.json';
        const pjson = require(packagePath);
        process.stdout.write(`dlog version: ${pjson.version}\n\n`);
        break;
      }
      case 'i':
        install();
        break;

      default:
        process.stdout.write(helpMessage);
    }
  } catch (error) {
    process.stdout.write(`\n${error}\n`);
  }
};

boot();
