const fs = require('fs')

fs.readdir('./', (err, files) => {
    files.forEach(file => {
        console.log(file)
    })
})

// allFiles = [
//     './testdir/configfile1.js',
//     './testdir/configfile2.tsx',
//     './testdir/configfile1.js',
//     './testdir/configfile2.tsx',
//     './testdir/node_modules/apackage/package.js',
//     './testdir/sub1/index.js',
//     './testdir/sub1/index.jsx',
//     './testdir/sub1/index.test.js',
//     './testdir/sub1/index.tsx',
//     './testdir/sub1/sub2/index.js',
//     './testdir/sub1/sub2/artindex.jsx',
// ]

// const excludes = '(node_modules|fart)'
// const excludeX = new RegExp(excludes)
// const reducedFilesList = []
// for (file of allFiles) {
//     if (!excludeX.test(file)) reducedFilesList.push(file)
// }
// console.log(reducedFilesList)
