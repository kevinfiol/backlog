import { app } from 'hyperapp';
import m from './m.js';

import { mountSortableItems, mountSortableSections } from './actions.js';
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

    isSorting: false,
    showItems: true,

    section: {
        sectionid: null,
        sectionname: ''
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
        m(ListControls, { isSorting: state.isSorting }),

        state.list.sections.map(section =>
            m(Section, {
                section,
                isSorting: state.isSorting,
                key: section.sectionid
            },
                state.showItems && 
                    section.items.map((item, index) =>
                        m(Item, {
                            item,
                            itemPosition: index,
                            itemState: state.item,
                            isSorting: state.isSorting,
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
        mountSortableItems(),
        mountSortableSections()
    ],
    view: List,
    node: LIST_CONTAINER
});