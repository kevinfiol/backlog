import { isArr, isBool, isNum, isObj, isStr, isDef, isFn } from 'jty';

const typeMap = {
    'number': isNum,
    'array': isArr,
    'boolean': isBool,
    'object': isObj,
    'string': isStr,
    'function': isFn,
    'defined': isDef,
    'tString': s => isStr(s.trim(), 1),
    'tArray': a => isArr(a, 1)
};

function validate(schema, params) {
    const result = { ok: true, errors: [] };
    const entries = Object.entries(params);

    for (let i = 0, n = entries.length; i < n; i++) {
        const [key, value] = entries[i];
        const [type, guards] = isArr(schema[key]) ? schema[key] : [schema[key], undefined];
        const fn = typeMap[type];

        if (guards ? !fn(value, ...guards) : !fn(value)) {
            if (result.ok) result.ok = false;
            result.errors.push(
                TypeError(`"${key}" (${value}) should be "${type}"${guards ? ` with constraits ${guards}` : ''}.`)
            );
        }
    }

    return result;
}

export default validate;