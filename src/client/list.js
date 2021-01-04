import { app } from 'hyperapp';
import m from './m.js';

import Item from './components/Item/Item.js';
import Section from './components/Section/Section.js';

const LIST_CONTAINER = document.getElementById('list');
const { list } = window.viewData;

console.log(list);

const initialState = {
    list,
    error: null,

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
        state.list.sections.map(section =>
            m(Section, { section },
                section.items.map((item, index) =>
                    m(Item, {
                        item,
                        itemPosition: index,
                        itemState: state.item,
                        key: item.itemid
                    })
                )
            )
        )
    )
;

app({
    init: initialState,
    view: List,
    node: LIST_CONTAINER
});