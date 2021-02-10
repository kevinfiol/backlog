import { app } from 'hyperapp';
import m from './m.js';

import { mountSortableItems, mountSortableList } from './actions/Sortable.js';
import ListControls from './components/List/ListControls.js';
import Item from './components/Item/Item.js';
import Section from './components/Section/Section.js';

const LIST_CONTAINER = document.getElementById('list');
const { list } = window.viewData;

// to do, use undefined, not null
const initialState = {
    list,
    error: null,
    sortables: [],

    isSorting: false,
    showItems: true,

    section: {
        sectionid: null,
        isAdding: false,
        isRemoving: false,
        isEditing: false,

        editForm: {
            sectionid: null,
            sectionname: ''
        },
        addForm: {
            sectionname: ''
        }
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
        m(ListControls, { isSorting: state.isSorting, sectionState: state.section }),

        state.list.sections.map(section =>
            m(Section, {
                section,
                isSorting: state.isSorting
            },
                state.showItems && 
                    section.items.map((item, index) =>
                        m(Item, {
                            item,
                            itemPosition: index,
                            itemState: state.item,
                            isSorting: state.isSorting,
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
        mountSortableList(),
        mountSortableItems()
    ],
    view: List,
    node: LIST_CONTAINER
});