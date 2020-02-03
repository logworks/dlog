const parser = require('./parser')

const namedFunctions = [
    'function functionName(){',
    'function functionName (arg1, arg2) {',
    'functionName (arg1, arg2, arg3) {',
    'functionName = function (arg1, arg2) {',
    'functionName = (arg1, arg2) => {',
    'functionName = function otherName (arg1, arg2) => {',
    'array.forEach(function functionName() {',
    'export const functionName = (arg1, arg2) => {',
    'functionName(arg1: any): any {',
    'async functionName(arg1: any): any {',
    'public functionName(arg1: any): any {',
    'public async functionName(arg1: any): any {',
    'public static functionName(arg1: any): any {',
    'private functionName(arg1: any): any {',
    'protected functionName(arg1: any): any {',
    'static functionName(arg1: any): any {',
    'export functionName(arg1: any): any {',
]
// todo es6 default arg values:
// const a = (s = 'a str', n = 1) => {

const namedFunctionExceptions = [
    'if (typeof require === "function") {', //todo
]

describe('addLogging', () => {
    it.only(`Gets function name from a line of code representing a function declaration'`, function() {
        namedFunctions.forEach(namedFunction => {
            expect(parser.getFunctionName(namedFunction)).toBe('functionName')
        })
    })
})
