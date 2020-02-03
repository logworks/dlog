const glob = require('glob')

globOptions = {} //{ matchBase: true }

//targetGlob = 'testdir/*.js'
//targetGlob = '(testdir/*.js|testdir/**/*.js)'

patterns = [
    // 'testdir/*.js',
    // '(testdir/*.js|testdir/**/*.js)',
    // 'testdir/*.js|testdir/**/*.js',
    // 'testdir/**/*.js',
    'testdir/**/*.?(js|jsx|ts|tsx)',
    'testdir/*.?(js|jsx|ts|tsx)',
    // '*.js',
]

patterns.forEach(element => {
    glob(element, globOptions, function(error, files) {
        if (files.length > 1) console.log(files, element)
    })
})
