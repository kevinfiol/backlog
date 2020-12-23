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
            const isMultiple = keys[i].slice(-1) === 's';
            const key = isMultiple ? keys[i].slice(0, -1) : keys[i];

            if (key in typeMap) {
                const fn = typeMap[key];
                const x = obj[keys[i]];

                if (isMultiple) {
                    for (let j = 0, o = x.length; j < o; j++) {
                        if (!fn(x[j])) onError(key, x[j]);
                    }
                } else if (!fn(x)) {
                    onError(key, x)
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