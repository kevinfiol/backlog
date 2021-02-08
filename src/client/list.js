import { app } from 'hyperapp';
import m from './m.js';

import { mountSortables } from './actions.js';
import ListControls from './components/List/ListControls.js';
import Item from './components/Item/Item.js';
import Section from './components/Section/Section.js';

const LIST_CONTAINER = document.getElementById('list');
const { list } = window.viewData;

console.log(list);

// to do, use undefined, not null
const initialState = {
    list,
    error: null,

    isSortingItems: false,
    isSortingSections: false,

    section: {
        sectionid: null
    },

    item: {
        itemid: null,
        isAdding: false,
        isRemoving: false,
        isEditing: false,

        editForm: {
            itemid: null,
            itemname: '',
            url: ''
        },
        addForm: {
            item: { itemname: '', url: '' },
            sectionid: null,
            itemPosition: null
        },
        removeForm: {
            itemid: null,
            sectionid: null
        }
    }
};

const List = state => 
    m('div',
        m(ListControls, { 
            isSortingItems: state.isSortingItems,
            isSortingSections: state.isSortingSections
        }),

        state.list.sections.map(section =>
            m(Section, { section, isSortingSections: state.isSortingSections },
                // only show items when NOT sorting sections
                !state.isSortingSections &&
                    section.items.map((item, index) =>
                        m(Item, {
                            item,
                            itemPosition: index,
                            itemState: state.item,
                            isSortingItems: state.isSortingItems,
                            key: item.itemid
                        })
                    )
                ,
            )
        )
    )
;

app({
    init: [
        initialState,
        mountSortables()
    ],
    view: List,
    node: LIST_CONTAINER
});