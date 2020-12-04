function fromIntCSV(csv) {
    return csv.trim().length ? csv.split(',').map(n => parseInt(n)) : [];
}

export {
    fromIntCSV
};