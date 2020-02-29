
module.exports = (p1, p2) => {
    // should receive dlog ({moduleNaming: {p1,p2}, { arguments, info: { module default named by file. }}})
}


export default (p1, p2) => {
    // should receive dlog ({moduleNaming: {p1,p2}, { arguments, info: { module default named by file. }}})
}



// module.exports = p1 => {
//     // should receive dlog ({moduleNaming: {p1,p2}, { arguments, info: { module default named by file. }}})
// }

// @see https://nodejs.org/api/modules.html#modules_module_exports

const EventEmitter = require('events');

// module.exports = new EventEmitter();

// const { PI } = Math;

// exports.area = (r) => PI * r ** 2;


// @see https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export

// Exporting individual features
export let name1, name2, …, nameN; // also var, const
export let name1 = …, name2 = …, …, nameN; // also var, const
export function functionName() { }
export class ClassName { }

// Export list
export { name1, name2, nameN };

// Renaming exports
export { variable1 as name1, variable2 as name2, nameN };

// Exporting destructured assignments with renaming
export const { name1, name2: bar } = o;

// Default exports
export default expression;
// export default function p1 { … } // also class, function* VALID?
export default function name1(…) { … } // also class, function*
export { name1 as default, … };

// Aggregating modules
// export * from …; // does not set the default export
// export * as name1 from …;
// export { name1, name2, …, nameN } from …;
// export { import1 as name1, import2 as name2, …, nameN } from …;
// export { default } from …;



// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module/exports
var worker = new Worker("wasm_worker.js");

WebAssembly.compileStreaming(fetch('simple.wasm'))
    .then(mod =>
        worker.postMessage(mod)
    );