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
            const error = TypeError(`${typeof tuples[i][1]} should be ${tuples[i][0]}`);
            console.error(error);
            errors.push(error);
        }
    }

    if (errors.length) {
        const error = TypeError('TypeError(s) occured');
        error.typeErrors = errors;
        throw error;
    }
}

export default typecheck;