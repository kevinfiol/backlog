import api from './api.js';

const actions = store => {
    const actions = {
        setVal(_, [key, value]) {
            return { [key]: value };
        },

        async refreshList(state) {
            const listid = state.list.listid;

            try {
                const res = await api.getFullList(listid);
                if (!res.ok) throw Error('Could not retrieve list.')
                const { list } = res.data;
                return { list };
            } catch (e) {
                return { error: e.message };
            }
        },

        async apiAction(state, { action, params }) {
            try {
                const res = await api[action](params);
                if (!res.ok) throw Error(`${action} could not be completed.`);
                const newState = await actions.refreshList(state);
                store.setState(newState);
            } catch(e) {
                return { error: e.message };
            }
        },

        // Item
        async addItem(state, { item, sectionid, itemPosition }) {
            await actions.apiAction(state, {
                action: 'addItem',
                params: {
                    item,
                    sectionid,
                    itemPosition
                }
            });
        },

        async editItem(state, item) {
            await actions.apiAction(state, {
                action: 'editItem',
                params: { item }
            });
        },

        async removeItem(state, { itemid, sectionid }) {
            await actions.apiAction(state, {
                action: 'removeItem',
                params: {
                    itemid,
                    sectionid
                }
            });
        },

        // Section
        async editSection(state, { sectionid, sectionname }) {
            await actions.apiAction(state, {
                action: 'editSection',
                params: {
                    sectionid,
                    sectionname
                }
            });
        },

        async removeSection(state, sectionid) {
            await actions.apiAction(state, {
                action: 'removeSection',
                params: { sectionid }
            });
        }
    };

    return actions;
};

export default actions;