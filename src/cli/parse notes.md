/*
  > at: basic functionality. quite a bit of better regx, edge cases (different paramater number, indentation, a lot more)
        so need test drive.
        1. *** nick rimraff test file & dir creation.
        tdd up referencing new.js and test.js.

        - need command line entry - target dir, interactive help, config file later.


  tasks:

    a. get working basicly.
      gets glob pattern from command line.
      globs in files
      reads files
      inserts require log. √
      matches function signatures, √
        
      replaces. √
      match arrow functions, replace √ 50%
      arrow fn applied to vanilla function signatures same.

    b. add tests
        test dir spin up (nick from rimraf)
  
    
    improve options structure.

    c. checks if intended insert already in file.
    d. clean up files.
    e. ensure under git control and state clean.
    f. pre-push hook safety.
    correct indentation (otherwise rely on prettier etc.)
    Negation / ignore at least node_modules. - globby?

    different numbers of parameters (cleverer regx / logic with string.test (regx))


    Deffered:
      make / str /g  dynamic from arg param / config file.
     answer:   = new RegExp(rStr, "g");
      could be useful, likely simple regx / command line sed? better:
          https://www.npmjs.com/package/replace-in-file
          https://stackoverflow.com/questions/14177087/replace-a-string-in-a-file-with-nodejs

*/

/** 
 command line interface:

 p2: read config file.
 p3: write to config file.

 glob pattern e.g. src/ ** /*.js 
 logfunction name e.g. zog 
 add requires: single string or array:  'const zog = require('zoglog');'
 -add  / -remove

 regx
 pattern, replacers:
 default:  (.*function.*)  

**/

// program
//   .option("-d, --debug", "output extra debugging")
//   .option("-s, --small", "small pizza size")
//   .option("-p, --pizza-type <type>", "flavour of pizza")
//   .option("-c, --cheese <type>", "add the specified type of cheese", "blue");

// program.parse(process.argv);

// if (program.debug) console.log(program.opts());

// console.log("pizza details:");
// if (program.small) console.log("- small pizza size");
// if (program.pizzaType) console.log(`- ${program.pizzaType} ${program.cheese}`);
