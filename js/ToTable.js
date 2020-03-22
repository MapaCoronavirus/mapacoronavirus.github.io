function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function ToTable(...args) {
    if (args.length === 1) {
        const [data] = args;
        if (!Array.isArray(data)) throw ('Expected first argument to be of type "array" but got "' + typeof data + '"');
        const keys = data.length === 0 ? [] : Object.keys(data[0]);
        const columnMap = keys.reduce((res, k) => {
            res[k] = capitalize(k);
            return res;
        }, {});
        return ToTable_(columnMap, data);
    }
    else if (args.length === 2 && Array.isArray(args[0])) {
        const [keys, data] = args;
        if (!Array.isArray(keys)) throw ('Expected first argument to be of type "array" but got "' + typeof keys + '"');
        if (!Array.isArray(data)) throw ('Expected second argument to be of type "array" but got "' + typeof data + '"');
        const columnMap = keys.reduce((res, k) => {
            res[k] = capitalize(k);
            return res;
        }, {});
        return ToTable_(columnMap, data);
    }
    else if (args.length === 2) {
        const [columnMap, data] = args;
        if (typeof columnMap !== 'object') {
            if (Array.isArray(columnMap)) {
                throw ('Expected first argument to be of type "object" but got "array"');
            } else {
                throw ('Expected first argument to be of type "array" but got "' + typeof columnMap + '"');
            }
        }
        if (!Array.isArray(data)) throw ('Expected second argument to be of type "array" but got "' + typeof data + '"');
        return ToTable_(columnMap, data);
    }
}

function ToTable_(columnMap, data) {
    const columnNames = Object.values(columnMap);
    const columnKeys = Object.keys(columnMap);
    return `
    <table>
    <tr>
    ${columnNames.map(v => `<th>${v}</th>`).join('')}
    </tr>
    ${data.map(v => `
        <tr>
        ${Object.keys(v)
            .filter(k => columnKeys.indexOf(k) >= 0)
            .map(k => `<td>${v[k]}</td>`)
            .join('')
        }
        </tr>`).join('')
    }
    </table>
    `;
}
