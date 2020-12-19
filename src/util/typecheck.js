import { isArr, isBool, isNum, isObj, isStr, isDef, isFn } from 'jty';

const typeMap = {
    'number': isNum,
    'array': isArr,
    'boolean': isBool,
    'object': isObj,
    'string': isStr,
    'function': isFn,
    'defined': isDef
};

function typecheck(...tuples) {
    const errors = [];

    for (let i = 0, n = tuples.length; i < n; i++) {
        if ((tuples[i][0] in typeMap) && !typeMap[tuples[i][0]](tuples[i][1])) {
            errors.push(TypeError(`${typeof tuples[i][1]} should be ${tuples[i][0]}`));
        }
    }

    // should throw an Error object + an array of errors instead. need to make this more sophisticated
    if (errors.length) {
        console.error(errors);
        throw errors;
    }
}

export default typecheck;