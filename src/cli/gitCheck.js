const readline = require('readline');
const git = require('gift');
const path = require('path');
const cwd = path.resolve(process.cwd(), '.');

const addMessage = `

Warning there are changed files.

[L] List unstaged files.
[Q] Quit to manually commit/stage files. Then can re-run dlog +
[Y] Yes, Proceed.
> `;

const shortAddMessage = `[L]ist [Q]uit [Y]es-proceed >`;

const gitErrorMessage = `

It Looks like the directory you are in (${cwd}), is not under git source control.
For safety this is required to run dlog +  as it can change a lot of files!
`;

const exitMessage = `
Quitting...
 
Suggest you run git commands for clean status, then dlog + again.
for example:
  git add . && git commit --m 'your commit message here'
  dlog +
`;

function getRepoStatus(repo) {
  return new Promise(function(resolve, reject) {
    repo.status({}, function(error, status) {
      if (error) {
        reject(error);
      } else {
        resolve(status);
      }
    });
  });
}

async function gitCheck() {
  const repo = git(cwd);
  try {
    const status = await getRepoStatus(repo);

    if (status.clean) {
      process.stdout.write('git status: clean.  dlogging starting...');
      return true;
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    process.stdout.write(addMessage);

    for await (const line of rl) {
      let answer = line.toUpperCase();
      switch (answer) {
        case 'L': {
          process.stdout.write('git status:', status.files);
          process.stdout.write(shortAddMessage);
          break;
        }
        case 'Y': {
          rl.close();
          return true;
        }
        case 'Q': {
          process.stdout.write(exitMessage);
          return false;
        }

        default: {
          process.stdout.write(`${answer} invalid Choice.`);
          process.stdout.write(shortAddMessage);
        }
      }
    }
  } catch (repoStatusError) {
    process.stdout.write(gitErrorMessage);
    return false;
  }
}

module.exports = gitCheck;
