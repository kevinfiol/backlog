function groupBy(key, arr) {
    return arr.reduce((acc, cur) => {
        if (!acc[cur[key]]) acc[cur[key]] = [];
        acc[cur[key]].push(cur);
        return acc;
    }, {});
}

export default groupBy;