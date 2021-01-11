const typeMap = {
    'number': x => Number.isFinite(x),
    'array': x => Array.isArray(x),
    'boolean': x => typeof x === 'boolean',
    'object': x => x !== null && typeof x === 'object',
    'string': x => typeof x === 'string',
    'function': x => typeof x === 'function',
    'defined': x => x !== undefined
};

function typecheck(obj = {}) {
    const keys = Object.keys(obj);

    if (keys.length > 0) {
        const errors = [];

        function onError(type, x) {
            if (errors.length < 1) {
                console.error('\x1b[41m%s\x1b[0m', 'TypeErrors(s) occured:');
                console.group();
            }
            const error = TypeError(`${typeof x} should be ${type}`);
            const smallStack = error.stack
                .split(' at ')
                .filter(s => !/(TypeError)|(typecheck.js)|(node_modules)|(node:internal)/.test(s))
                .map(function(s) {
                    const filename = s.match(/([^/\\]*)\.(js)|(ts)/g)[0];
                    let line = `> \x1b[43m${filename}\x1b[0m ${s.trim()}`;
                    return line.split(' (').join('\n(');
                })
            ;

            console.error('\x1b[41m%s\x1b[0m', error.message);
            console.group();
            console.error(smallStack.join('\n'));
            console.groupEnd();
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
            console.groupEnd();
            const error = TypeError('TypeError(s) occured');
            error.typeErrors = errors;
            throw error;
        }
    }
}

export default typecheck;