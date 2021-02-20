const actions = store => ({
    setVal(_, [key, value]) {
        return { [key]: value };
    }
});

export default actions;