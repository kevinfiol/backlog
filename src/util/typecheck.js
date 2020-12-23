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

function typecheck(obj = {}) {
    const keys = Object.keys(obj);

    if (keys.length > 0) {
        const errors = [];

        function onError(type, x) {
            const error = TypeError(`${typeof x} should be ${type}`);
            console.error(error);
            errors.push(error);
        }

        for (let i = 0, n = keys.length; i < n; i++) {
            if (keys[i] in typeMap) {
                const fn = typeMap[keys[i]];
                const x = obj[keys[i]];

                if (isArr(x)) {
                    for (let j = 0, o = x.length; j < o; j++) {
                        if (!fn(x[j])) onError(keys[i], x[j]);
                    }
                } else if (!fn(x)) {
                    onError(keys[i], x)
                }
            }
        }

        if (errors.length > 0) {
            const error = TypeError('TypeError(s) occured');
            error.typeErrors = errors;
            throw error;
        }
    }
}

export default typecheck;