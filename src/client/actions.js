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
                console.log('line 17');
                return { error: e.message };
            }
        },

        // Item
        async addItem(state, { item, sectionid, itemPosition }) {
            try {
                const res = await api.addItem({ item, sectionid, itemPosition });
                if (!res.ok) throw Error('Could not add item');
                const newState = await actions.refreshList(state);
                store.setState(newState);
            } catch (e) {
                return { error: e.message };
            }
        },

        async editItem(state, item) {
            try {
                const res = await api.editItem(item);
                if (!res.ok) throw Error('Could not edit item');
                const newState = await actions.refreshList(state);
                store.setState(newState);
            } catch (e) {
                return { error: e.message };
            }
        },

        async removeItem(state, { itemid, sectionid }) {
            try {
                const res = await api.removeItem({ itemid, sectionid });
                if (!res.ok) throw Error('Could not remove item');
                const newState = await actions.refreshList(state);
                store.setState(newState);
            } catch (e) {
                return { error: e.message };
            }
        },

        // Section
        async editSection(state, { sectionid, sectionname }) {
            try {
                const res = await api.editSection({ sectionid, sectionname });
                if (!res.ok) throw Error('Could not edit section');
                const newState = await actions.refreshList(state);
                store.setState(newState);
            } catch(e) {
                return { error: e.message };
            }
        },

        async removeSection(state, sectionid) {
            try {
                const res = await api.removeSection(sectionid);
                if (!res.ok) throw Error('Could not remove section');
                const newState = await actions.refreshList(state);
                store.setState(newState);
            } catch(e) {
                return { error: e.message };
            }
        }
    };

    return actions;
};

export default actions;