const fs = require("fs");
const readline = require("readline");
const git = require("gift");
const utils = require("./utils");
const path = require("path");
const cwd = path.resolve(process.cwd(), ".");

const util = require("util");
const exec = util.promisify(require("child_process").exec);

const exitMessage = `Exiting. git commands, then dlog + again.
 for example:
  git add . && git commit --amend
  git add . && git commit --m 'your commit message here'
  dlog +
`;
const addMessage = `Warning there are changed files.

[L] List unstaged files.
[N] Exit, commit/stage files, re-run dlog +
[Y] Proceed.
 > `;
const wrongDirMessage = `dlog must be run from root level of project and be under git source control. 
This is because dlog can change a lot of files. Just a safety feature. 
It will also warn you if the git status is not clean i.e. unchecked in files.
`;

function os_func() {
  this.execCommand = function(cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout);
      });
    });
  };
}

var os = new os_func();

async function gitCheck() {
  return new Promise(function(resolve, reject) {
    // todo - check git coverage of present dir.
    // os.execCommand('git status').then(res => {
    //     console.log(res)
    // })

    const repo = git(cwd);

    repo.status({}, function(err, status) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      if (status.clean) {
        rl.close();
        resolve(true);
      } else {
        const qadd = function(answer) {
          switch (answer.toUpperCase()) {
            case "L":
              console.log(status.files);
              rl.question(addMessage, qadd);
              break;
            case "N":
              console.log(exitMessage);
              process.exit();
              break;
            case "Y":
              rl.close();
              resolve(true);
              break;
            default:
              console.log(`${answer} invalid. please respond with l/n/y`);
              rl.question(addMessage, qadd);
          }
        };

        rl.question(addMessage, qadd);
      }
    });
  });
}

module.exports = gitCheck;
